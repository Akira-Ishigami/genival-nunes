import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

function detectarDispositivo(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function detectarOrigem(): string {
  const ref = document.referrer;
  if (!ref) return 'Direto';
  try {
    const host = new URL(ref).hostname.replace('www.', '');
    if (host.includes('google')) return 'Google';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('facebook')) return 'Facebook';
    if (host.includes('whatsapp') || host.includes('wa.me')) return 'WhatsApp';
    if (host === window.location.hostname) return 'Direto';
    return host;
  } catch {
    return 'Direto';
  }
}

// Registra um acesso à página uma vez por visita.
export function useTrackPageView() {
  useEffect(() => {
    supabase.from('page_views').insert({
      caminho: window.location.pathname,
      dispositivo: detectarDispositivo(),
      origem: detectarOrigem(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
