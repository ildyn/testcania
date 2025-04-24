
import logging
from datetime import datetime, UTC, timedelta

import anyio

from core import get_token_price, set_user_rating
from db.database import transaction
from db.repository import GameRepository, UsersRepository
from utils.round_down import round_down


async def scheduler_games_task():
    while True:
        try:
            await wait_game()
        except Exception as e:
            logging.exception("Exception in scheduler_games_task", exc_info=e)
        await anyio.sleep(5)  # уменьшено количество итераций, снижена нагрузка


@transaction()
async def process_game_bet(game_id: int):
    try:
        game = await GameRepository.get_or_raise_by_id(game_id)

        token_price = round_down(await get_token_price())
        if token_price is None:
            logging.warning("Token price is None, skipping bet processing.")
            return

        is_course_correct = token_price > round_down(game.course)

        total_game_win_pool_usdt = await GameRepository.get_win_pool(game.id, "USDT") * 0.97
        total_game_win_pool_choice_usdt = await GameRepository.get_win_pool(
            game.id, "USDT", "YES" if is_course_correct else "NO"
        )
        total_game_win_pool_words = await GameRepository.get_win_pool(game.id, "WORDS")
        total_game_win_pool_choice_words = await GameRepository.get_win_pool(
            game.id, "WORDS", "YES" if is_course_correct else "NO"
        )

        win_count, lose_count = 0, 0

        for bet in game.users_games:
            user = await UsersRepository.get_by_id(bet.user_id)
            if user is None:
                continue

            correct_choice = (
                (is_course_correct and bet.choose == "YES") or
                (not is_course_correct and bet.choose == "NO")
            )

            if bet.currency == "USDT":
                ratio = (total_game_win_pool_usdt / total_game_win_pool_choice_usdt) if total_game_win_pool_choice_usdt else 1
            else:
                ratio = (total_game_win_pool_words / total_game_win_pool_choice_words) if total_game_win_pool_choice_words else 1

            if correct_choice:
                win_amount = round_down(bet.total_rate * ratio)
                if bet.currency == "USDT":
                    user.balance_usdt += win_amount
                    await set_user_rating(user.id, await GameRepository.get_user_rating(user.id))
                else:
                    user.balance += win_amount

                user.wins += 1
                bet.win_total_rate = win_amount
                win_count += 1

                if user.ref_id:
                    ref_user = await UsersRepository.get_by_id(user.ref_id)
                    if bet.currency == "WORDS":
                        referral_amount = round_down(bet.total_rate * 0.05)
                        await UsersRepository.create_record_of_referral(
                            user_id=user.id,
                            ref_id=user.ref_id,
                            user_game_id=bet.id,
                            amount=referral_amount,
                            currency=bet.currency,
                        )
                        ref_user.balance += referral_amount
            else:
                lose_amount = round_down(bet.total_rate * ratio)
                bet.win_total_rate = -lose_amount
                lose_count += 1

        game.is_computed = True
        logging.info(f"Processed game ID {game.id}: {win_count} wins, {lose_count} losses.")

    except Exception as e:
        logging.exception("Error processing game bet", exc_info=e)


async def wait_game():
    try:
        next_game = await GameRepository.game_to_compute()

        if next_game is None:
            await GameRepository.create_next_game(datetime.now(UTC), 0)
            await anyio.sleep(10)
            return

        time_sleep = (next_game.date_game - datetime.now(UTC)).total_seconds()

        if time_sleep < 0:
            last_game = await GameRepository.get_last_game_by_date()
            if last_game is not None:
                await GameRepository.create_next_game(last_game.date_game, last_game.course)
        else:
            count_next_games = await GameRepository.count_next_games()
            if count_next_games <= 1:
                await GameRepository.create_next_game(datetime.now(UTC) + timedelta(minutes=10), 0)

        if time_sleep > 0:
            await anyio.sleep(time_sleep)

        await GameRepository.set_actual_course_for_game(next_game.id)
        logging.info(f"Starting game computation for ID {next_game.id}")
        await process_game_bet(next_game.id)

    except Exception as e:
        logging.exception("Error in wait_game()", exc_info=e)
