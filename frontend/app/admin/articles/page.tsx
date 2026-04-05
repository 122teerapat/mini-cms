"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Article, isLoggedIn, logout,
  adminGetArticles, adminCreateArticle,
  adminUpdateArticle, adminDeleteArticle,
} from "@/lib/api"

// ค่าเริ่มต้นของฟอร์ม 
const emptyForm = { title: "", summary: "", content: "", status: "draft" as const }

export default function AdminPage() {
  const router = useRouter()

  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading]   = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState<Article | null>(null)  // null = สร้างใหม่
  const [form, setForm]           = useState<{ title: string; summary: string; content: string; status: "draft" | "published" }>(emptyForm)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState("")


  // โหลดบทความ
  async function loadArticles() {
    try {
      const data = await adminGetArticles()
      setArticles(data)
    } catch (e: any) {
      if (e.message === "401") {
        logout()
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  // เช็ค login ก่อนโหลดหน้า
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login") 
      return
    }
    loadArticles()
  }, [])


  //สร้างบทความใหม่
  function openCreate() {
    setEditing(null)          
    setForm(emptyForm)        
    setFormError("")
    setShowModal(true)
  }

  //แก้ไขบทความ
  function openEdit(article: Article) {
    setEditing(article)       // เก็บบทความที่จะแก้ไข
    setForm({                 // ใส่ข้อมูลเดิมลงฟอร์ม
      title:   article.title,
      summary: article.summary,
      content: article.content,
      status:  article.status,
    })
    setFormError("")
    setShowModal(true)
  }

  //บันทึก
  async function handleSave() {
    // ตรวจสอบข้อมูล
    if (!form.title.trim()) { setFormError("กรุณาใส่ชื่อบทความ"); return }
    if (!form.content.trim()) { setFormError("กรุณาใส่เนื้อหา"); return }

    setSaving(true)
    setFormError("")

    try {
      if (editing) {
        await adminUpdateArticle(editing.id, form)  
      } else {
        await adminCreateArticle(form)               
      }
      setShowModal(false)
      loadArticles()   // โหลดรายการใหม่
    } catch (e: any) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  //ลบบทความ 
  async function handleDelete(id: number) {
    if (!confirm("ยืนยันลบบทความนี้?")) return
    await adminDeleteArticle(id)
    setArticles(prev => prev.filter(a => a.id !== id)) 
  }


 
  if (loading) return <p className="text-center py-20 text-gray-400">กำลังโหลด...</p>

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── แถบหัว ── */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">จัดการบทความ</h1>
        <div className="flex gap-4 text-sm">
          <a href="/" className="text-green-600 hover:underline">ดูหน้าเว็บ ↗</a>
          <button
            onClick={() => { logout(); router.push("/login") }}
            className="text-gray-500 hover:text-gray-700"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">

        {/* ปุ่มสร้างบทความใหม่ */}
        <button
          onClick={openCreate}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium mb-5 hover:bg-green-700 transition"
        >
          + สร้างบทความใหม่
        </button>

        {/* ── ตารางบทความ ── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr>
                <th className="text-left px-5 py-3">ชื่อบทความ</th>
                <th className="text-left px-4 py-3">สถานะ</th>
                <th className="text-left px-4 py-3">ยอดดู</th>
                <th className="text-left px-4 py-3">ถูกใจ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    ยังไม่มีบทความ กด "+ สร้างบทความใหม่" เพื่อเริ่ม
                  </td>
                </tr>
              )}
              {articles.map((article, i) => (
                <tr key={article.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>

                  {/* ชื่อบทความ */}
                  <td className="px-5 py-3 font-medium max-w-xs truncate">
                    {article.title}
                  </td>

                  {/* สถานะ — badge สีต่างกัน */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {article.status === "published" ? "เผยแพร่" : "ร่าง"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500">{article.view_count}</td>
                  <td className="px-4 py-3 text-gray-500">{article.like_count}</td>

                  
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => openEdit(article)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      ลบ
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


     
      {showModal && (
       
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

           
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="font-bold text-lg">
                {editing ? "แก้ไขบทความ" : "สร้างบทความใหม่"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

          
            <div className="px-6 py-5 space-y-4">

           
              <div>
                <label className="block text-sm font-medium mb-1">
                  title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  placeholder="ใส่ชื่อบทความ"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

           
              <div>
                <label className="block text-sm font-medium mb-1">
                  summary
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  placeholder="สรุปสั้นๆ"
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                />
              </div>

            
              <div>
                <label className="block text-sm font-medium mb-1">
                  content <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 resize-none"
                  placeholder="เนื้อหาบทความ"
                  rows={6}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium mb-1">status</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                >
                  <option value="draft">ร่าง (Draft) — ไม่แสดงหน้าเว็บ</option>
                  <option value="published">เผยแพร่ (Published) — แสดงหน้าเว็บ</option>
                </select>
              </div>

        
              {formError && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                  {formError}
                </p>
              )}

       
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium
                             hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
