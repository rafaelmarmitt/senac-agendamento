import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  nome: string;
  tipo: 'sala' | 'laboratorio' | 'auditorio';
  capacidade: number;
  recursos: string[];
  status: 'available' | 'occupied' | 'maintenance';
  localizacao: string;
  descricao: string | null;
  imagem: string | null;
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('nome');
    
    if (!error && data) {
      setRooms(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();

    const channel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms'
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { rooms, loading, refetch: fetchRooms };
}
