import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  participantes: number;
  motivo: string;
  recursos_extras: string[];
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  justificativa: string | null;
  check_in_at: string | null;
  rooms?: {
    nome: string;
    tipo: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
}

export function useBookings(filterUserId?: boolean) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        rooms(nome, tipo),
        profiles(full_name, email)
      `)
      .order('data', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (filterUserId && user) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    
    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user || !filterUserId) {
      fetchBookings();

      const channel = supabase
        .channel('bookings-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings'
          },
          () => {
            fetchBookings();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, filterUserId]);

  const createBooking = async (booking: Omit<Booking, 'id' | 'status' | 'justificativa' | 'check_in_at' | 'rooms' | 'profiles'>) => {
    const { error } = await supabase
      .from('bookings')
      .insert([booking]);
    
    return { error };
  };

  const updateBookingStatus = async (id: string, status: Booking['status'], justificativa?: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status, justificativa })
      .eq('id', id);
    
    return { error };
  };

  const cancelBooking = async (id: string) => {
    return updateBookingStatus(id, 'cancelled');
  };

  const checkIn = async (id: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ check_in_at: new Date().toISOString() })
      .eq('id', id);
    
    return { error };
  };

  return { 
    bookings, 
    loading, 
    refetch: fetchBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    checkIn
  };
}
