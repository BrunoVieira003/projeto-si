// app/profile/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn, logout } from '@/lib/auth'
import { getProfile } from '@/lib/user'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)

  const fetchProfile = async ()=>{
    const response = await getProfile()
    if(response.ok){
        setUser(response.data)
    }
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex flex-col gap-3 p-8">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao seu perfil!</h1>
      <div>
          <p>Email</p>
          <p className='text-2xl'>{user?.email}</p>
      </div>
      <div>
          <p>Cpf</p>
          <p className='text-2xl'>{user?.cpf}</p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-8 w-fit"
      >
        Sair
      </button>
    </div>
  )
}
