import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Users, DoorOpen, Settings, BarChart3, Plus, Edit, Trash2, Shield, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { useRooms } from "@/hooks/useRooms";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import { Textarea } from "@/components/ui/textarea";

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("usuarios");
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  
  const [roomForm, setRoomForm] = useState({
    nome: '',
    tipo: 'sala' as 'sala' | 'laboratorio' | 'auditorio',
    capacidade: 0,
    localizacao: '',
    descricao: '',
    recursos: [] as string[],
    status: 'available' as 'available' | 'occupied' | 'maintenance'
  });
  
  const [recursosInput, setRecursosInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<'student' | 'manager' | 'admin'>('student');
  
  const { users, loading: usersLoading, updateUserRole } = useUsers();
  const { rooms, loading: roomsLoading } = useRooms();
  const { createRoom, updateRoom, deleteRoom } = useRoomManagement();

  const stats = useMemo(() => ({
    activeUsers: users.length,
    totalRooms: rooms.length,
    maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
    managers: users.filter(u => u.user_roles?.some(r => r.role === 'manager')).length
  }), [users, rooms]);

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    const { error } = await updateUserRole(selectedUser.id, newRole);
    
    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Permissão Atualizada",
        description: `Usuário agora é ${newRole === 'admin' ? 'Administrador' : newRole === 'manager' ? 'Gerente' : 'Estudante'}.`,
      });
      setUserDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSubmitRoom = async () => {
    const roomData = {
      ...roomForm,
      recursos: recursosInput.split(',').map(r => r.trim()).filter(r => r),
      imagem: null
    };

    if (editingRoom) {
      const { error } = await updateRoom(editingRoom.id, roomData);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sala Atualizada", description: "Sala atualizada com sucesso." });
        resetRoomForm();
      }
    } else {
      const { error } = await createRoom(roomData);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sala Criada", description: "Nova sala cadastrada com sucesso." });
        resetRoomForm();
      }
    }
  };

  const handleDeleteRoom = async (id: string) => {
    const { error } = await deleteRoom(id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sala Removida", description: "Sala removida com sucesso." });
    }
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setRoomForm({
      nome: room.nome,
      tipo: room.tipo,
      capacidade: room.capacidade,
      localizacao: room.localizacao,
      descricao: room.descricao || '',
      recursos: room.recursos,
      status: room.status
    });
    setRecursosInput(room.recursos.join(', '));
    setRoomDialogOpen(true);
  };

  const resetRoomForm = () => {
    setEditingRoom(null);
    setRoomForm({
      nome: '', tipo: 'sala', capacidade: 0, localizacao: '', descricao: '', recursos: [], status: 'available'
    });
    setRecursosInput('');
    setRoomDialogOpen(false);
  };

  const getUserRole = (user: any) => {
    const role = user.user_roles?.[0]?.role;
    if (role === 'admin') return 'Administrador';
    if (role === 'manager') return 'Gerente';
    return 'Estudante';
  };

  const getRoleVariant = (user: any): "default" | "secondary" | "destructive" => {
    const role = user.user_roles?.[0]?.role;
    if (role === 'admin') return 'destructive';
    if (role === 'manager') return 'default';
    return 'secondary';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">Controle total do sistema de agendamento</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersLoading ? "-" : stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Total cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Salas</CardTitle>
                <DoorOpen className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roomsLoading ? "-" : stats.totalRooms}</div>
                <p className="text-xs text-muted-foreground">{stats.maintenanceRooms} em manutenção</p>
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
                <div className="text-2xl font-bold">{usersLoading ? "-" : stats.managers}</div>
                <p className="text-xs text-muted-foreground">Ativos no sistema</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="salas">Salas</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="usuarios" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
              </div>

              {usersLoading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {!usersLoading && users.map((usuario) => (
                <Card key={usuario.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{usuario.full_name}</CardTitle>
                        <CardDescription>{usuario.email}</CardDescription>
                      </div>
                      <Badge variant={getRoleVariant(usuario)}>
                        {getUserRole(usuario)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(usuario);
                        setNewRole(usuario.user_roles?.[0]?.role || 'student');
                        setUserDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Alterar Permissão
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="salas" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gerenciamento de Salas</h2>
                <Button onClick={() => {
                  resetRoomForm();
                  setRoomDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Sala
                </Button>
              </div>

              {roomsLoading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {!roomsLoading && rooms.map((sala) => (
                <Card key={sala.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{sala.nome}</CardTitle>
                        <CardDescription>
                          {sala.tipo} • Capacidade: {sala.capacidade} pessoas
                        </CardDescription>
                      </div>
                      <Badge variant={sala.status === "available" ? "success" : sala.status === "maintenance" ? "warning" : "destructive"}>
                        {sala.status === "available" ? "Disponível" : sala.status === "maintenance" ? "Manutenção" : "Ocupada"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Local:</strong> {sala.localizacao}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Recursos:</strong> {sala.recursos.join(', ')}
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRoom(sala)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteRoom(sala.id)}>
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
          </Tabs>
        </div>
      </main>

      {/* User Role Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Permissão de Usuário</DialogTitle>
            <DialogDescription>
              Defina a nova permissão para {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nova Permissão</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Estudante</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateRole}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoom ? 'Editar Sala' : 'Nova Sala'}</DialogTitle>
            <DialogDescription>
              Preencha os dados da sala
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Sala</Label>
              <Input value={roomForm.nome} onChange={(e) => setRoomForm({...roomForm, nome: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={roomForm.tipo} onValueChange={(v: any) => setRoomForm({...roomForm, tipo: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sala">Sala de Aula</SelectItem>
                  <SelectItem value="laboratorio">Laboratório</SelectItem>
                  <SelectItem value="auditorio">Auditório</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Capacidade</Label>
              <Input type="number" value={roomForm.capacidade} onChange={(e) => setRoomForm({...roomForm, capacidade: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Localização</Label>
              <Input value={roomForm.localizacao} onChange={(e) => setRoomForm({...roomForm, localizacao: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={roomForm.descricao} onChange={(e) => setRoomForm({...roomForm, descricao: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Recursos (separados por vírgula)</Label>
              <Input value={recursosInput} onChange={(e) => setRecursosInput(e.target.value)} placeholder="Projetor, Quadro, Ar-condicionado" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={roomForm.status} onValueChange={(v: any) => setRoomForm({...roomForm, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => resetRoomForm()}>Cancelar</Button>
            <Button onClick={handleSubmitRoom}>{editingRoom ? 'Atualizar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
