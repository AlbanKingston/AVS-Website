import Image from "next/image";

export default function Logo({ size = 40 }: { size?: number }) {
  const w = Math.round(size * 1.3);
  const h = size;

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="relative flex shrink-0 items-center justify-center"
        style={{ width: w, height: h }}
      >
        <Image
          src="/avs-logo.png"
          alt="Amazing Viral Studios Logo"
          width={w}
          height={h}
          className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(214,173,85,0.4)]"
          priority
        />
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-wider text-ivory">
          AMAZING VIRAL STUDIOS
        </span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-gold/60">
          DIGITAL SOLUTIONS
        </span>
      </span>
    </span>
  );
}
