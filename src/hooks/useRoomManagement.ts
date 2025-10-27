import { supabase } from '@/integrations/supabase/client';
import { Room } from './useRooms';

export function useRoomManagement() {
  const uploadImage = async (file: File): Promise<{ url: string | null; error: any }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('room-images')
      .upload(filePath, file);

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('room-images')
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  };

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
    // First, get the room to check if it has an image
    const { data: roomData } = await supabase
      .from('rooms')
      .select('imagem')
      .eq('id', id)
      .single();

    // Delete image from storage if exists
    if (roomData?.imagem) {
      const imagePath = roomData.imagem.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from('room-images')
          .remove([imagePath]);
      }
    }

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);
    
    return { error };
  };

  const updateRoomStatus = async (id: string, status: 'available' | 'occupied' | 'maintenance') => {
    return updateRoom(id, { status });
  };

  return { createRoom, updateRoom, deleteRoom, updateRoomStatus, uploadImage };
}
