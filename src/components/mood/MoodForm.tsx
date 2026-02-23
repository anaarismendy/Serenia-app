'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { createMoodEntry, createConversation, createMessage } from '@/lib/database'
import { generateEmotionalResponse } from '@/lib/gemini'

const moodTypes = [
  { value: 'feliz', label: '😊 Feliz', color: 'text-yellow-500' },
  { value: 'triste', label: '😢 Triste', color: 'text-blue-500' },
  { value: 'ansioso', label: '😰 Ansioso', color: 'text-purple-500' },
  { value: 'enojado', label: '😠 Enojado', color: 'text-red-500' },
  { value: 'calmado', label: '😌 Calmado', color: 'text-green-500' },
  { value: 'confundido', label: '😕 Confundido', color: 'text-gray-500' },
  { value: 'emocionado', label: '🤗 Emocionado', color: 'text-pink-500' },
  { value: 'cansado', label: '😴 Cansado', color: 'text-indigo-500' },
]

export function MoodForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [moodScore, setMoodScore] = useState(5)
  const [moodType, setMoodType] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !moodType) return

    setLoading(true)
    setError('')

    try {
      // Crear entrada de estado de ánimo
      const moodEntry = await createMoodEntry(user.id, {
        mood_score: moodScore,
        mood_type: moodType,
        notes: notes.trim() || undefined,
      })

      // Crear conversación automáticamente
      const conversation = await createConversation(user.id, moodEntry.id)

      // Generar respuesta inicial de IA
      const aiResponse = await generateEmotionalResponse({
        currentMood: {
          score: moodScore,
          type: moodType,
          notes: notes.trim() || undefined,
        },
      })

      // Guardar mensaje de IA
      await createMessage(conversation.id, 'assistant', aiResponse)

      // Redirigir a la conversación
      router.push(`/chat?id=${conversation.id}`)
    } catch (err: any) {
      setError(err.message || 'Error al registrar emoción')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>¿Cómo te sientes ahora?</CardTitle>
        <CardDescription>
          Registra tu estado emocional y recibe apoyo inmediato de IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mood-type">Tipo de emoción</Label>
            <Select value={moodType} onValueChange={setMoodType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona cómo te sientes" />
              </SelectTrigger>
              <SelectContent>
                {moodTypes.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    <span className={mood.color}>{mood.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood-score">
              Intensidad (1-10): <span className="font-bold">{moodScore}</span>
            </Label>
            <Input
              id="mood-score"
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Muy baja</span>
              <span>Muy alta</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Describe qué está pasando, qué pensaste, o cualquier detalle relevante..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !moodType}>
            {loading ? 'Registrando...' : 'Registrar Emoción'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
