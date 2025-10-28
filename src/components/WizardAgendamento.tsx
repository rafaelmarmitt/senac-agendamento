import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Users, MapPin, Laptop, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";

interface WizardAgendamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 1 | 2 | 3 | 4;

const recursosDisponiveis = [
  "Microfone sem fio",
  "Notebook",
  "Câmera",
  "Mesa digitalizadora",
  "Suporte técnico",
  "Cadeiras extras",
];

export default function WizardAgendamento({ open, onOpenChange }: WizardAgendamentoProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [tipoSala, setTipoSala] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [recursosExtras, setRecursosExtras] = useState<string[]>([]);
  const [recorrente, setRecorrente] = useState(false);
  const [recorrenciaTipo, setRecorrenciaTipo] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { rooms } = useRooms();
  const { createBooking } = useBookings();
  const { user } = useAuth();

  const handleClose = () => {
    setStep(1);
    setSelectedDate(undefined);
    setHorarioInicio("");
    setHorarioFim("");
    setCapacidade("");
    setTipoSala("");
    setSalaSelecionada(null);
    setMotivo("");
    setRecursosExtras([]);
    setRecorrente(false);
    setRecorrenciaTipo("");
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as Step);
  };

  const handlePrevious = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = async () => {
    if (!user || !salaSelecionada || !selectedDate) return;
    
    setLoading(true);
    const { error } = await createBooking({
      room_id: salaSelecionada,
      user_id: user.id,
      data: selectedDate.toISOString().split('T')[0],
      hora_inicio: horarioInicio,
      hora_fim: horarioFim,
      participantes: parseInt(capacidade),
      motivo,
      recursos_extras: recursosExtras,
    });

    if (error) {
      toast({
        title: "Erro ao criar reserva",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Solicitação Enviada!",
        description: "Sua solicitação de agendamento foi enviada para aprovação. Você será notificado em breve.",
      });
      handleClose();
    }
    setLoading(false);
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "sala": return "Sala de Aula";
      case "laboratorio": return "Laboratório";
      case "auditorio": return "Auditório";
      default: return tipo;
    }
  };

  const salasDisponiveis = rooms.filter((sala) => {
    const matchCapacidade = !capacidade || sala.capacidade >= parseInt(capacidade);
    const matchTipo = !tipoSala || sala.tipo === tipoSala;
    const matchStatus = sala.status === 'available';
    return matchCapacidade && matchTipo && matchStatus;
  });

  const toggleRecurso = (recurso: string) => {
    setRecursosExtras((prev) =>
      prev.includes(recurso) ? prev.filter((r) => r !== recurso) : [...prev, recurso]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">Nova Reserva - Passo {step} de 4</DialogTitle>
          <DialogDescription className="text-sm">
            Siga o assistente para criar sua reserva de forma rápida e fácil
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                    s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : s}
                </div>
                {s < 4 && <div className={`h-1 w-8 sm:w-16 mx-1 sm:mx-2 ${s < step ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Data e Horário */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold">Quando você precisa?</h3>
              </div>
              
              <div className="flex justify-center overflow-x-auto">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border scale-90 sm:scale-100 origin-top"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inicio">Horário de Início</Label>
                  <Input
                    id="inicio"
                    type="time"
                    value={horarioInicio}
                    onChange={(e) => setHorarioInicio(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fim">Horário de Término</Label>
                  <Input
                    id="fim"
                    type="time"
                    value={horarioFim}
                    onChange={(e) => setHorarioFim(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-secondary/50 rounded-lg">
                <Checkbox
                  id="recorrente"
                  checked={recorrente}
                  onCheckedChange={(checked) => setRecorrente(checked as boolean)}
                />
                <Label htmlFor="recorrente" className="cursor-pointer">
                  Agendar como recorrente
                </Label>
              </div>

              {recorrente && (
                <Select value={recorrenciaTipo} onValueChange={setRecorrenciaTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diaria">Diariamente</SelectItem>
                    <SelectItem value="semanal">Semanalmente</SelectItem>
                    <SelectItem value="quinzenal">Quinzenalmente</SelectItem>
                    <SelectItem value="mensal">Mensalmente</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Step 2: Capacidade e Tipo */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold">Para quantas pessoas e que tipo de espaço?</h3>
              </div>

              <div>
                <Label htmlFor="capacidade">Número de Participantes</Label>
                <Input
                  id="capacidade"
                  type="number"
                  placeholder="Ex: 25"
                  value={capacidade}
                  onChange={(e) => setCapacidade(e.target.value)}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de Sala</Label>
                <Select value={tipoSala} onValueChange={setTipoSala}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de sala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sala">Sala de Aula</SelectItem>
                    <SelectItem value="laboratorio">Laboratório</SelectItem>
                    <SelectItem value="auditorio">Auditório</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Escolher Sala */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold">Salas disponíveis que atendem seus critérios</h3>
              </div>

              {salasDisponiveis.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Nenhuma sala disponível para os critérios selecionados. Tente ajustar a capacidade ou tipo.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {salasDisponiveis.map((sala) => (
                    <Card
                      key={sala.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        salaSelecionada === sala.id ? "border-primary border-2" : ""
                      }`}
                      onClick={() => setSalaSelecionada(sala.id)}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-semibold text-sm sm:text-base">{sala.nome}</h4>
                              <Badge variant="secondary" className="text-xs">{getTipoLabel(sala.tipo)}</Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                              Capacidade: {sala.capacidade} pessoas
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 truncate">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">{sala.localizacao}</span>
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {sala.recursos.slice(0, 3).map((recurso) => (
                                <Badge key={recurso} variant="outline" className="text-xs">
                                  {recurso}
                                </Badge>
                              ))}
                              {sala.recursos.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{sala.recursos.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {salaSelecionada === sala.id && (
                            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Detalhes e Recursos */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Laptop className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold">Motivo e Recursos Adicionais</h3>
              </div>

              <div>
                <Label htmlFor="motivo" className="text-sm sm:text-base">Motivo da Reserva</Label>
                <Textarea
                  id="motivo"
                  placeholder="Ex: Aula prática de programação web"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label className="text-sm sm:text-base">Recursos Adicionais (opcional)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {recursosDisponiveis.map((recurso) => (
                    <div key={recurso} className="flex items-center space-x-2">
                      <Checkbox
                        id={recurso}
                        checked={recursosExtras.includes(recurso)}
                        onCheckedChange={() => toggleRecurso(recurso)}
                      />
                      <Label htmlFor={recurso} className="cursor-pointer text-xs sm:text-sm">
                        {recurso}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-secondary/30 p-3 sm:p-4">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Resumo da Reserva</h4>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="break-words">
                    <strong>Data:</strong> {selectedDate?.toLocaleDateString("pt-BR") || "Não selecionada"}
                  </p>
                  <p>
                    <strong>Horário:</strong> {horarioInicio} - {horarioFim}
                  </p>
                  {recorrente && (
                    <p>
                      <strong>Recorrência:</strong> {recorrenciaTipo}
                    </p>
                  )}
                  <p className="break-words">
                    <strong>Sala:</strong>{" "}
                    {rooms.find((s) => s.id === salaSelecionada)?.nome || "Não selecionada"}
                  </p>
                  <p>
                    <strong>Participantes:</strong> {capacidade || "Não informado"}
                  </p>
                  {recursosExtras.length > 0 && (
                    <p className="break-words">
                      <strong>Recursos extras:</strong> {recursosExtras.join(", ")}
                    </p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={step === 1}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Anterior</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!selectedDate || !horarioInicio || !horarioFim)) ||
                  (step === 2 && (!capacidade || !tipoSala)) ||
                  (step === 3 && !salaSelecionada)
                }
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!motivo || loading}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {loading ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
