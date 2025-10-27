import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, Wrench, Calendar, Search, Loader2 } from "lucide-react";
import WizardAgendamento from "@/components/WizardAgendamento";
import SalaDetalhesModal from "@/components/SalaDetalhesModal";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/contexts/AuthContext";

export default function Salas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [filterCapacidade, setFilterCapacidade] = useState<string>("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState<any>(null);
  const { rooms, loading } = useRooms();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available": return "success";
      case "occupied": return "destructive";
      case "maintenance": return "warning";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available": return "Disponível";
      case "occupied": return "Ocupada";
      case "maintenance": return "Em Manutenção";
      default: return status;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "sala": return "Sala de Aula";
      case "laboratorio": return "Laboratório";
      case "auditorio": return "Auditório";
      default: return tipo;
    }
  };

  const handleVerDetalhes = (sala: any) => {
    setSalaSelecionada(sala);
    setDetalhesOpen(true);
  };

  const handleAgendar = (sala?: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (sala) {
      setSalaSelecionada(sala);
    }
    setDetalhesOpen(false);
    setWizardOpen(true);
  };

  const salasFiltradasFiltradas = rooms.filter(sala => {
    const matchNome = sala.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === "todos" || sala.tipo === filterTipo;
    const matchCapacidade = !filterCapacidade || sala.capacidade >= parseInt(filterCapacidade);
    
    return matchNome && matchTipo && matchCapacidade;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Galeria de Salas
          </h1>
          <p className="text-muted-foreground">
            Conheça todos os espaços disponíveis no SENAC para suas atividades acadêmicas
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="sala">Sala de Aula</SelectItem>
                <SelectItem value="laboratorio">Laboratório</SelectItem>
                <SelectItem value="auditorio">Auditório</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Capacidade mínima"
              value={filterCapacidade}
              onChange={(e) => setFilterCapacidade(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Grid de Salas */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salasFiltradasFiltradas.map((sala) => (
              <Card key={sala.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={sala.imagem || "/placeholder.svg"} 
                    alt={sala.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={getStatusVariant(sala.status)}>
                      {getStatusLabel(sala.status)}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {sala.nome}
                    <Badge variant="outline">{getTipoLabel(sala.tipo)}</Badge>
                  </CardTitle>
                  <CardDescription>{sala.descricao || "Sem descrição disponível"}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{sala.capacidade} pessoas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">{sala.localizacao}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Recursos:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sala.recursos.slice(0, 3).map((recurso, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {recurso}
                        </Badge>
                      ))}
                      {sala.recursos.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{sala.recursos.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleVerDetalhes(sala)}
                    >
                      Ver Detalhes
                    </Button>
                    {sala.status === "available" && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAgendar(sala)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Agendar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {salasFiltradasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma sala encontrada com os filtros selecionados.
            </p>
          </div>
        )}
      </main>

      <Footer />

      <WizardAgendamento
        open={wizardOpen}
        onOpenChange={setWizardOpen}
      />

      <SalaDetalhesModal
        open={detalhesOpen}
        onOpenChange={setDetalhesOpen}
        sala={salaSelecionada}
        onAgendar={() => handleAgendar(salaSelecionada)}
      />
    </div>
  );
}
