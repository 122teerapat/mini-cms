"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Article, getPublishedArticles } from "@/lib/api"

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getPublishedArticles()
      .then(setArticles)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
  
      <div className="bg-white border-b px-6 py-5">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📰 บทความทั้งหมด</h1>
          <Link href="/login" className="text-sm text-green-600">Admin ↗</Link>
        </div>
      </div>

     
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {loading && <p className="text-center text-gray-400 py-10">กำลังโหลด...</p>}

        {!loading && articles.length === 0 && (
          <p className="text-center text-gray-400 py-10">ยังไม่มีบทความที่เผยแพร่</p>
        )}

        {articles.map(a => (
          <Link key={a.id} href={`/articles/${a.id}`}>
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer border">
              <h2 className="font-bold text-lg mb-1">{a.title}</h2>
              {a.summary && <p className="text-gray-500 text-sm mb-3">{a.summary}</p>}
              <div className="flex gap-4 text-xs text-gray-400">
                <span>👁 {a.view_count} ครั้ง</span>
                <span>❤️ {a.like_count} ถูกใจ</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
