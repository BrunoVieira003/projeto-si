// app/register/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import RegisterForm from '@/components/RegisterForm'
import { registerUser } from '@/lib/user'

export default function RegisterPage() {
  const router = useRouter()

  const handleRegister = async (email: string, password: string, cpf: string) => {
    const response = await registerUser(email, password, cpf)
    alert(response.message)
    if(response.ok){
        router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <RegisterForm title="Cadastro" onSubmit={handleRegister} linkText="Já tem conta?" linkHref="/login" />
    </div>
  )
}
