'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConversationList } from '@/components/chat/ConversationList'
import { getMoodEntriesWithConversations } from '@/lib/database'
import { useAuth } from '@/hooks/useAuth'

interface MoodEntryWithConversation {
  id: string
  mood_score: number
  mood_type: string
  notes?: string
  created_at: string
  conversation_id?: string
}

interface DayData {
  date: Date
  moodEntries: MoodEntryWithConversation[]
}

const moodColors: { [key: string]: string } = {
  feliz: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  triste: 'bg-blue-100 text-blue-800 border-blue-200',
  ansioso: 'bg-purple-100 text-purple-800 border-purple-200',
  enojado: 'bg-red-100 text-red-800 border-red-200',
  calmado: 'bg-green-100 text-green-800 border-green-200',
  confundido: 'bg-gray-100 text-gray-800 border-gray-200',
  emocionado: 'bg-pink-100 text-pink-800 border-pink-200',
  cansado: 'bg-indigo-100 text-indigo-800 border-indigo-200',
}

const moodEmojis: { [key: string]: string } = {
  feliz: '😊',
  triste: '😢',
  ansioso: '😰',
  enojado: '😠',
  calmado: '😌',
  confundido: '😕',
  emocionado: '🤗',
  cansado: '😴',
}

export function EmotionalCalendar() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [moodData, setMoodData] = useState<{ [key: string]: DayData }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadMoodData()
    }
  }, [user, currentDate])

  const loadMoodData = async () => {
    try {
      setLoading(true)
      const entries = await getMoodEntriesWithConversations(user!.id, 100)
      
      // Agrupar entradas por fecha
      const groupedData: { [key: string]: DayData } = {}
      
      entries.forEach((entry: any) => {
        const date = new Date(entry.created_at)
        const dateKey = date.toISOString().split('T')[0]
        
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = {
            date,
            moodEntries: []
          }
        }
        
        groupedData[dateKey].moodEntries.push(entry)
      })
      
      setMoodData(groupedData)
    } catch (error) {
      console.error('Error loading mood data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const handleDateClick = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayData = moodData[dateKey]
    
    if (dayData && dayData.moodEntries.length > 0) {
      setSelectedDate(dayData.date)
    }
  }

  const getMoodForDay = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayData = moodData[dateKey]
    
    if (!dayData || dayData.moodEntries.length === 0) {
      return null
    }
    
    // Devolver el estado de ánimo predominante del día
    return dayData.moodEntries[0]
  }

  const monthYear = currentDate.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  })

  const days = getDaysInMonth(currentDate)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando calendario emocional...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl font-semibold">
              {monthYear}
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-sm font-semibold p-2 text-gray-600">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => {
              const mood = day ? getMoodForDay(day) : null
              const isSelected = selectedDate && day && 
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear()
              
              return (
                <div
                  key={index}
                  onClick={() => day && handleDateClick(day)}
                  className={`
                    p-2 h-12 border rounded cursor-pointer transition-colors
                    ${!day ? 'bg-gray-50' : ''}
                    ${mood ? moodColors[mood.mood_type] : 'hover:bg-gray-100'}
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  {day && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-xs font-medium">{day}</span>
                      {mood && (
                        <span className="text-lg">{moodEmojis[mood.mood_type]}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Consejo:</strong> Selecciona una conversación de la lista para abrirla
              </p>
            </div>
            <ConversationList 
              selectedDate={selectedDate}
              onConversationSelect={(conversationId) => router.push(`/chat?id=${conversationId}`)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
