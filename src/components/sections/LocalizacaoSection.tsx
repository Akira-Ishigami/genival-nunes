import { MapPin, Navigation, Users2, Building2, Sparkle } from 'lucide-react';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { useContato } from '../../hooks/useContent';

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

const MOTIVOS = [
  { icon: Building2, texto: 'Conheça de perto a piscina, o auditório, a biblioteca e os laboratórios.' },
  { icon: Users2, texto: 'Converse com a equipe gestora e tire suas dúvidas sobre o Programa de Educação Integral.' },
  { icon: Sparkle, texto: 'Sinta o dia a dia da escola e o ambiente onde seu filho vai aprender e conviver.' },
];

export default function LocalizacaoSection({ number }: { number: number }) {
  const { contato, loading } = useContato();

  const lat = contato?.latitude ?? -12.7406;
  const lng = contato?.longitude ?? -60.1458;

  const comoChegarHref = isIOS()
    ? `https://maps.apple.com/?daddr=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section id="localizacao" className="scroll-mt-20 overflow-hidden bg-navy pb-24 pt-20 sm:pb-32 sm:pt-28">
      <Container>
        <SectionHeading
          number={String(number).padStart(2, '0')}
          eyebrow="Vamos te receber"
          title="Venha conhecer a escola de perto"
          subtitle="Nenhum site mostra tudo. Separe um horário e venha ver a estrutura, conhecer a equipe e sentir o ambiente onde seu filho vai aprender."
          light
          align="center"
        />

        <Reveal className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {MOTIVOS.map((m) => (
            <div key={m.texto} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow/15 text-yellow">
                <m.icon className="h-4 w-4" />
              </span>
              <p className="text-sm leading-relaxed text-white/75">{m.texto}</p>
            </div>
          ))}
        </Reveal>
      </Container>

      {/* Mapa em largura de tela cheia com o convite flutuando por cima, tipo canhoto de ingresso. */}
      <Reveal className="relative mx-4 sm:mx-6 lg:mx-8">
        <div className="relative h-[22rem] w-full overflow-hidden rounded-[2rem] shadow-card-lg sm:h-[30rem] sm:rounded-[2.5rem]">
          {!loading && (
            <iframe
              title="Mapa da localização da escola"
              className="h-full w-full grayscale-[20%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${lat},${lng}&hl=pt-BR&z=16&output=embed`}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-navy-deep/80 sm:via-navy-deep/10 sm:to-transparent" />
        </div>

        <div className="relative z-10 mx-auto -mt-16 w-[calc(100%-2rem)] max-w-sm rotate-[-1deg] rounded-3xl border border-navy/5 bg-white p-6 shadow-card-lg transition-transform hover:rotate-0 sm:absolute sm:bottom-8 sm:left-8 sm:mx-0 sm:mt-0 sm:w-full sm:p-7">
          {loading && <div className="skeleton h-40 rounded-xl" />}
          {!loading && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy/10 text-navy">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-navy">Endereço</h3>
                  <p className="mt-1 text-sm text-ink/60">
                    {contato?.endereco}, {contato?.bairro}
                    <br />
                    {contato?.cidade} — CEP {contato?.cep}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 border-t border-dashed border-navy/15 pt-4">
                <a
                  href={comoChegarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-yellow px-5 py-3 text-sm font-bold text-navy-deep shadow-pop transition-transform active:scale-95 active:shadow-none"
                >
                  <Navigation className="h-4 w-4" /> Como chegar
                </a>

                {contato?.whatsapp && (
                  <a
                    href={`https://wa.me/${contato.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-navy/15 px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-sand active:scale-95"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Falar no WhatsApp
                  </a>
                )}
              </div>

              <p className="text-center text-xs text-ink/40">
                Chame no WhatsApp pra combinar o melhor dia e horário — vamos adorar te receber.
              </p>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
