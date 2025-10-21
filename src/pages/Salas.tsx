import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, Wrench, Calendar, Search } from "lucide-react";
import WizardAgendamento from "@/components/WizardAgendamento";
import SalaDetalhesModal from "@/components/SalaDetalhesModal";

// Mock data - Em produção, virá do painel admin
const mockSalas = [
  {
    id: 1,
    nome: "Sala 101",
    tipo: "Sala de Aula",
    capacidade: 40,
    recursos: ["Projetor", "Quadro Branco", "Ar Condicionado", "Wi-Fi"],
    status: "disponivel" as const,
    localizacao: "Bloco A - 1º Andar",
    descricao: "Sala ampla e moderna, ideal para aulas teóricas e apresentações.",
    imagem: "/placeholder.svg"
  },
  {
    id: 2,
    nome: "Lab. Informática 1",
    tipo: "Laboratório",
    capacidade: 30,
    recursos: ["30 Computadores", "Projetor", "Software Adobe CC", "Ar Condicionado"],
    status: "disponivel" as const,
    localizacao: "Bloco B - 2º Andar",
    descricao: "Laboratório equipado com computadores de última geração e softwares profissionais.",
    imagem: "/placeholder.svg"
  },
  {
    id: 3,
    nome: "Auditório Principal",
    tipo: "Auditório",
    capacidade: 150,
    recursos: ["Sistema de Som", "Projetor 4K", "Palco", "Iluminação Profissional", "Ar Condicionado"],
    status: "ocupada" as const,
    localizacao: "Bloco C - Térreo",
    descricao: "Espaço amplo para eventos, palestras e apresentações de grande porte.",
    imagem: "/placeholder.svg"
  },
  {
    id: 4,
    nome: "Sala de Reuniões",
    tipo: "Sala de Reunião",
    capacidade: 12,
    recursos: ["TV 55\"", "Videoconferência", "Quadro Branco", "Ar Condicionado"],
    status: "disponivel" as const,
    localizacao: "Bloco A - 3º Andar",
    descricao: "Ambiente executivo para reuniões, videoconferências e trabalhos em grupo.",
    imagem: "/placeholder.svg"
  },
  {
    id: 5,
    nome: "Lab. Informática 2",
    tipo: "Laboratório",
    capacidade: 25,
    recursos: ["25 Computadores", "Projetor", "Software Dev", "Ar Condicionado"],
    status: "disponivel" as const,
    localizacao: "Bloco B - 3º Andar",
    descricao: "Laboratório focado em desenvolvimento de software e programação.",
    imagem: "/placeholder.svg"
  },
  {
    id: 6,
    nome: "Sala 205",
    tipo: "Sala de Aula",
    capacidade: 35,
    recursos: ["Projetor", "Quadro Branco", "Ar Condicionado"],
    status: "manutencao" as const,
    localizacao: "Bloco A - 2º Andar",
    descricao: "Sala versátil para diversas atividades acadêmicas.",
    imagem: "/placeholder.svg"
  }
];

export default function Salas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [filterCapacidade, setFilterCapacidade] = useState<string>("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState<any>(null);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "disponivel": return "success";
      case "ocupada": return "destructive";
      case "manutencao": return "warning";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "disponivel": return "Disponível";
      case "ocupada": return "Ocupada";
      case "manutencao": return "Em Manutenção";
      default: return status;
    }
  };

  const handleVerDetalhes = (sala: any) => {
    setSalaSelecionada(sala);
    setDetalhesOpen(true);
  };

  const handleAgendar = (sala?: any) => {
    if (sala) {
      setSalaSelecionada(sala);
    }
    setDetalhesOpen(false);
    setWizardOpen(true);
  };

  const salasFiltradasFiltradas = mockSalas.filter(sala => {
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
                <SelectItem value="Sala de Aula">Sala de Aula</SelectItem>
                <SelectItem value="Laboratório">Laboratório</SelectItem>
                <SelectItem value="Auditório">Auditório</SelectItem>
                <SelectItem value="Sala de Reunião">Sala de Reunião</SelectItem>
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

        {/* Grid de Salas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salasFiltradasFiltradas.map((sala) => (
            <Card key={sala.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={sala.imagem} 
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
                  <Badge variant="outline">{sala.tipo}</Badge>
                </CardTitle>
                <CardDescription>{sala.descricao}</CardDescription>
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
                  {sala.status === "disponivel" && (
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
