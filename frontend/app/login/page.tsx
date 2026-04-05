"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    if (!username || !password) {
      setError("กรุณากรอก username และ password")
      return
    }

    setLoading(true)
    setError("")

    try {
      await login(username, password)     // เรียก API → เก็บ token
      router.push("/admin/articles")      // สำเร็จ → ไปหน้า admin
    } catch (e: any) {
      setError(e.message)                 // ไม่สำเร็จ → แสดง error
    } finally {
      setLoading(false)
    }
  }

  // ─── render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-80">

        {/* หัว */}
        <h1 className="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h1>

        {/* ช่อง username */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-green-500"
          placeholder="admin"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        {/* ช่อง password */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm mb-5 outline-none focus:border-green-500"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}  // กด Enter แทนปุ่มได้
        />

        {/* แสดง error (ถ้ามี) */}
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* ปุ่ม login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium text-sm
                     hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        
      </div>
    </div>
  )
}
