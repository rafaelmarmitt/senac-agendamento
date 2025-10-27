-- Create storage bucket for room images
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-images', 'room-images', true);

-- Create policies for room images bucket
CREATE POLICY "Room images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'room-images');

CREATE POLICY "Admins can upload room images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'room-images' 
  AND (has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can update room images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'room-images' 
  AND (has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can delete room images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'room-images' 
  AND (has_role(auth.uid(), 'admin'::app_role))
);