
from fastapi import APIRouter, Depends

from endpoint.models import SomeModel  # пример
from endpoint.depends import some_dependency  # пример

router = APIRouter(prefix="/api", tags=["API"])

@router.get("/status", summary="Check API status")
async def get_status():
    return {"status": "ok"}

# Здесь можно подключать другие модули с роутами
# from .user_routes import router as user_router
# router.include_router(user_router)
