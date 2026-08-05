import { createClient } from '@supabase/supabase-js';
import { prepararImagem } from './imagem';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON as string;

export const supabase = createClient(url, anon);

export const FOTOS_BUCKET = 'fotos';

export function fotoPublicUrl(path: string): string {
  return supabase.storage.from(FOTOS_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadFoto(file: File, pasta: string): Promise<string> {
  const pronta = await prepararImagem(file);
  const ext = pronta.name.split('.').pop() || 'jpg';
  const path = `${pasta}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(FOTOS_BUCKET).upload(path, pronta, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  return fotoPublicUrl(path);
}
