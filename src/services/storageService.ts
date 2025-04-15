
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Check if the avatars bucket exists, if not, create it
const ensureAvatarsBucket = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.find(bucket => bucket.name === 'avatars')) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
      });
      
      if (error) throw error;
    }
  } catch (error: any) {
    console.error('Error ensuring avatars bucket:', error);
  }
};

// Initialize bucket
ensureAvatarsBucket();

export const uploadProfileImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
      
    return data.publicUrl;
  } catch (error: any) {
    toast.error(`Error uploading profile image: ${error.message}`);
    return null;
  }
};

export const deleteProfileImage = async (url: string): Promise<boolean> => {
  try {
    // Extract the path from the URL (after 'avatars/')
    const path = url.split('avatars/')[1];
    
    if (!path) return false;
    
    const { error } = await supabase.storage
      .from('avatars')
      .remove([path]);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Error deleting profile image: ${error.message}`);
    return false;
  }
};
