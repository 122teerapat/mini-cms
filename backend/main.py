from fastapi import FastAPI, Depends ,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine , get_db
from auth import check_password, create_token, require_login
from schemas import LoginBody , ArticleBody
import models


models.Base.metadata.create_all(engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)


#Auth
@app.post("/api/login")
def login(body:LoginBody, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(username=body.username).first()
    if not user or not check_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="username or password incorrect")
    return{"token": create_token(user.username)}


#Public
@app.get("/api/articles/public")
def public_list(db:Session = Depends(get_db)):
    return db.query(models.Article).filter_by(status="published").all()

@app.get("/api/articles/public/{id}")
def public_get(id:int, db:Session = Depends(get_db)):
    article = db.query(models.Article).filter_by(id=id, status="published").first()
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    article.view_count += 1
    db.commit()
    db.refresh(article)   
    return article


@app.post("/api/articles/public/{id}/like")
def like(id:int , db:Session = Depends(get_db)):
    article = db.query(models.Article).filter_by(id=id, status="published").first()
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    article.like_count += 1
    db.commit()
    db.refresh(article)   
    return article


#admin
@app.get("/api/articles")
def admin_list(db: Session = Depends(get_db), _=Depends(require_login)):
    return db.query(models.Article).all()


@app.post("/api/articles" ,status_code=201)
def admin_create(body: ArticleBody, db: Session = Depends(get_db), _=Depends(require_login)):
    if not body.title.strip():
        raise HTTPException(400, "title ห้ามว่าง")
    if not body.content.strip():
        raise HTTPException(400, "content ห้ามว่าง")
    if body.status not in ("draft", "published"):
        raise HTTPException(400, "status ต้องเป็น draft หรือ published")
    article = models.Article(**body.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

@app.put("/api/articles/{id}")
def admin_update(id: int, body:ArticleBody , db: Session=Depends(get_db), _=Depends(require_login)):
    article = db.query(models.Article).filter_by(id=id).first()
    if not article:
        raise HTTPException(404, "Not found")
    for key , val in body.model_dump().items():
        setattr(article,key ,val)
    db.commit()
    return article

@app.delete("/api/articles/{id}", status_code=204)
def admin_delete(id:int , db: Session = Depends(get_db), _=Depends(require_login)):
    article = db.query(models.Article).filter_by(id=id).first()
    if not article:
        raise HTTPException(404,"Not found")
    db.delete(article)
    db.commit()