// components/AuthForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  title: string
  onSubmit: (email: string, password: string) => void
  linkText?: string
  linkHref?: string
}

export default function LoginForm({ title, onSubmit, linkText, linkHref }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-96 space-y-4"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <label htmlFor="email" className='mb-10'>Email</label>
      <input
        type="email"
        placeholder="E-mail"
        className="w-full border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label htmlFor="email" className='mb-10'>Senha</label>
      <input
        type="password"
        placeholder="Senha"
        className="w-full border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Entrar
      </button>
      <p className="text-sm text-center">
        <Link href={linkHref || ''} className="text-blue-500 hover:underline">{linkText}</Link>
      </p>
    </form>
  )
}
