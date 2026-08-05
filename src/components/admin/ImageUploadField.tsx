import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X, Repeat } from 'lucide-react';
import { uploadFoto } from '../../lib/supabase';

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setErro(null);
    try {
      const url = await uploadFoto(file, folder);
      onChange(url);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao enviar a imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink/60">{label}</label>

      <div
        onDragOver={(e) => { e.preventDefault(); setArrastando(true); }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
          arrastando ? 'border-brand bg-brand/5' : value ? 'border-transparent' : 'border-slate-300 bg-slate-50 hover:border-brand/40 hover:bg-brand/5'
        }`}
      >
        {value && !uploading && (
          <>
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/40" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="tap-target relative flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink opacity-0 shadow-card transition-opacity group-hover:opacity-100"
            >
              <Repeat className="h-3.5 w-3.5" /> Trocar foto
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remover foto"
              className="tap-target absolute right-2 top-2 flex items-center justify-center rounded-full bg-white/90 p-1.5 text-red-600 opacity-0 shadow-card transition-opacity group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}

        {!value && !uploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="tap-target flex flex-col items-center gap-2 px-4 py-6 text-center"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-card">
              <ImagePlus className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-ink/70">Toque para escolher uma foto</span>
            <span className="text-xs text-ink/40">ou arraste o arquivo aqui</span>
          </button>
        )}

        {uploading && (
          <div className="flex flex-col items-center gap-2 text-brand">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs font-medium">Enviando...</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {erro ? (
        <p className="mt-1.5 text-xs font-medium text-red-600">{erro}</p>
      ) : (
        <p className="mt-1.5 text-xs text-ink/35">Mínimo 300×300px — fotos grandes são ajustadas automaticamente.</p>
      )}
    </div>
  );
}
