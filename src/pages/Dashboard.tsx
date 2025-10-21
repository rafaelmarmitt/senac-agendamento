import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Plus, RefreshCw, QrCode, Download, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import WizardAgendamento from "@/components/WizardAgendamento";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("minhas-reservas");
  const [wizardOpen, setWizardOpen] = useState(false);
  const { bookings, loading, cancelBooking } = useBookings(true);
  const { user } = useAuth();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return {
      active: bookings.filter(b => b.status === 'approved' && new Date(b.data) >= now).length,
      pending: bookings.filter(b => b.status === 'pending').length,
      thisMonth: bookings.filter(b => {
        const bookingDate = new Date(b.data);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      }).length
    };
  }, [bookings]);

  const handleCheckIn = (reservaId: string) => {
    toast({
      title: "Check-in Realizado!",
      description: "Sua reserva foi confirmada. A sala está liberada para uso.",
    });
  };

  const handleCancelar = async (reservaId: string) => {
    const { error } = await cancelBooking(reservaId);
    
    if (error) {
      toast({
        title: "Erro ao cancelar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reserva Cancelada",
        description: "Sua reserva foi cancelada com sucesso.",
      });
    }
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
      case "approved": return <CheckCircle2 className="h-4 w-4" />;
      case "pending": return <AlertCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved": return "success";
      case "pending": return "warning";
      case "rejected": return "destructive";
      case "cancelled": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Aprovada";
      case "pending": return "Pendente";
      case "rejected": return "Recusada";
      case "cancelled": return "Cancelada";
      default: return status;
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
                <div className="text-2xl font-bold">{loading ? "-" : stats.active}</div>
                <p className="text-xs text-muted-foreground">Aprovadas e confirmadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <AlertCircle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "-" : stats.pending}</div>
                <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "-" : stats.thisMonth}</div>
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
              {loading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              
              {!loading && bookings.length === 0 ? (
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
              ) : !loading && (
                bookings.map((reserva) => (
                  <Card key={reserva.id} className={reserva.status === "rejected" ? "opacity-70" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle>{reserva.rooms?.nome || "Sala"}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(reserva.data), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {reserva.hora_inicio} - {reserva.hora_fim}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(reserva.status)} className="flex items-center gap-1">
                          {getStatusIcon(reserva.status)}
                          {getStatusLabel(reserva.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm">
                          <p className="font-medium mb-1">Motivo:</p>
                          <p className="text-muted-foreground">{reserva.motivo}</p>
                        </div>
                        
                        <div className="text-sm">
                          <p className="font-medium mb-1">Participantes:</p>
                          <p className="text-muted-foreground">{reserva.participantes} pessoas</p>
                        </div>
                        
                        {reserva.recursos_extras && reserva.recursos_extras.length > 0 && (
                          <div className="text-sm">
                            <p className="font-medium mb-1">Recursos Extras:</p>
                            <div className="flex flex-wrap gap-1">
                              {reserva.recursos_extras.map((recurso) => (
                                <Badge key={recurso} variant="secondary" className="text-xs">
                                  {recurso}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {reserva.status === "rejected" && reserva.justificativa && (
                          <div className="text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                            <p className="font-medium text-destructive mb-1">Motivo da recusa:</p>
                            <p className="text-muted-foreground">{reserva.justificativa}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                          {reserva.status === "approved" && (
                            <>
                              <Button variant="default" size="sm" onClick={() => handleCheckIn(reserva.id)}>
                                <QrCode className="h-4 w-4 mr-1" />
                                Fazer Check-in
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleExportarCalendario(reserva)}>
                                <Download className="h-4 w-4 mr-1" />
                                Exportar (.ics)
                              </Button>
                            </>
                          )}
                          {(reserva.status === "pending" || reserva.status === "approved") && (
                            <Button variant="destructive" size="sm" onClick={() => handleCancelar(reserva.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                          {reserva.status === "rejected" && (
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
