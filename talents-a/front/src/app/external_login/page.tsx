// app/login/page.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import { login } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function PortabilityLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callback = searchParams.get('callback')

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password, true)
    if(response.ok && callback){
        toast.success(response.message)
        router.push(callback + '?token=' + response.data)
    }else{
        toast.error(response.message)
    }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm title="Logar com sua conta" onSubmit={handleLogin} />
    </div>
  )
}
