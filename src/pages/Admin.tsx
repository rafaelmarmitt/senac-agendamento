import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, DoorOpen, Settings, BarChart3, Plus, Edit, Trash2, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data
const usuarios = [
  { id: 1, nome: "João Silva", email: "joao@senac.br", tipo: "comum", ativo: true },
  { id: 2, nome: "Maria Santos", email: "maria@senac.br", tipo: "gerente", ativo: true },
  { id: 3, nome: "Pedro Costa", email: "pedro@senac.br", tipo: "comum", ativo: false },
];

const salas = [
  { id: 1, nome: "Lab 201", tipo: "Laboratório", capacidade: 30, recursos: "Computadores, Projetor", status: "disponivel" },
  { id: 2, nome: "Sala 102", tipo: "Sala de Aula", capacidade: 40, recursos: "Projetor, Quadro branco", status: "disponivel" },
  { id: 3, nome: "Auditório", tipo: "Auditório", capacidade: 100, recursos: "Som, Projetor, Microfones", status: "manutencao" },
];

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("usuarios");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleAddUser = () => {
    toast({
      title: "Usuário Adicionado",
      description: "Novo usuário cadastrado com sucesso.",
    });
    setDialogOpen(false);
  };

  const handleAddSala = () => {
    toast({
      title: "Sala Adicionada",
      description: "Nova sala cadastrada com sucesso.",
    });
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Controle total do sistema de agendamento
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+12 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Salas</CardTitle>
                <DoorOpen className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">3 em manutenção</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
                <BarChart3 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">Média semanal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
                <Shield className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Ativos no sistema</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="salas">Salas</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="usuarios" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditMode(false)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                      <DialogDescription>
                        Preencha os dados do novo usuário
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" placeholder="João Silva" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="joao@senac.br" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipo">Tipo de Usuário</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comum">Comum</SelectItem>
                            <SelectItem value="gerente">Gerente</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={handleAddUser}>
                        Adicionar Usuário
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {usuarios.map((usuario) => (
                <Card key={usuario.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{usuario.nome}</CardTitle>
                        <CardDescription>{usuario.email}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={usuario.tipo === "gerente" ? "default" : "secondary"}>
                          {usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}
                        </Badge>
                        <Badge variant={usuario.ativo ? "success" : "destructive"}>
                          {usuario.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="salas" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gerenciamento de Salas</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Sala
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Sala</DialogTitle>
                      <DialogDescription>
                        Cadastre uma nova sala ou espaço
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeSala">Nome da Sala</Label>
                        <Input id="nomeSala" placeholder="Lab 301" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipoSala">Tipo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sala">Sala de Aula</SelectItem>
                            <SelectItem value="lab">Laboratório</SelectItem>
                            <SelectItem value="auditorio">Auditório</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacidade">Capacidade</Label>
                        <Input id="capacidade" type="number" placeholder="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recursos">Recursos Disponíveis</Label>
                        <Input id="recursos" placeholder="Projetor, Computadores..." />
                      </div>
                      <Button className="w-full" onClick={handleAddSala}>
                        Adicionar Sala
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {salas.map((sala) => (
                <Card key={sala.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{sala.nome}</CardTitle>
                        <CardDescription>
                          {sala.tipo} • Capacidade: {sala.capacidade} pessoas
                        </CardDescription>
                      </div>
                      <Badge variant={sala.status === "disponivel" ? "success" : "warning"}>
                        {sala.status === "disponivel" ? "Disponível" : "Manutenção"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Recursos:</strong> {sala.recursos}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Status
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="relatorios">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios e Estatísticas</CardTitle>
                  <CardDescription>
                    Visualize dados de utilização e performance do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Relatório de Ocupação Mensal
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Relatório de Usuários Ativos
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DoorOpen className="h-4 w-4 mr-2" />
                      Salas Mais Utilizadas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuracoes">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Sistema</CardTitle>
                  <CardDescription>
                    Ajuste parâmetros gerais da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Horário de Funcionamento</Label>
                      <div className="flex gap-2">
                        <Input type="time" defaultValue="08:00" />
                        <Input type="time" defaultValue="22:00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tempo Máximo de Reserva (horas)</Label>
                      <Input type="number" defaultValue="4" />
                    </div>
                    <Button>Salvar Configurações</Button>
                  </div>
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
