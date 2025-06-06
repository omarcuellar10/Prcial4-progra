"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Clock, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface Consultation {
  id: number
  subject: string
  message: string
  status: string
  priority_level: number
  sentiment_score: number
  customer_name: string
  customer_email: string
  category_name: string
  created_at: string
}

export default function DashboardPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchConsultations()
  }, [filter])

  const fetchConsultations = async () => {
    setLoading(true)
    try {
      const url = filter === "all" ? "/api/consultations" : `/api/consultations?status=${filter}`
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setConsultations(data.consultations)
      }
    } catch (error) {
      console.error("Error fetching consultations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "in_progress":
        return "En Proceso"
      case "resolved":
        return "Resuelto"
      case "closed":
        return "Cerrado"
      default:
        return status
    }
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

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.2) return "😊"
    if (sentiment < -0.2) return "😟"
    return "😐"
  }

  // Estadísticas rápidas
  const totalConsultations = consultations.length
  const pendingConsultations = consultations.filter((c) => c.status === "pending").length
  const urgentConsultations = consultations.filter((c) => c.priority_level === 4).length
  const avgSentiment = consultations.reduce((acc, c) => acc + (c.sentiment_score || 0), 0) / totalConsultations || 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Consultas</h1>
            <p className="mt-2 text-gray-600">Gestión y seguimiento de consultas médicas</p>
          </div>
          <Button onClick={fetchConsultations} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConsultations}</div>
              <p className="text-xs text-muted-foreground">Consultas registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingConsultations}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{urgentConsultations}</div>
              <p className="text-xs text-muted-foreground">Prioridad alta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sentimiento Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {getSentimentIcon(avgSentiment)}
                <span className="ml-2">{(avgSentiment * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Satisfacción general</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Lista de Consultas */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas Recientes</CardTitle>
            <CardDescription>Lista de todas las consultas médicas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="in_progress">En Proceso</TabsTrigger>
                <TabsTrigger value="resolved">Resueltas</TabsTrigger>
                <TabsTrigger value="closed">Cerradas</TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="mt-6">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Cargando consultas...</p>
                  </div>
                ) : consultations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay consultas para mostrar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{consultation.subject}</h3>
                                <Badge className={getStatusColor(consultation.status)}>
                                  {getStatusText(consultation.status)}
                                </Badge>
                                <Badge variant="outline" className={getPriorityColor(consultation.priority_level)}>
                                  {getPriorityText(consultation.priority_level)}
                                </Badge>
                              </div>

                              <p className="text-gray-600 mb-3 line-clamp-2">{consultation.message}</p>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {consultation.customer_name}
                                </span>
                                <span>{consultation.customer_email}</span>
                                <span>{consultation.category_name}</span>
                                <span>
                                  {new Date(consultation.created_at).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-2xl">{getSentimentIcon(consultation.sentiment_score)}</span>
                              {consultation.status === "resolved" && <CheckCircle className="h-5 w-5 text-green-600" />}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
