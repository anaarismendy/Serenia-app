import { supabase } from './supabase'
import { MoodEntry, Conversation, Message } from '@/types'

export async function createMoodEntry(
  userId: string,
  moodData: { mood_score: number; mood_type: string; notes?: string }
): Promise<MoodEntry> {
  const { data, error } = await supabase
    .from('mood_entries')
    .insert({
      user_id: userId,
      mood_score: moodData.mood_score,
      mood_type: moodData.mood_type,
      notes: moodData.notes,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMoodEntriesWithConversations(
  userId: string,
  limit: number = 10
): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select(`
      *,
      conversations!inner(
        id,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getMoodEntries(
  userId: string,
  limit: number = 10
): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function createConversation(
  userId: string,
  moodEntryId: string
): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      mood_entry_id: moodEntryId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getConversationByMoodEntry(
  moodEntryId: string
): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('mood_entry_id', moodEntryId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}
