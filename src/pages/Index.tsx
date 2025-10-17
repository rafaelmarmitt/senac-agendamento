import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Users, Shield, Clock, BarChart3, Bell, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-senac.jpg";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              Sistema Oficial SENAC
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Gerencie Salas com Inteligência
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Sistema completo de agendamento de salas e laboratórios. Organize, agende e otimize 
              o uso dos espaços do SENAC com facilidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="accent" asChild>
                <Link to="/calendario">
                  <Calendar className="h-5 w-5" />
                  Ver Calendário
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/registro">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Funcionalidades Poderosas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todas as ferramentas que você precisa para gerenciar agendamentos de forma eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Calendário Interativo</CardTitle>
                <CardDescription>
                  Visualize a disponibilidade de todas as salas em tempo real através de um calendário intuitivo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Múltiplos Perfis</CardTitle>
                <CardDescription>
                  Sistema com diferentes níveis de acesso: visitantes, usuários, gerentes e administradores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Shield className="h-12 w-12 text-success mb-4" />
                <CardTitle>Sistema de Aprovação</CardTitle>
                <CardDescription>
                  Processo estruturado de solicitação e aprovação de agendamentos por gerentes autorizados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Agendamento Rápido</CardTitle>
                <CardDescription>
                  Reserve salas em poucos cliques, informando horário, motivo e recursos necessários
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Bell className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Receba alertas sobre aprovações, lembretes de agendamentos e atualizações importantes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-success mb-4" />
                <CardTitle>Relatórios Detalhados</CardTitle>
                <CardDescription>
                  Análise completa de utilização de salas, estatísticas e relatórios para gestão eficiente
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Feito para Todos os Usuários
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Diferentes perfis com permissões personalizadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Visitante</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Visualizar calendário público</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Ver status das salas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-primary/50">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Usuário Comum</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Solicitar agendamentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Acompanhar solicitações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Receber notificações</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-accent/50">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Gerente</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Aprovar solicitações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Criar reservas diretas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Gerenciar salas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-success/50">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-xl">Administrador</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Controle total do sistema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Gerenciar usuários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Visualizar relatórios</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Otimizar seus Agendamentos?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Comece agora e transforme a gestão de salas da sua unidade SENAC
          </p>
          <Button size="lg" variant="accent" asChild>
            <Link to="/registro">
              Criar Conta Gratuitamente
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
