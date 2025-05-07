// app/login/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password)
    alert(response.message)
    if(response.ok){
        router.push('profile')
    }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm title="Login" onSubmit={handleLogin} linkText="Não tem conta?" linkHref="/register" />
    </div>
  )
}
