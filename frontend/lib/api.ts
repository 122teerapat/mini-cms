
const API = "http://localhost:8000"   // URL ของ backend


export type Article = {
  id:         number
  title:      string
  summary:    string
  content:    string
  status:     "draft" | "published"
  view_count: number
  like_count: number
}

const getToken = () => localStorage.getItem("token") || ""

const authHeader = () => ({
  "Authorization": `Bearer ${getToken()}`,
  "Content-Type": "application/json",
})


// เข้าสู่ระบบ เก็บ token ลง localStorage
export async function login(username: string, password: string) {
  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error("username หรือ password ไม่ถูกต้อง")
  const data = await res.json()
  localStorage.setItem("token", data.token)
}

// ออกจากระบบลบ token ออก
export function logout() {
  localStorage.removeItem("token")
}

// เช็คว่า login อยู่ไหม และ token ยังไม่หมดอายุ
export function isLoggedIn(): boolean {
  const token = getToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 > Date.now()   // exp = เวลาหมดอายุ (วินาที)
  } catch {
    return false
  }
}


// PUBLIC

// ดึงบทความที่ publish แล้วทั้งหมด (หน้าแรก)
export async function getPublishedArticles(): Promise<Article[]> {
  const res = await fetch(`${API}/api/articles/public`)
  if (!res.ok) throw new Error("โหลดบทความไม่สำเร็จ")
  return res.json()
}

// ดึงบทความ
export async function getArticle(id: number): Promise<Article> {
  const res = await fetch(`${API}/api/articles/public/${id}`)
  if (!res.ok) throw new Error("ไม่พบบทความ")
  return res.json()
}

// กด Like → backend เพิ่ม like_count
// ใน lib/api.ts — หาฟังก์ชัน likeArticle
export async function likeArticle(id: number): Promise<Article> {
  const res = await fetch(`${API}/api/articles/public/${id}/like`, {
    method: "POST",
  })
  if (!res.ok) throw new Error("กด like ไม่สำเร็จ")
  return res.json()
}



// ADMIN — ต้อง login (ส่ง token ทุก request)

// ดึงบทความทั้งหมด (ทั้ง draft และ published)
export async function adminGetArticles(): Promise<Article[]> {
  const res = await fetch(`${API}/api/articles`, { headers: authHeader() })
  if (res.status === 401) throw new Error("401")   // token หมดอายุ → ให้ logout
  if (!res.ok) throw new Error("โหลดบทความไม่สำเร็จ")
  return res.json()
}

// สร้างบทความใหม่
export async function adminCreateArticle(
  data: Pick<Article, "title" | "summary" | "content" | "status">
): Promise<Article> {
  const res = await fetch(`${API}/api/articles`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("สร้างบทความไม่สำเร็จ")
  return res.json()
}

// แก้ไขบทความ
export async function adminUpdateArticle(
  id: number,
  data: Pick<Article, "title" | "summary" | "content" | "status">
): Promise<Article> {
  const res = await fetch(`${API}/api/articles/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("แก้ไขบทความไม่สำเร็จ")
  return res.json()
}

// ลบบทความ
export async function adminDeleteArticle(id: number): Promise<void> {
  await fetch(`${API}/api/articles/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  })
}