"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Article, getArticle, likeArticle } from "@/lib/api"

export default function ArticlePage() {
  const { id }   = useParams()
  const router   = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked]     = useState(false)

  useEffect(() => {
    getArticle(Number(id))
      .then(setArticle)
      .catch(() => router.replace("/"))
      .finally(() => setLoading(false))
  }, [id])

  async function handleLike() {
    if (liked || !article) return
    setArticle(await likeArticle(article.id))
    setLiked(true)
  }

  if (loading) return <p className="text-center py-20 text-gray-400">กำลังโหลด...</p>
  if (!article) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-green-600 text-sm">← กลับหน้าแรก</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>

          {article.summary && (
            <p className="text-gray-500 mb-4">{article.summary}</p>
          )}

          <div className="flex gap-4 text-sm text-gray-400 pb-5 mb-5 border-b">
            <span>👁 {article.view_count} ครั้ง</span>
            <span>❤️ {article.like_count} ถูกใจ</span>
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </p>

          <div className="mt-10 text-center">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition ${
                liked
                  ? "bg-red-50 text-red-400 border border-red-200 cursor-default"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {liked ? `❤️ ถูกใจแล้ว (${article.like_count})` : "❤️ กดถูกใจ"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
