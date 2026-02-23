export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  mood_type: string;
  notes?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  mood_entry_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface MoodFormData {
  mood_score: number;
  mood_type: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
