import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - será substituído por dados reais do backend
const mockSalas = [
  { id: 1, nome: "Sala 101", tipo: "Laboratório de Informática", capacidade: 30, status: "disponivel", horario: "08:00 - 10:00" },
  { id: 2, nome: "Sala 102", tipo: "Sala de Aula", capacidade: 40, status: "ocupada", horario: "08:00 - 10:00" },
  { id: 3, nome: "Lab 201", tipo: "Laboratório de Informática", capacidade: 25, status: "disponivel", horario: "08:00 - 10:00" },
  { id: 4, nome: "Sala 203", tipo: "Sala de Aula", capacidade: 35, status: "manutencao", horario: "08:00 - 10:00" },
  { id: 5, nome: "Auditório", tipo: "Auditório", capacidade: 100, status: "disponivel", horario: "08:00 - 10:00" },
  { id: 6, nome: "Lab 301", tipo: "Laboratório de Informática", capacidade: 20, status: "ocupada", horario: "08:00 - 10:00" },
];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel": return "success";
      case "ocupada": return "destructive";
      case "manutencao": return "warning";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "disponivel": return "Disponível";
      case "ocupada": return "Ocupada";
      case "manutencao": return "Manutenção";
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
            <h1 className="text-4xl font-bold mb-2">Calendário de Salas</h1>
            <p className="text-muted-foreground">
              Visualize a disponibilidade das salas em tempo real
            </p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Horário" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSalas.map((sala) => (
              <Card key={sala.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{sala.nome}</CardTitle>
                      <CardDescription>{sala.tipo}</CardDescription>
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
                      <Clock className="h-4 w-4" />
                      <span>{sala.horario}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Bloco A - 1º Andar</span>
                    </div>
                  </div>

                  {sala.status === "disponivel" && (
                    <Button className="w-full" variant="default">
                      <Calendar className="h-4 w-4" />
                      Agendar Sala
                    </Button>
                  )}
                  {sala.status === "ocupada" && (
                    <Button className="w-full" variant="outline" disabled>
                      Ver Detalhes
                    </Button>
                  )}
                  {sala.status === "manutencao" && (
                    <Button className="w-full" variant="outline" disabled>
                      Em Manutenção
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Card */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
