import Reveal from './Reveal';

export default function SectionHeading({
  number,
  eyebrow,
  title,
  subtitle,
  light = false,
  align = 'left',
}: {
  number: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal className={`mb-10 sm:mb-14 ${align === 'center' ? 'text-center' : ''}`}>
      <div className={`flex items-baseline gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className={`font-display text-sm font-semibold ${light ? 'text-yellow-light' : 'text-sky-dark'}`}>
          {number}
        </span>
        <span
          className={`h-px w-10 ${light ? 'bg-white/30' : 'bg-navy/20'}`}
        />
        <span
          className={`text-xs font-bold uppercase tracking-[0.22em] ${light ? 'text-white/60' : 'text-navy/50'}`}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className={`mt-3 max-w-2xl font-display text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-5xl ${
          light ? 'text-white' : 'text-navy'
        } ${align === 'center' ? 'mx-auto' : ''}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-xl text-base leading-relaxed sm:text-lg ${light ? 'text-white/75' : 'text-ink/60'} ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
