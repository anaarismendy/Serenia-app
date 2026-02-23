'use client'

import { useAuth } from '@/hooks/useAuth'
import { AuthPage } from '@/components/auth/AuthPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmotionalCalendar } from '@/components/mood/EmotionalCalendar'
import { MoodForm } from '@/components/mood/MoodForm'
import { MessageCircle, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Serenia
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {user.user_metadata?.username || user.email}
              </span>
              <Button variant="outline" onClick={signOut}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <MoodForm />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Calendario de Serenia
                </CardTitle>
                <CardDescription>
                  Revisa tus emociones por día y accede a conversaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Visualiza tu viaje emocional con Serenia
                </p>
                <Link href="/calendar">
                  <Button variant="outline" size="sm">
                    Ver calendario completo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Conversaciones con Serenia AI
                </CardTitle>
                <CardDescription>
                  Chats sobre tus emociones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Conversa con Serenia AI sobre tus emociones
                </p>
                <Link href="/chat">
                  <Button variant="outline" size="sm">
                    Ver conversaciones
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
