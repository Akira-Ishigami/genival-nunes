import { prepararImagem } from './imagem';
import { demoClient } from './demoClient';

// MODO APRESENTAÇÃO: a conexão com o Supabase está desligada de propósito e o site
// roda 100% num banco temporário do navegador (localStorage — veja lib/demoClient.ts
// e lib/localDb.ts). Pra voltar a usar o Supabase real depois da apresentação, troque
// o bloco abaixo de volta para o createClient com as chaves do .env.
//
// import { createClient } from '@supabase/supabase-js';
// const url = import.meta.env.VITE_SUPABASE_URL as string;
// const anon = import.meta.env.VITE_SUPABASE_ANON as string;
// export const supabase = createClient(url, anon);

export const supabase = demoClient;

export function isDemoMode(): boolean {
  return true;
}

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
