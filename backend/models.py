from sqlalchemy import Column, Integer , String, Text
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True , index=True)
    username = Column(String(100), unique=True , nullable=False , index=True)
    hashed_password = Column(String(255) , nullable=False)



class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer , primary_key=True , index=True)
    title = Column(String(255), nullable=False)
    summary= Column(Text, nullable=True)
    content= Column(Text, nullable=False)
    status= Column(String(20) ,nullable=False , default="draft") # draft | published
    view_count = Column(Integer, default=0, nullable=False)
    like_count= Column(Integer, default=0, nullable=False)