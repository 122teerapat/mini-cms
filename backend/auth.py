from datetime import datetime , timedelta ,timezone
import bcrypt
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security   import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
import models

SECRET = "secretkey123"
bearer = HTTPBearer()


def hash_password(password:str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def check_password(plain:str , hashed:str) -> bool:
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

def create_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=8)
    return jwt.encode({"sub": username, "exp": expire}, SECRET, algorithm="HS256")
 
 
def require_login(
    cred: HTTPAuthorizationCredentials = Depends(bearer),
    db:   Session = Depends(get_db),
) -> models.User:
    try:
        data = jwt.decode(cred.credentials, SECRET, algorithms=["HS256"])
        user = db.query(models.User).filter_by(username=data["sub"]).first()
        if not user:
            raise ValueError()
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="กรุณา login ก่อน")
    return user