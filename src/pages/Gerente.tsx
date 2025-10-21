import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Users, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Gerente() {
  const [selectedTab, setSelectedTab] = useState("pendentes");
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"aprovar" | "recusar">("aprovar");
  const [justificativa, setJustificativa] = useState("");
  const { bookings, loading, updateBookingStatus } = useBookings(false);

  const pendentes = useMemo(() => 
    bookings.filter(b => b.status === 'pending'),
    [bookings]
  );

  const aprovadas = useMemo(() => 
    bookings.filter(b => b.status === 'approved'),
    [bookings]
  );

  const stats = useMemo(() => ({
    pending: pendentes.length,
    approvedToday: aprovadas.filter(b => {
      const today = new Date().toDateString();
      return new Date(b.data).toDateString() === today;
    }).length,
    rejectedMonth: bookings.filter(b => {
      const now = new Date();
      const bookingDate = new Date(b.data);
      return b.status === 'rejected' && 
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear();
    }).length
  }), [bookings, pendentes, aprovadas]);

  const handleAction = (solicitacao: any, type: "aprovar" | "recusar") => {
    setSelectedSolicitacao(solicitacao);
    setActionType(type);
    setDialogOpen(true);
  };

  const confirmarAcao = async () => {
    if (!selectedSolicitacao) return;
    
    const status = actionType === "aprovar" ? "approved" : "rejected";
    const { error } = await updateBookingStatus(
      selectedSolicitacao.id, 
      status, 
      justificativa
    );
    
    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      if (actionType === "aprovar") {
        toast({
          title: "Solicitação Aprovada",
          description: `A reserva de ${selectedSolicitacao.profiles?.full_name} foi aprovada com sucesso.`,
        });
      } else {
        toast({
          title: "Solicitação Recusada",
          description: `A reserva foi recusada. O usuário será notificado.`,
        });
      }
    }
    
    setDialogOpen(false);
    setJustificativa("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Painel do Gerente</h1>
            <p className="text-muted-foreground">
              Gerencie solicitações de agendamento e reservas
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <CardTitle className="text-sm font-medium">Aprovadas Hoje</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "-" : stats.approvedToday}</div>
                <p className="text-xs text-muted-foreground">Reservas confirmadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recusadas</CardTitle>
                <XCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "-" : stats.rejectedMonth}</div>
                <p className="text-xs text-muted-foreground">Neste mês</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
              <TabsTrigger value="salas">Gerenciar Salas</TabsTrigger>
            </TabsList>

            <TabsContent value="pendentes" className="space-y-4">
              {loading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              
              {!loading && pendentes.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação pendente</h3>
                    <p className="text-muted-foreground">Todas as solicitações foram processadas.</p>
                  </CardContent>
                </Card>
              )}
              
              {!loading && pendentes.map((solicitacao) => (
                <Card key={solicitacao.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle>{solicitacao.rooms?.nome || "Sala"}</CardTitle>
                        <CardDescription className="flex flex-col gap-2">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Solicitado por: {solicitacao.profiles?.full_name || solicitacao.profiles?.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(solicitacao.data), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {solicitacao.hora_inicio} - {solicitacao.hora_fim}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {solicitacao.participantes} participantes
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="warning">Pendente</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Motivo:</p>
                        <p className="text-sm text-muted-foreground">{solicitacao.motivo}</p>
                      </div>
                      
                      {solicitacao.recursos_extras && solicitacao.recursos_extras.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Recursos extras:</p>
                          <div className="flex flex-wrap gap-1">
                            {solicitacao.recursos_extras.map((recurso: string) => (
                              <Badge key={recurso} variant="secondary" className="text-xs">
                                {recurso}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAction(solicitacao, "aprovar")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleAction(solicitacao, "recusar")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Recusar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="aprovadas" className="space-y-4">
              {loading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              
              {!loading && aprovadas.map((reserva) => (
                <Card key={reserva.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{reserva.rooms?.nome || "Sala"}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {reserva.profiles?.full_name || reserva.profiles?.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(reserva.data), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reserva.hora_inicio} - {reserva.hora_fim}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="success">Aprovada</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="salas">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Salas</CardTitle>
                  <CardDescription>
                    Adicione, edite ou remova salas e defina seu status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Adicionar Nova Sala</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "aprovar" ? "Aprovar Solicitação" : "Recusar Solicitação"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "aprovar" 
                ? `Confirme a aprovação da reserva de ${selectedSolicitacao?.rooms?.nome}.`
                : "Por favor, informe o motivo da recusa (opcional)."}
            </DialogDescription>
          </DialogHeader>
          
          {actionType === "recusar" && (
            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa</Label>
              <Textarea
                id="justificativa"
                placeholder="Explique o motivo da recusa..."
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant={actionType === "aprovar" ? "default" : "destructive"}
              onClick={confirmarAcao}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
