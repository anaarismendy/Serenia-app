'use client'

import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { AuthToggle } from './AuthToggle'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Serenia
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tu espacio personal para el crecimiento emocional con Serenia
          </p>
        </div>
        
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <AuthToggle isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
      </div>
    </div>
  )
}
