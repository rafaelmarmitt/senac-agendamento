import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Filter, Search, Zap, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WizardAgendamento from "@/components/WizardAgendamento";
import SalaDetalhesModal from "@/components/SalaDetalhesModal";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/contexts/AuthContext";

const horarios = [
  "08:00 - 10:00",
  "10:00 - 12:00", 
  "13:00 - 15:00",
  "15:00 - 17:00",
  "17:00 - 19:00",
  "19:00 - 21:00"
];

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterCapacidade, setFilterCapacidade] = useState("");
  const [filterHorario, setFilterHorario] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState<any>(null);
  const { rooms, loading } = useRooms();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "success";
      case "occupied": return "destructive";
      case "maintenance": return "warning";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available": return "Disponível";
      case "occupied": return "Ocupada";
      case "maintenance": return "Manutenção";
      default: return status;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "sala": return "Sala de Aula";
      case "laboratorio": return "Laboratório de Informática";
      case "auditorio": return "Auditório";
      default: return tipo;
    }
  };

  const handleVerDetalhes = (sala: any) => {
    setSalaSelecionada(sala);
    setDetalhesOpen(true);
  };

  const handleAgendar = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setWizardOpen(true);
  };

  const salasFiltradasFiltradas = rooms.filter((sala) => {
    const matchSearch = sala.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       getTipoLabel(sala.tipo).toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === "todos" || sala.tipo === filterTipo;
    const matchCapacidade = !filterCapacidade || sala.capacidade >= parseInt(filterCapacidade);
    
    return matchSearch && matchTipo && matchCapacidade;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Calendário de Salas</h1>
              <p className="text-muted-foreground">
                Visualize a disponibilidade das salas em tempo real
              </p>
            </div>
            <Button size="lg" onClick={handleAgendar} className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Agendamento Rápido
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros e Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar sala..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de sala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="sala">Sala de Aula</SelectItem>
                    <SelectItem value="laboratorio">Laboratório de Informática</SelectItem>
                    <SelectItem value="auditorio">Auditório</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Capacidade mínima"
                  value={filterCapacidade}
                  onChange={(e) => setFilterCapacidade(e.target.value)}
                  min="1"
                />
                <Select value={filterHorario} onValueChange={setFilterHorario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os horários" />
                  </SelectTrigger>
                  <SelectContent>
                    {horarios.map((horario) => (
                      <SelectItem key={horario} value={horario}>
                        {horario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchTerm("");
                  setFilterTipo("todos");
                  setFilterCapacidade("");
                  setFilterHorario("");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="success">Disponível</Badge>
              <span className="text-sm text-muted-foreground">Livre para agendamento</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Ocupada</Badge>
              <span className="text-sm text-muted-foreground">Reservada</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="warning">Manutenção</Badge>
              <span className="text-sm text-muted-foreground">Indisponível</span>
            </div>
          </div>

          {/* Salas Grid */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {!loading && (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {salasFiltradasFiltradas.length} de {rooms.length} salas
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salasFiltradasFiltradas.map((sala) => (
                  <Card key={sala.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{sala.nome}</CardTitle>
                          <CardDescription>{getTipoLabel(sala.tipo)}</CardDescription>
                        </div>
                        <Badge variant={getStatusColor(sala.status)}>
                          {getStatusText(sala.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Capacidade: {sala.capacidade} pessoas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{sala.localizacao}</span>
                        </div>
                      </div>

                      {sala.status === "available" && (
                        <Button className="w-full" variant="default" onClick={handleAgendar}>
                          <Calendar className="h-4 w-4" />
                          Agendar Sala
                        </Button>
                      )}
                      {sala.status === "occupied" && (
                        <Button className="w-full" variant="outline" onClick={() => handleVerDetalhes(sala)}>
                          Ver Detalhes
                        </Button>
                      )}
                      {sala.status === "maintenance" && (
                        <Button className="w-full" variant="outline" disabled>
                          Em Manutenção
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Info Card */}
          {!user && (
            <Card className="mt-12 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Atenção Visitantes</CardTitle>
                <CardDescription>
                  Esta é a visualização pública do calendário. Para solicitar agendamentos e ver mais detalhes, 
                  você precisa <a href="/login" className="text-primary hover:underline font-medium">fazer login</a> ou{" "}
                  <a href="/registro" className="text-primary hover:underline font-medium">criar uma conta</a>.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>

      <WizardAgendamento open={wizardOpen} onOpenChange={setWizardOpen} />
      <SalaDetalhesModal 
        open={detalhesOpen} 
        onOpenChange={setDetalhesOpen} 
        sala={salaSelecionada}
      />

      <Footer />
    </div>
  );
}
