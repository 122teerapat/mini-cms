# schemas.py — กำหนดรูปแบบข้อมูลที่รับเข้า / ส่งออก API
from pydantic import BaseModel
from typing import Optional


class LoginBody(BaseModel):
    username: str
    password: str


class ArticleBody(BaseModel):
    title:   str
    summary: Optional[str] = ""
    content: str
    status:  Optional[str] = "draft"   # draft | published