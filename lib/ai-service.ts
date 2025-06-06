import { deepseek } from "@ai-sdk/deepseek"
import { generateObject, generateText } from "ai"
import { z } from "zod"

// Esquemas para clasificación y análisis
const ConsultationClassificationSchema = z.object({
  category: z.enum([
    "citas",
    "resultados",
    "emergencias",
    "informacion",
    "facturacion",
    "medicamentos",
    "seguimiento",
    "quejas",
  ]),
  priority: z.number().min(1).max(4),
  sentiment: z.number().min(-1).max(1),
  confidence: z.number().min(0).max(1),
  urgency_keywords: z.array(z.string()),
  recommended_action: z.string(),
})

const MedicalResponseSchema = z.object({
  response: z.string(),
  requires_human_attention: z.boolean(),
  follow_up_needed: z.boolean(),
  estimated_resolution_time: z.string(),
  additional_resources: z.array(z.string()),
})

export class AIService {
  private model = deepseek("deepseek-reasoner")

  async classifyConsultation(message: string, subject: string) {
    try {
      const { object } = await generateObject({
        model: this.model,
        schema: ConsultationClassificationSchema,
        system: `Eres un especialista en clasificación de consultas médicas. Analiza cada consulta y clasifícala según:
        
        Categorías:
        - citas: Solicitudes de citas, reagendamiento, cancelaciones
        - resultados: Consultas sobre resultados de exámenes o laboratorios
        - emergencias: Situaciones médicas urgentes
        - informacion: Preguntas generales sobre servicios
        - facturacion: Temas de cobros, seguros, pagos
        - medicamentos: Preguntas sobre medicinas y efectos
        - seguimiento: Seguimiento post-consulta
        - quejas: Quejas o sugerencias sobre el servicio
        
        Prioridad (1-4):
        1: Baja - Información general
        2: Media - Citas, facturación
        3: Alta - Resultados, medicamentos
        4: Urgente - Emergencias médicas
        
        Sentimiento (-1 a 1):
        -1: Muy negativo, 0: Neutral, 1: Muy positivo`,
        prompt: `Clasifica esta consulta médica:
        
        Asunto: ${subject}
        Mensaje: ${message}
        
        Proporciona una clasificación completa con justificación.`,
      })

      return object
    } catch (error) {
      console.error("Error en clasificación:", error)
      return {
        category: "informacion" as const,
        priority: 1,
        sentiment: 0,
        confidence: 0.5,
        urgency_keywords: [],
        recommended_action: "Revisar manualmente",
      }
    }
  }

  async generateMedicalResponse(message: string, subject: string, category: string) {
    try {
      const { object } = await generateObject({
        model: this.model,
        schema: MedicalResponseSchema,
        system: `Eres un asistente virtual especializado en servicios médicos. Proporciona respuestas útiles, empáticas y profesionales.
        
        IMPORTANTE:
        - Nunca proporciones diagnósticos médicos específicos
        - Siempre recomienda consultar con un profesional médico para temas de salud
        - Sé empático y comprensivo
        - Proporciona información clara y útil sobre procesos administrativos
        - Para emergencias, siempre recomienda atención médica inmediata
        
        Categoría de consulta: ${category}`,
        prompt: `Genera una respuesta profesional para esta consulta médica:
        
        Asunto: ${subject}
        Mensaje: ${message}
        
        La respuesta debe ser empática, informativa y apropiada para el contexto médico.`,
      })

      return object
    } catch (error) {
      console.error("Error generando respuesta:", error)
      return {
        response:
          "Gracias por contactarnos. Hemos recibido su consulta y un miembro de nuestro equipo se pondrá en contacto con usted pronto.",
        requires_human_attention: true,
        follow_up_needed: true,
        estimated_resolution_time: "24 horas",
        additional_resources: [],
      }
    }
  }

  async analyzeTrends(consultations: any[]) {
    try {
      const { text } = await generateText({
        model: this.model,
        system: `Eres un analista de datos especializado en servicios médicos. Analiza las tendencias en las consultas de clientes y proporciona insights útiles.`,
        prompt: `Analiza estas consultas médicas y proporciona insights sobre tendencias, patrones y recomendaciones:
        
        ${JSON.stringify(consultations, null, 2)}
        
        Incluye:
        1. Tendencias principales
        2. Categorías más frecuentes
        3. Patrones de sentimiento
        4. Recomendaciones para mejorar el servicio`,
      })

      return text
    } catch (error) {
      console.error("Error en análisis de tendencias:", error)
      return "No se pudo generar el análisis de tendencias en este momento."
    }
  }
}

export const aiService = new AIService()
