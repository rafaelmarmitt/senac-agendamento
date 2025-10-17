import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Plus } from "lucide-react";

// Mock data
const minhasReservas = [
  { id: 1, sala: "Lab 201", data: "2025-10-20", horario: "14:00 - 16:00", status: "aprovada" },
  { id: 2, sala: "Sala 102", data: "2025-10-22", horario: "10:00 - 12:00", status: "pendente" },
  { id: 3, sala: "Auditório", data: "2025-10-18", horario: "19:00 - 21:00", status: "recusada" },
];

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("minhas-reservas");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovada": return <CheckCircle2 className="h-4 w-4" />;
      case "pendente": return <AlertCircle className="h-4 w-4" />;
      case "recusada": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "aprovada": return "success";
      case "pendente": return "warning";
      case "recusada": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Meu Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta! Gerencie seus agendamentos aqui.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Aprovadas e confirmadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <AlertCircle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Total de solicitações</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="minhas-reservas">Minhas Reservas</TabsTrigger>
              <TabsTrigger value="nova-reserva">Nova Reserva</TabsTrigger>
            </TabsList>

            <TabsContent value="minhas-reservas" className="space-y-4">
              {minhasReservas.map((reserva) => (
                <Card key={reserva.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{reserva.sala}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(reserva.data).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reserva.horario}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(reserva.status)} className="flex items-center gap-1">
                        {getStatusIcon(reserva.status)}
                        {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Ver Detalhes</Button>
                      {reserva.status === "pendente" && (
                        <Button variant="destructive" size="sm">Cancelar</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="nova-reserva">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Solicitar Nova Reserva
                  </CardTitle>
                  <CardDescription>
                    Preencha os dados para solicitar o agendamento de uma sala
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <a href="/calendario">
                      <Calendar className="h-4 w-4" />
                      Ir para o Calendário
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
