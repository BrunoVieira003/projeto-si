// app/login/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import { login } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password)
    if(response.ok){
        toast.success(response.message)
        router.push('profile')
    }else{
        toast.error(response.message)
    }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm title="Login" onSubmit={handleLogin} linkText="Não tem conta?" linkHref="/register" />
    </div>
  )
}
