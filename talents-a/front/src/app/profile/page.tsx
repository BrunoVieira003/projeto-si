// app/profile/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn, logout } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao seu perfil!</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  )
}
