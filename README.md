# Mini CMS

Full Stack สร้างด้วย Next.js + FastAPI + SQLite

---

## Tech Stack

| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite |
| Auth | JWT |

---

## โครงสร้างโปรเจค
---
mini-cms/
├── backend/
│   ├── main.py        # API routes ทั้งหมด
│   ├── database.py    # เชื่อมต่อ DB
│   ├── models.py      # โครงสร้างตาราง
│   ├── schemas.py     # รูปแบบข้อมูล
│   ├── auth.py        # JWT authentication
│   ├── seed.py        # ข้อมูลตัวอย่าง
│   ├── schema.sql     # SQL schema
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── page.tsx                   # หน้าแรก /
    │   ├── login/page.tsx             # หน้า login /login
    │   ├── admin/articles/page.tsx    # หน้า admin /admin/articles
    │   └── articles/[id]/page.tsx     # หน้าบทความ /articles/[id]
    └── lib/
        └── api.ts     # ฟังก์ชันเรียก API
```

---

## วิธีติดตั้งและรัน

### require
- Python 3.11+
- Node.js 18+

---

### Backend

```bash
cd backend

# สร้าง virtual environment
python -m venv venv

# เปิดใช้งาน (Windows)
venv\Scripts\activate

# ติดตั้ง packages
pip install -r requirements.txt

# ใส่ข้อมูลตัวอย่าง
python seed.py

# รัน server
uvicorn main:app --reload
```

Backend จะรันที่ http://localhost:8000

ดู API docs ได้ที่ http://localhost:8000/docs

---

### Frontend

เปิด Terminal ใหม่:

```bash
cd frontend

# ติดตั้ง packages
npm install

# รัน dev server
npm run dev
```

Frontend จะรันที่ http://localhost:3000

---

## Test Account
| Username | admin |
| Password | admin123 |

---

## หน้าทั้งหมด

| URL | คำอธิบาย |
|---|---|
| http://localhost:3000 | หน้าแรก แสดงบทความที่เผยแพร่แล้ว |
| http://localhost:3000/articles/[id] | หน้าอ่านบทความ |
| http://localhost:3000/login | หน้า login สำหรับ admin |
| http://localhost:3000/admin/articles | หน้าจัดการบทความ (ต้อง login) |

---
