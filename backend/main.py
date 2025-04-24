
import asyncio
import logging

import anyio
import uvicorn
from aiogram import Bot
from aiogram.types import MenuButtonWebApp, WebAppInfo
from anyio.abc import TaskGroup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from bot.bot import dp, bot
from core import settings
from endpoint.http import router
from utils.get_token_price import task_get_token_price
from utils.scheduler_games_task import scheduler_games_task

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="CryptoBot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def on_startup():
    bot_instance: Bot = bot
    await bot_instance.set_chat_menu_button(menu_button=MenuButtonWebApp(
        text="Открыть приложение",
        web_app=WebAppInfo(url=settings.DOMAIN)
    ))

    async with anyio.create_task_group() as tg:
        tg.start_soon(task_get_token_price)
        tg.start_soon(scheduler_games_task)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
