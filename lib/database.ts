import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

export const sql = neon(process.env.DATABASE_URL)

// Tipos de datos
export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  created_at: string
}

export interface ConsultationCategory {
  id: number
  name: string
  description?: string
  priority_level: number
  created_at: string
}

export interface Consultation {
  id: number
  customer_id: number
  category_id: number
  subject: string
  message: string
  ai_response?: string
  status: "pending" | "in_progress" | "resolved" | "closed"
  priority_level: number
  sentiment_score?: number
  confidence_score?: number
  response_time_seconds?: number
  created_at: string
  updated_at: string
}

export interface ConsultationInteraction {
  id: number
  consultation_id: number
  message: string
  sender_type: "customer" | "ai" | "agent"
  sender_id?: number
  created_at: string
}

export interface AnalyticsTrend {
  id: number
  date: string
  category_id: number
  total_consultations: number
  avg_response_time: number
  avg_sentiment_score: number
  resolution_rate: number
  created_at: string
}
