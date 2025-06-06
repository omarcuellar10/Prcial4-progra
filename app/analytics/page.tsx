"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Clock, RefreshCw, Brain, PieChart } from "lucide-react"

interface AnalyticsData {
  stats: {
    total_consultations: number
    avg_sentiment: number
    resolution_rate: number
    urgent_consultations: number
  }
  categoryStats: Array<{
    name: string
    count: number
    avg_sentiment: number
    resolution_rate: number
  }>
  dailyTrends: Array<{
    date: string
    consultations: number
    avg_sentiment: number
    urgent_count: number
  }>
  trendsAnalysis: string
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?days=${days}`)
      const result = await response.json()

      if (result.success) {
        setData(result)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return "text-green-600"
    if (sentiment < -0.2) return "text-red-600"
    return "text-yellow-600"
  }

  const getSentimentText = (sentiment: number) => {
    if (sentiment > 0.2) return "Positivo"
    if (sentiment < -0.2) return "Negativo"
    return "Neutral"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Generando análisis con IA...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Error al cargar los datos de análisis</p>
          <Button onClick={fetchAnalytics} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Análisis Predictivo</h1>
            <p className="mt-2 text-gray-600">Insights y tendencias generados por IA</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
            </select>
            <Button onClick={fetchAnalytics} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.total_consultations}</div>
              <p className="text-xs text-muted-foreground">Últimos {days} días</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sentimiento Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getSentimentColor(data.stats.avg_sentiment)}`}>
                {getSentimentText(data.stats.avg_sentiment)}
              </div>
              <p className="text-xs text-muted-foreground">
                {(data.stats.avg_sentiment * 100).toFixed(1)}% de satisfacción
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Resolución</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{(data.stats.resolution_rate * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Consultas resueltas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas Urgentes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{data.stats.urgent_consultations}</div>
              <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Por Categorías</TabsTrigger>
            <TabsTrigger value="trends">Tendencias Diarias</TabsTrigger>
            <TabsTrigger value="ai-analysis">Análisis IA</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Análisis por Categorías
                </CardTitle>
                <CardDescription>Distribución y rendimiento por tipo de consulta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.categoryStats.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{category.count} consultas</span>
                          <span className={getSentimentColor(category.avg_sentiment)}>
                            Sentimiento: {getSentimentText(category.avg_sentiment)}
                          </span>
                          <span className="text-green-600">
                            Resolución: {(category.resolution_rate * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{category.count}</div>
                        <div className="text-sm text-gray-500">consultas</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Tendencias Diarias
                </CardTitle>
                <CardDescription>Evolución de consultas y sentimiento por día</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.dailyTrends.slice(0, 10).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {new Date(trend.date).toLocaleDateString("es-ES", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {trend.consultations} consultas
                          {trend.urgent_count > 0 && (
                            <span className="text-red-600 ml-2">({trend.urgent_count} urgentes)</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getSentimentColor(trend.avg_sentiment)}`}>
                          {getSentimentText(trend.avg_sentiment)}
                        </div>
                        <div className="text-sm text-gray-500">{(trend.avg_sentiment * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Análisis Predictivo con IA
                </CardTitle>
                <CardDescription>Insights y recomendaciones generados automáticamente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{data.trendsAnalysis}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
