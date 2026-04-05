
CREATE TABLE articles (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	summary TEXT, 
	content TEXT NOT NULL, 
	status VARCHAR(20) NOT NULL, 
	view_count INTEGER NOT NULL, 
	like_count INTEGER NOT NULL, 
	PRIMARY KEY (id)
)

;


CREATE TABLE users (
	id INTEGER NOT NULL, 
	username VARCHAR(100) NOT NULL, 
	hashed_password VARCHAR(255) NOT NULL, 
	PRIMARY KEY (id)
)

;

