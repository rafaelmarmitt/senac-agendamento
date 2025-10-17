import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, DoorOpen, Wrench, Calendar, MapPin } from "lucide-react";

interface SalaDetalhesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sala: {
    nome: string;
    tipo: string;
    capacidade: number;
    recursos: string[];
    status: "disponivel" | "ocupada" | "manutencao";
    localizacao?: string;
    descricao?: string;
    proximasReservas?: Array<{
      data: string;
      horario: string;
      usuario: string;
    }>;
  };
  onAgendar?: () => void;
}

export default function SalaDetalhesModal({ 
  open, 
  onOpenChange, 
  sala,
  onAgendar 
}: SalaDetalhesModalProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{sala.nome}</DialogTitle>
              <DialogDescription>{sala.tipo}</DialogDescription>
            </div>
            <Badge variant={getStatusVariant(sala.status)}>
              {getStatusLabel(sala.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Capacidade</p>
                <p className="font-semibold">{sala.capacidade} pessoas</p>
              </div>
            </div>

            {sala.localizacao && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="font-semibold">{sala.localizacao}</p>
                </div>
              </div>
            )}
          </div>

          {/* Descrição */}
          {sala.descricao && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <DoorOpen className="h-4 w-4" />
                Descrição
              </h3>
              <p className="text-muted-foreground">{sala.descricao}</p>
            </div>
          )}

          <Separator />

          {/* Recursos */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Recursos Disponíveis
            </h3>
            <div className="flex flex-wrap gap-2">
              {sala.recursos.map((recurso, index) => (
                <Badge key={index} variant="outline">
                  {recurso}
                </Badge>
              ))}
            </div>
          </div>

          {/* Próximas Reservas */}
          {sala.proximasReservas && sala.proximasReservas.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Próximas Reservas
                </h3>
                <div className="space-y-2">
                  {sala.proximasReservas.map((reserva, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{reserva.data}</p>
                        <p className="text-sm text-muted-foreground">{reserva.horario}</p>
                      </div>
                      <Badge variant="secondary">{reserva.usuario}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            {sala.status === "disponivel" && onAgendar && (
              <Button onClick={onAgendar} className="flex-1">
                Agendar esta Sala
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
