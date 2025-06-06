"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react"

export default function ChatPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResponse(null)

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        setResponse(data)
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          subject: "",
          message: "",
        })
      } else {
        setError(data.error || "Error al procesar la consulta")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "text-green-600"
      case 2:
        return "text-yellow-600"
      case 3:
        return "text-orange-600"
      case 4:
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return "Baja"
      case 2:
        return "Media"
      case 3:
        return "Alta"
      case 4:
        return "Urgente"
      default:
        return "No definida"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Consulta Médica</h1>
          <p className="mt-2 text-gray-600">Envíanos tu consulta y recibe una respuesta automática inmediata</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Consulta */}
          <Card>
            <CardHeader>
              <CardTitle>Nueva Consulta</CardTitle>
              <CardDescription>Completa el formulario para enviar tu consulta médica</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Nombre Completo</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Teléfono</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customerEmail">Correo Electrónico</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Asunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Breve descripción de tu consulta"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Describe detalladamente tu consulta o síntomas..."
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Consulta
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Respuesta del Sistema */}
          {response && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Respuesta Automática
                </CardTitle>
                <CardDescription>Tu consulta ha sido procesada y clasificada automáticamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Clasificación */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Clasificación de la Consulta</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Categoría:</span>
                      <span className="ml-2 font-medium capitalize">{response.classification.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Prioridad:</span>
                      <span className={`ml-2 font-medium ${getPriorityColor(response.classification.priority)}`}>
                        {getPriorityText(response.classification.priority)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Confianza:</span>
                      <span className="ml-2 font-medium">{Math.round(response.classification.confidence * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sentimiento:</span>
                      <span
                        className={`ml-2 font-medium ${
                          response.classification.sentiment > 0
                            ? "text-green-600"
                            : response.classification.sentiment < 0
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {response.classification.sentiment > 0
                          ? "Positivo"
                          : response.classification.sentiment < 0
                            ? "Negativo"
                            : "Neutral"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Respuesta de IA */}
                <div>
                  <h4 className="font-semibold mb-2">Respuesta del Sistema</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-800">{response.aiResponse.response}</p>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tiempo estimado de resolución:</span>
                    <span className="ml-2 font-medium">{response.aiResponse.estimated_resolution_time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Requiere atención humana:</span>
                    <span
                      className={`ml-2 font-medium ${
                        response.aiResponse.requires_human_attention ? "text-orange-600" : "text-green-600"
                      }`}
                    >
                      {response.aiResponse.requires_human_attention ? "Sí" : "No"}
                    </span>
                  </div>
                </div>

                {/* Acción recomendada */}
                {response.classification.recommended_action && (
                  <div>
                    <h4 className="font-semibold mb-2">Acción Recomendada</h4>
                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                      {response.classification.recommended_action}
                    </p>
                  </div>
                )}

                {/* Recursos adicionales */}
                {response.aiResponse.additional_resources && response.aiResponse.additional_resources.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Recursos Adicionales</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {response.aiResponse.additional_resources.map((resource: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
