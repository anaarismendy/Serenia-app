'use client'

import { EmotionalCalendar } from '@/components/mood/EmotionalCalendar'

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📅 Calendario Emocional
        </h1>
        <p className="text-gray-600">
          Revisa tus estados de ánimo y accede a las conversaciones de cada día
        </p>
      </div>
      
      <EmotionalCalendar />
    </div>
  )
}
