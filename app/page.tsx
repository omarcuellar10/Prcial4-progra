import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, BarChart3, Users, Clock, TrendingUp, AlertTriangle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">MediCare AI</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/chat" className="text-gray-500 hover:text-gray-900">
                Consultas
              </Link>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-gray-500 hover:text-gray-900">
                Análisis
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Sistema de Atención al Cliente
            <span className="block text-blue-600">Inteligente para Servicios Médicos</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Respuestas automáticas, análisis predictivo y clasificación inteligente de consultas médicas con seguimiento
            histórico completo.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/chat">
                <Button size="lg" className="w-full">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Iniciar Consulta
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Ver Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Sistema Completo de Atención Médica
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
                    Respuestas Automáticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    IA especializada en servicios médicos que proporciona respuestas inmediatas y precisas a las
                    consultas de los pacientes.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                    Análisis Predictivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Identifica tendencias y patrones en las consultas para optimizar el servicio y anticipar necesidades
                    futuras.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
                    Clasificación Inteligente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Clasifica automáticamente las consultas por categoría, prioridad y sentimiento para una atención más
                    eficiente.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-6 w-6 text-purple-600 mr-2" />
                    Seguimiento Histórico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Registro completo de todas las interacciones para facilitar el seguimiento y mejorar la calidad del
                    servicio.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-6 w-6 text-indigo-600 mr-2" />
                    Gestión de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Sistema completo de gestión de clientes con historial de consultas y preferencias personalizadas.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-6 w-6 text-red-600 mr-2" />
                    Dashboard Analítico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Visualización en tiempo real de métricas clave, tendencias y KPIs del servicio de atención al
                    cliente.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para mejorar tu atención al cliente?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Comienza a usar nuestro sistema inteligente y transforma la experiencia de tus pacientes.
          </p>
          <Link href="/chat">
            <Button size="lg" variant="secondary" className="mt-8">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
