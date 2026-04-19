-- Bucket public pour les uploads utilisateur (images, vidéos, audio de référence)
INSERT INTO storage.buckets (id, name, public)
VALUES ('kreator-uploads', 'kreator-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique (les API externes Sora/Veo/Kling doivent pouvoir télécharger)
CREATE POLICY "Kreator uploads are publicly readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'kreator-uploads');

-- Chaque utilisateur upload uniquement dans son propre dossier (uid/...)
CREATE POLICY "Users can upload to their own kreator folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kreator-uploads'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own kreator files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'kreator-uploads'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own kreator files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'kreator-uploads'
  AND auth.uid()::text = (storage.foldername(name))[1]
);