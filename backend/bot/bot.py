
from aiogram import Bot, Dispatcher, Router, F
from aiogram.filters import CommandStart, CommandObject
from aiogram.types import Message

from core import settings
from db.repository import UsersRepository

bot = Bot(settings.TG_BOT_TOKEN)
dp = Dispatcher()
router = Router()

@router.message(CommandStart())
async def start_command(message: Message, command: CommandObject):
    url = settings.DOMAIN if not command.args else f"{settings.DOMAIN}?ref={command.args}"
    await message.answer(f"Привет! Открой приложение: {url}")
