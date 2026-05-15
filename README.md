# Mini CMS

Full Stack Content Management System built with Next.js + FastAPI + SQLite

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite |
| Authentication | JWT |

---

## Project Structure

```
mini-cms/
├── backend/
│   ├── main.py        # All API routes
│   ├── database.py    # Database connection
│   ├── models.py      # Database table schemas
│   ├── schemas.py     # Data validation schemas
│   ├── auth.py        # JWT authentication
│   ├── seed.py        # Sample data
│   ├── schema.sql     # SQL schema
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── page.tsx                   # Home page /
    │   ├── login/page.tsx             # Login page /login
    │   ├── admin/articles/page.tsx    # Admin panel /admin/articles
    │   └── articles/[id]/page.tsx     # Article detail page /articles/[id]
    └── lib/
        └── api.ts     # API utility functions
```

---

## Installation and Setup

### Requirements

- Python 3.11+
- Node.js 18+

---

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Load sample data
python seed.py

# Run the server
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`

API documentation available at `http://localhost:8000/docs`

---

### Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run at `http://localhost:3000`

---

## Test Credentials

| Field | Value |
|-------|-------|
| Username | admin |
| Password | admin123 |

---

## Available Pages

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Home page - displays published articles |
| `http://localhost:3000/articles/[id]` | Article detail page |
| `http://localhost:3000/login` | Admin login page |
| `http://localhost:3000/admin/articles` | Article management panel (requires login) |

---

## Features

### Frontend Features
- **Home Page**: Browse and view all published articles
- **Article Detail**: Read full article content
- **Login**: Admin authentication with JWT tokens
- **Admin Panel**: Create, edit, delete articles
- **Responsive Design**: Works on desktop and mobile

### Backend Features
- **RESTful API**: Complete API for content management
- **JWT Authentication**: Secure user authentication
- **Database Models**: Article, User, and related models
- **Data Validation**: Pydantic schemas for input validation
- **API Documentation**: Auto-generated Swagger UI

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout

### Articles
- `GET /api/articles` - Get all published articles
- `GET /api/articles/{id}` - Get article by ID
- `POST /api/articles` - Create new article (requires auth)
- `PUT /api/articles/{id}` - Update article (requires auth)
- `DELETE /api/articles/{id}` - Delete article (requires auth)

### Users
- `GET /api/users/profile` - Get current user profile (requires auth)

---

## Development

### Running Both Frontend and Backend

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

**Backend:**
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

---

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password_hash` - Hashed password
- `email` - Email address
- `created_at` - Creation timestamp

### Articles Table
- `id` - Primary key
- `title` - Article title
- `content` - Article content
- `slug` - URL-friendly title
- `author_id` - Reference to user
- `published` - Publication status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Change the port
uvicorn main:app --reload --port 8001
```

**Virtual environment not working:**
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Change the port
npm run dev -- -p 3001
```

**Dependencies not installing:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JWT Documentation](https://jwt.io)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues and questions, please open an issue on the project repository.

---

**Happy Coding! 🚀**
