
import asyncio
import logging

import httpx

from core import redis
from utils.round_down import round_down

async def get_token_price(symbol: str = "BTCUSDT") -> None:
    api_url = f"https://api.binance.com/api/v3/ticker/price?symbol={symbol}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(api_url)
            response.raise_for_status()
    except httpx.HTTPError as e:
        logging.error(f"HTTP error while fetching token price: {e}")
        return

    try:
        data = response.json()
        price = round_down(float(data["price"]))
    except (KeyError, ValueError) as e:
        logging.error(f"Invalid data format from Binance API: {e}")
        return

    try:
        await redis.set("token_price", price)
        logging.info("Successfully updated token price: %s", price)
    except Exception as e:
        logging.error(f"Failed to set token price in Redis: {e}")


async def task_get_token_price():
    retries = 0
    while True:
        try:
            await get_token_price()
            await asyncio.sleep(300)
            retries = 0  # сбрасываем при успехе
        except Exception as e:
            logging.exception("Unexpected error in price update task", exc_info=e)
            retries += 1
            backoff = min(900, 300 * (retries + 1))  # постепенный рост паузы, макс 15 минут
            await asyncio.sleep(backoff)
