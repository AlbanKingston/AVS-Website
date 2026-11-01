import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  sub,
  center = true,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={`mb-12 ${center ? "text-center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <div
        className={`mb-4 h-px w-12 bg-gold-gradient ${
          center ? "mx-auto" : ""
        }`}
      />
      <h2 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 max-w-2xl text-muted ${center ? "mx-auto" : ""}`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
