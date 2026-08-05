// Regras de foto pro site: nem muito pequena (fica borrada), nem muito grande
// (deixa o site lento). Fotos grandes são redimensionadas automaticamente —
// o admin não precisa saber editar imagem pra usar o painel.
export const FOTO_LADO_MINIMO = 300; // px — abaixo disso a foto fica borrada nos cards
export const FOTO_LADO_MAXIMO = 1920; // px — acima disso, redimensiona automaticamente
export const FOTO_TAMANHO_MAXIMO_ORIGINAL = 20 * 1024 * 1024; // 20MB — limite de segurança antes de processar

function carregarImagem(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível abrir essa imagem. Tente outro arquivo.'));
    };
    img.src = url;
  });
}

/**
 * Valida e prepara uma foto pro upload: rejeita se for pequena demais, e
 * redimensiona automaticamente (mantendo a proporção) se for grande demais.
 */
export async function prepararImagem(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Esse arquivo não é uma imagem.');
  }
  if (file.size > FOTO_TAMANHO_MAXIMO_ORIGINAL) {
    throw new Error('Essa foto é grande demais (máximo 20MB). Escolha uma foto menor.');
  }

  const img = await carregarImagem(file);
  const { naturalWidth: largura, naturalHeight: altura } = img;

  if (largura < FOTO_LADO_MINIMO || altura < FOTO_LADO_MINIMO) {
    throw new Error(
      `Essa foto é pequena demais (${largura}×${altura}px). Escolha uma foto com pelo menos ${FOTO_LADO_MINIMO}×${FOTO_LADO_MINIMO} pixels.`,
    );
  }

  // Já está dentro do tamanho ideal — envia como está, sem reprocessar (mantém a qualidade original).
  if (largura <= FOTO_LADO_MAXIMO && altura <= FOTO_LADO_MAXIMO) {
    return file;
  }

  const escala = FOTO_LADO_MAXIMO / Math.max(largura, altura);
  const novaLargura = Math.round(largura * escala);
  const novaAltura = Math.round(altura * escala);

  const canvas = document.createElement('canvas');
  canvas.width = novaLargura;
  canvas.height = novaAltura;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, novaLargura, novaAltura);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
  if (!blob) return file;

  const nomeBase = file.name.replace(/\.[^.]+$/, '');
  return new File([blob], `${nomeBase}.jpg`, { type: 'image/jpeg' });
}
