import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { aiService } from "@/lib/ai-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Estadísticas generales
    const stats = await sql`
      SELECT 
        COUNT(*) as total_consultations,
        AVG(sentiment_score) as avg_sentiment,
        AVG(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolution_rate,
        COUNT(CASE WHEN priority_level = 4 THEN 1 END) as urgent_consultations
      FROM consultations 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
    `

    // Consultas por categoría
    const categoryStats = await sql`
      SELECT 
        cat.name,
        COUNT(c.id) as count,
        AVG(c.sentiment_score) as avg_sentiment,
        AVG(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) as resolution_rate
      FROM consultation_categories cat
      LEFT JOIN consultations c ON cat.id = c.category_id 
        AND c.created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY cat.id, cat.name
      ORDER BY count DESC
    `

    // Tendencias diarias
    const dailyTrends = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as consultations,
        AVG(sentiment_score) as avg_sentiment,
        COUNT(CASE WHEN priority_level = 4 THEN 1 END) as urgent_count
      FROM consultations 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `

    // Consultas recientes para análisis de IA
    const recentConsultations = await sql`
      SELECT subject, message, sentiment_score, priority_level, created_at
      FROM consultations 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 50
    `

    // Generar análisis de tendencias con IA
    const trendsAnalysis = await aiService.analyzeTrends(recentConsultations)

    return NextResponse.json({
      success: true,
      stats: stats[0],
      categoryStats,
      dailyTrends,
      trendsAnalysis,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
