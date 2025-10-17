import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Users, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Mock data
const solicitacoesPendentes = [
  { 
    id: 1, 
    usuario: "João Silva", 
    sala: "Lab 201", 
    data: "2025-10-25", 
    horario: "14:00 - 16:00",
    motivo: "Aula prática de programação",
    participantes: 25,
    equipamentos: "Computadores, Projetor"
  },
  { 
    id: 2, 
    usuario: "Maria Santos", 
    sala: "Sala 102", 
    data: "2025-10-26", 
    horario: "10:00 - 12:00",
    motivo: "Workshop de Design Thinking",
    participantes: 15,
    equipamentos: "Projetor, Quadro branco"
  },
  { 
    id: 3, 
    usuario: "Pedro Costa", 
    sala: "Auditório", 
    data: "2025-10-27", 
    horario: "19:00 - 21:00",
    motivo: "Palestra sobre IA",
    participantes: 80,
    equipamentos: "Som, Projetor, Microfones"
  },
];

const reservasAprovadas = [
  { id: 4, usuario: "Ana Paula", sala: "Lab 305", data: "2025-10-28", horario: "08:00 - 10:00", status: "aprovada" },
  { id: 5, usuario: "Carlos Lima", sala: "Sala 201", data: "2025-10-29", horario: "14:00 - 16:00", status: "aprovada" },
];

export default function Gerente() {
  const [selectedTab, setSelectedTab] = useState("pendentes");
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"aprovar" | "recusar">("aprovar");
  const [justificativa, setJustificativa] = useState("");

  const handleAction = (solicitacao: any, type: "aprovar" | "recusar") => {
    setSelectedSolicitacao(solicitacao);
    setActionType(type);
    setDialogOpen(true);
  };

  const confirmarAcao = () => {
    if (actionType === "aprovar") {
      toast({
        title: "Solicitação Aprovada",
        description: `A reserva de ${selectedSolicitacao.usuario} foi aprovada com sucesso.`,
      });
    } else {
      toast({
        title: "Solicitação Recusada",
        description: `A reserva foi recusada. O usuário será notificado.`,
        variant: "destructive",
      });
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
                <div className="text-2xl font-bold">{solicitacoesPendentes.length}</div>
                <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Aprovadas Hoje</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Reservas confirmadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recusadas</CardTitle>
                <XCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
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
              {solicitacoesPendentes.map((solicitacao) => (
                <Card key={solicitacao.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle>{solicitacao.sala}</CardTitle>
                        <CardDescription className="flex flex-col gap-2">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Solicitado por: {solicitacao.usuario}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(solicitacao.data).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {solicitacao.horario}
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
                      <div>
                        <p className="text-sm font-medium mb-1">Equipamentos necessários:</p>
                        <p className="text-sm text-muted-foreground">{solicitacao.equipamentos}</p>
                      </div>
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
              {reservasAprovadas.map((reserva) => (
                <Card key={reserva.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{reserva.sala}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {reserva.usuario}
                          </span>
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
                ? `Confirme a aprovação da reserva de ${selectedSolicitacao?.sala}.`
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
