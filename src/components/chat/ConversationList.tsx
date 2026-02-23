import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getMoodEntries, getConversationByMoodEntry } from '@/lib/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ConversationWithMood {
  id: string
  mood_entry_id: string
  created_at: string
  mood_score: number
  mood_type: string
  notes?: string
}

interface ConversationListProps {
  selectedDate: Date | null
  onConversationSelect: (conversationId: string) => void
}

const moodEmojis: { [key: string]: string } = {
  feliz: '😊',
  triste: '😢',
  ansioso: '😰',
  enojado: '😠',
  tranquilo: '😌',
  motivado: '🚀',
  cansado: '😴',
  confundido: '😕',
}

export function ConversationList({ selectedDate, onConversationSelect }: ConversationListProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationWithMood[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && selectedDate) {
      loadConversationsForDate()
    }
  }, [user, selectedDate])

  const loadConversationsForDate = async () => {
    if (!selectedDate || !user) return
    
    setLoading(true)
    try {
      const startDate = new Date(selectedDate)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(selectedDate)
      endDate.setHours(23, 59, 59, 999)
      
      const moodEntries = await getMoodEntries(user.id, 100)
      const conversationsForDate: ConversationWithMood[] = []
      
      for (const moodEntry of moodEntries) {
        const entryDate = new Date(moodEntry.created_at)
        if (entryDate >= startDate && entryDate <= endDate) {
          const conversation = await getConversationByMoodEntry(moodEntry.id)
          if (conversation) {
            conversationsForDate.push({
              ...conversation,
              mood_score: moodEntry.mood_score,
              mood_type: moodEntry.mood_type,
              notes: moodEntry.notes
            })
          }
        }
      }
      
      setConversations(conversationsForDate)
    } catch (error) {
      console.error('Error loading conversations for date:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedDate) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">
            Selecciona una fecha en el calendario para ver las conversaciones
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando conversaciones...</span>
        </CardContent>
      </Card>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Sin conversaciones este día</h3>
          <p className="text-gray-600">
            No hubo registros emocionales en esta fecha
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        Conversaciones del {selectedDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </h3>
      
      {conversations.map((conversation) => (
        <Card 
          key={conversation.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onConversationSelect(conversation.id)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{moodEmojis[conversation.mood_type]}</span>
                <div>
                  <Badge className="bg-gray-100 text-gray-800">
                    {conversation.mood_type}
                  </Badge>
                  <span className="ml-2 text-sm text-gray-600">
                    {conversation.mood_score}/10
                  </span>
                </div>
              </div>
              <Link href={`/chat?id=${conversation.id}`}>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Abrir conversación
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(conversation.created_at).toLocaleDateString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            {conversation.notes && (
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {conversation.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
