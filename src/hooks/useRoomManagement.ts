import { supabase } from '@/integrations/supabase/client';
import { Room } from './useRooms';

export function useRoomManagement() {
  const createRoom = async (room: Omit<Room, 'id'>) => {
    const { error } = await supabase
      .from('rooms')
      .insert([room]);
    
    return { error };
  };

  const updateRoom = async (id: string, room: Partial<Room>) => {
    const { error } = await supabase
      .from('rooms')
      .update(room)
      .eq('id', id);
    
    return { error };
  };

  const deleteRoom = async (id: string) => {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);
    
    return { error };
  };

  const updateRoomStatus = async (id: string, status: 'available' | 'occupied' | 'maintenance') => {
    return updateRoom(id, { status });
  };

  return { createRoom, updateRoom, deleteRoom, updateRoomStatus };
}
