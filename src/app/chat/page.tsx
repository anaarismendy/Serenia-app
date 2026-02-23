'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { getMoodEntries, getConversationByMoodEntry } from '@/lib/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ConversationWithMood {
  id: string
  mood_entry_id: string
  created_at: string
  mood_score: number
  mood_type: string
  notes?: string
}

export default function ChatPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const conversationIdFromUrl = searchParams.get('id')
  const [conversations, setConversations] = useState<ConversationWithMood[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversationIdFromUrl)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  useEffect(() => {
    if (conversationIdFromUrl) {
      setSelectedConversation(conversationIdFromUrl)
    }
  }, [conversationIdFromUrl])

  const loadConversations = async () => {
    try {
      const moodEntries = await getMoodEntries(user!.id, 50)
      const conversationsWithMood: ConversationWithMood[] = []

      for (const moodEntry of moodEntries) {
        const conversation = await getConversationByMoodEntry(moodEntry.id)
        if (conversation) {
          conversationsWithMood.push({
            ...conversation,
            mood_score: moodEntry.mood_score,
            mood_type: moodEntry.mood_type,
            notes: moodEntry.notes
          })
        }
      }

      setConversations(conversationsWithMood)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (moodType: string) => {
    const moodEmojis: { [key: string]: string } = {
      feliz: '😊',
      triste: '😢',
      ansioso: '😰',
      enojado: '😠',
      tranquilo: '😌',
      motivado: '🚀',
      cansado: '😴',
      confundido: '😕'
    }
    return moodEmojis[moodType] || '😐'
  }

  if (selectedConversation) {
    const selectedConv = conversations.find(c => c.id === selectedConversation)
    if (!selectedConv) return null

    const chatContext = {
      currentMood: {
        score: selectedConv.mood_score,
        type: selectedConv.mood_type,
        notes: selectedConv.notes
      }
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedConversation(null)}
            className="mb-4"
          >
            ← Volver a conversaciones
          </Button>
          <h1 className="text-2xl font-bold">
            Conversación sobre: {getMoodEmoji(selectedConv.mood_type)} {selectedConv.mood_type}
          </h1>
          <p className="text-gray-600">
            {new Date(selectedConv.created_at).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <ChatInterface 
          conversationId={selectedConversation} 
          initialContext={chatContext}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Conversaciones</h1>
        <Link href="/">
          <Button variant="outline">
            Nueva conversación
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Cargando conversaciones...</p>
        </div>
      ) : conversations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No tienes conversaciones aún</h3>
            <p className="text-gray-600 mb-4">
              Comienza registrando tu estado de ánimo para iniciar una conversación
            </p>
            <Link href="/">
              <Button>Comenzar ahora</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">
                    {getMoodEmoji(conversation.mood_type)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {conversation.mood_score}/10
                  </span>
                </div>
                <CardTitle className="text-lg capitalize">
                  {conversation.mood_type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(conversation.created_at).toLocaleDateString('es-ES')}
                </div>
                {conversation.notes && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {conversation.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
