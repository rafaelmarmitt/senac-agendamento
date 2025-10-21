import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Wrench, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AgendamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sala?: {
    nome: string;
    capacidade: number;
  };
}

const recursosAdicionais = [
  "Microfone sem fio",
  "Notebook extra",
  "Câmera de vídeo",
  "Mesa digitalizadora",
  "Suporte técnico presencial",
  "Cadeiras extras",
  "Flip chart",
  "Kit multimídia completo",
];

export default function AgendamentoModal({ open, onOpenChange, sala }: AgendamentoModalProps) {
  const [formData, setFormData] = useState({
    data: "",
    horarioInicio: "",
    horarioFim: "",
    participantes: "",
    motivo: "",
    equipamentos: "",
  });
  const [recursosExtras, setRecursosExtras] = useState<string[]>([]);

  const toggleRecurso = (recurso: string) => {
    setRecursosExtras((prev) =>
      prev.includes(recurso) ? prev.filter((r) => r !== recurso) : [...prev, recurso]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recursos = recursosExtras.length > 0 ? recursosExtras.join(", ") : "Nenhum recurso adicional";
    
    toast({
      title: "Solicitação Enviada!",
      description: `Seu pedido de agendamento foi enviado para aprovação. ${recursosExtras.length > 0 ? 'Recursos adicionais solicitados: ' + recursos : ''}`,
    });
    
    onOpenChange(false);
    setFormData({
      data: "",
      horarioInicio: "",
      horarioFim: "",
      participantes: "",
      motivo: "",
      equipamentos: "",
    });
    setRecursosExtras([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Agendamento</DialogTitle>
          <DialogDescription>
            {sala ? `Reservar ${sala.nome}` : "Preencha os detalhes da sua reserva"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!sala && (
            <div className="space-y-2">
              <Label htmlFor="sala">Sala</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lab201">Lab 201 - Laboratório (30 pessoas)</SelectItem>
                  <SelectItem value="sala102">Sala 102 - Sala de Aula (40 pessoas)</SelectItem>
                  <SelectItem value="auditorio">Auditório (100 pessoas)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data
              </Label>
              <Input
                id="data"
                type="date"
                required
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participantes" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Número de Participantes
              </Label>
              <Input
                id="participantes"
                type="number"
                required
                placeholder="Ex: 25"
                max={sala?.capacidade}
                value={formData.participantes}
                onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
              />
              {sala && (
                <p className="text-xs text-muted-foreground">
                  Capacidade máxima: {sala.capacidade} pessoas
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horarioInicio" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário de Início
              </Label>
              <Input
                id="horarioInicio"
                type="time"
                required
                value={formData.horarioInicio}
                onChange={(e) => setFormData({ ...formData, horarioInicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horarioFim">Horário de Término</Label>
              <Input
                id="horarioFim"
                type="time"
                required
                value={formData.horarioFim}
                onChange={(e) => setFormData({ ...formData, horarioFim: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo da Reserva</Label>
            <Textarea
              id="motivo"
              required
              placeholder="Descreva o propósito do uso da sala..."
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipamentos" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Equipamentos Necessários (Padrão da Sala)
            </Label>
            <Textarea
              id="equipamentos"
              placeholder="Ex: Projetor, Computadores, Quadro branco..."
              value={formData.equipamentos}
              onChange={(e) => setFormData({ ...formData, equipamentos: e.target.value })}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Equipamentos já disponíveis na sala. Use o campo abaixo para solicitar recursos extras.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Recursos Adicionais (Opcional)
            </Label>
            <p className="text-sm text-muted-foreground">
              Selecione recursos extras que você precisa para sua atividade:
            </p>
            <div className="grid grid-cols-2 gap-3 p-4 bg-secondary/30 rounded-lg">
              {recursosAdicionais.map((recurso) => (
                <div key={recurso} className="flex items-start space-x-2">
                  <Checkbox
                    id={`recurso-${recurso}`}
                    checked={recursosExtras.includes(recurso)}
                    onCheckedChange={() => toggleRecurso(recurso)}
                  />
                  <Label
                    htmlFor={`recurso-${recurso}`}
                    className="text-sm cursor-pointer leading-tight"
                  >
                    {recurso}
                  </Label>
                </div>
              ))}
            </div>
            {recursosExtras.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-muted-foreground mr-1">Selecionados:</span>
                {recursosExtras.map((recurso) => (
                  <Badge key={recurso} variant="secondary" className="text-xs">
                    {recurso}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Enviar Solicitação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
