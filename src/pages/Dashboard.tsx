import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Plus, RefreshCw, QrCode, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import WizardAgendamento from "@/components/WizardAgendamento";

// Mock data
const minhasReservas = [
  { 
    id: 1, 
    sala: "Lab 201", 
    data: "2025-10-20", 
    horario: "14:00 - 16:00", 
    status: "aprovada",
    checkInRealizado: false,
    motivo: "Aula prática de programação",
    recursos: ["Computadores", "Projetor"],
    recorrente: false
  },
  { 
    id: 2, 
    sala: "Sala 102", 
    data: "2025-10-22", 
    horario: "10:00 - 12:00", 
    status: "pendente",
    checkInRealizado: false,
    motivo: "Workshop de Design",
    recursos: ["Projetor", "Quadro"],
    recorrente: true,
    recorrenciaTipo: "semanal"
  },
  { 
    id: 3, 
    sala: "Auditório", 
    data: "2025-10-18", 
    horario: "19:00 - 21:00", 
    status: "recusada",
    checkInRealizado: false,
    motivo: "Palestra sobre IA",
    recursos: ["Som", "Microfones"],
    recorrente: false,
    motivoRecusa: "Conflito com outro evento institucional"
  },
];

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("minhas-reservas");
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleCheckIn = (reservaId: number) => {
    toast({
      title: "Check-in Realizado!",
      description: "Sua reserva foi confirmada. A sala está liberada para uso.",
    });
  };

  const handleCancelar = (reservaId: number) => {
    toast({
      title: "Reserva Cancelada",
      description: "Sua reserva foi cancelada com sucesso.",
      variant: "destructive",
    });
  };

  const handleReagendar = (reserva: any) => {
    setWizardOpen(true);
    toast({
      title: "Reagendar Reserva",
      description: "Abrindo assistente de agendamento...",
    });
  };

  const handleExportarCalendario = (reserva: any) => {
    toast({
      title: "Exportar para Calendário",
      description: "Arquivo .ics baixado! Importe-o no Google Calendar ou Outlook.",
    });
  };

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
              {minhasReservas.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
                    <p className="text-muted-foreground mb-4">Você ainda não tem reservas agendadas.</p>
                    <Button onClick={() => setWizardOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Nova Reserva
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                minhasReservas.map((reserva) => (
                  <Card key={reserva.id} className={reserva.status === "recusada" ? "opacity-70" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle>{reserva.sala}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(reserva.data).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {reserva.horario}
                            </span>
                            {reserva.recorrente && (
                              <Badge variant="outline" className="text-xs">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                {reserva.recorrenciaTipo}
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(reserva.status)} className="flex items-center gap-1">
                          {getStatusIcon(reserva.status)}
                          {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm">
                          <p className="font-medium mb-1">Motivo:</p>
                          <p className="text-muted-foreground">{reserva.motivo}</p>
                        </div>
                        
                        {reserva.recursos && reserva.recursos.length > 0 && (
                          <div className="text-sm">
                            <p className="font-medium mb-1">Recursos:</p>
                            <div className="flex flex-wrap gap-1">
                              {reserva.recursos.map((recurso) => (
                                <Badge key={recurso} variant="secondary" className="text-xs">
                                  {recurso}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {reserva.status === "recusada" && reserva.motivoRecusa && (
                          <div className="text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                            <p className="font-medium text-destructive mb-1">Motivo da recusa:</p>
                            <p className="text-muted-foreground">{reserva.motivoRecusa}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                          {reserva.status === "aprovada" && !reserva.checkInRealizado && (
                            <Button variant="default" size="sm" onClick={() => handleCheckIn(reserva.id)}>
                              <QrCode className="h-4 w-4 mr-1" />
                              Fazer Check-in
                            </Button>
                          )}
                          {reserva.status === "aprovada" && reserva.checkInRealizado && (
                            <Badge variant="success" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Check-in realizado
                            </Badge>
                          )}
                          {reserva.status === "aprovada" && (
                            <Button variant="outline" size="sm" onClick={() => handleExportarCalendario(reserva)}>
                              <Download className="h-4 w-4 mr-1" />
                              Exportar (.ics)
                            </Button>
                          )}
                          {(reserva.status === "pendente" || reserva.status === "aprovada") && (
                            <Button variant="destructive" size="sm" onClick={() => handleCancelar(reserva.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                          {reserva.status === "recusada" && (
                            <Button variant="outline" size="sm" onClick={() => handleReagendar(reserva)}>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Solicitar Novamente
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="nova-reserva">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Solicitar Nova Reserva
                  </CardTitle>
                  <CardDescription>
                    Use nosso assistente inteligente para criar sua reserva em poucos passos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" onClick={() => setWizardOpen(true)}>
                    <Calendar className="h-5 w-5 mr-2" />
                    Abrir Assistente de Agendamento
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Ou navegue pelo calendário:</p>
                    <Button variant="outline" asChild>
                      <a href="/calendario">
                        Ver Todas as Salas
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <WizardAgendamento open={wizardOpen} onOpenChange={setWizardOpen} />

      <Footer />
    </div>
  );
}
