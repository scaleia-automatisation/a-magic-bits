import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BUCKET = 'kreator-uploads';

export type UploadKind = 'image' | 'video' | 'audio';

const ACCEPT: Record<UploadKind, string> = {
  image: 'image/jpeg,image/jpg,image/png,image/webp',
  video: 'video/mp4,video/quicktime,video/webm',
  audio: 'audio/mpeg,audio/wav,audio/x-wav,audio/aac,audio/mp4,audio/ogg',
};

const MAX_SIZE_MB: Record<UploadKind, number> = {
  image: 10,
  video: 50,
  audio: 15,
};

export function useStorageUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, kind: UploadKind = 'image'): Promise<string | null> => {
    const limitMb = MAX_SIZE_MB[kind];
    if (file.size > limitMb * 1024 * 1024) {
      toast.error(`Le fichier dépasse ${limitMb} Mo.`);
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Vous devez être connecté pour uploader un fichier.');
      return null;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return pub.publicUrl;
    } catch (e) {
      console.error('[useStorageUpload]', e);
      toast.error("Échec de l'upload du fichier.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, accept: ACCEPT };
}
