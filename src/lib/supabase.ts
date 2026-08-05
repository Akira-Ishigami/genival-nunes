import { prepararImagem } from './imagem';
import { demoClient } from './demoClient';

// Site de apresentação: roda 100% num banco temporário do navegador (localStorage
// — veja lib/demoClient.ts e lib/localDb.ts), sem backend real por trás.
export const supabase = demoClient;

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
