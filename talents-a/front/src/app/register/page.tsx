// app/register/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import RegisterForm from '@/components/RegisterForm'
import { registerUser } from '@/lib/user'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()

  const handleRegister = async (email: string, password: string, cpf: string) => {
    const response = await registerUser(email, password, cpf)
    if(response.ok){
        toast.success(response.message)
        router.push('/login')
    }else{
        toast.error(response.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <RegisterForm title="Cadastro" onSubmit={handleRegister} linkText="Já tem conta?" linkHref="/login" />
    </div>
  )
}
