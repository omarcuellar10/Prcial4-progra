import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { aiService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { customerName, customerEmail, customerPhone, subject, message } = await request.json()

    // Crear o encontrar cliente
    let customer = await sql`
      SELECT * FROM customers WHERE email = ${customerEmail}
    `

    if (customer.length === 0) {
      customer = await sql`
        INSERT INTO customers (name, email, phone)
        VALUES (${customerName}, ${customerEmail}, ${customerPhone})
        RETURNING *
      `
    }

    const customerId = customer[0].id

    // Clasificar la consulta usando IA
    const classification = await aiService.classifyConsultation(message, subject)

    // Obtener categoría ID
    const categories = await sql`
      SELECT * FROM consultation_categories
    `

    const categoryMap: { [key: string]: number } = {
      citas: 1,
      resultados: 2,
      emergencias: 3,
      informacion: 4,
      facturacion: 5,
      medicamentos: 6,
      seguimiento: 7,
      quejas: 8,
    }

    const categoryId = categoryMap[classification.category] || 4

    // Generar respuesta automática
    const aiResponse = await aiService.generateMedicalResponse(message, subject, classification.category)

    // Crear consulta
    const consultation = await sql`
      INSERT INTO consultations (
        customer_id, category_id, subject, message, ai_response,
        priority_level, sentiment_score, confidence_score, status
      )
      VALUES (
        ${customerId}, ${categoryId}, ${subject}, ${message}, ${aiResponse.response},
        ${classification.priority}, ${classification.sentiment}, ${classification.confidence},
        ${aiResponse.requires_human_attention ? "pending" : "resolved"}
      )
      RETURNING *
    `

    // Registrar interacción inicial
    await sql`
      INSERT INTO consultation_interactions (consultation_id, message, sender_type)
      VALUES (${consultation[0].id}, ${message}, 'customer')
    `

    // Registrar respuesta de IA
    await sql`
      INSERT INTO consultation_interactions (consultation_id, message, sender_type)
      VALUES (${consultation[0].id}, ${aiResponse.response}, 'ai')
    `

    return NextResponse.json({
      success: true,
      consultation: consultation[0],
      classification,
      aiResponse,
    })
  } catch (error) {
    console.error("Error creating consultation:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status")

    let query = `
      SELECT 
        c.*,
        cu.name as customer_name,
        cu.email as customer_email,
        cat.name as category_name,
        cat.priority_level as category_priority
      FROM consultations c
      JOIN customers cu ON c.customer_id = cu.id
      JOIN consultation_categories cat ON c.category_id = cat.id
    `

    const params: any[] = []

    if (status) {
      query += ` WHERE c.status = $${params.length + 1}`
      params.push(status)
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const consultations = await sql(query, params)

    return NextResponse.json({
      success: true,
      consultations,
    })
  } catch (error) {
    console.error("Error fetching consultations:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
