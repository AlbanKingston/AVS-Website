import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Instagram, Facebook } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import EnquiryForm from "@/components/EnquiryForm";
import { getServices, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/util";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Send an enquiry to Amazing Viral Studios or reach us on WhatsApp.",
};

export default async function Contact({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const [services, s] = await Promise.all([getServices(), getSettings()]);
  const names = services.map((x) => x.title);
  const pre = searchParams.service || "";
  const options = pre && !names.includes(pre) ? [pre, ...names] : names;
  const wa = whatsappLink(
    s.whatsapp_number,
    pre
      ? `Hi AVS! I'd like to enquire about ${pre}.`
      : "Hi AVS! I'd like to enquire about your services."
  );
  const mapQ = s.map_query || s.address;

  const rows = [
    s.business_email && {
      icon: Mail,
      label: s.business_email,
      href: `mailto:${s.business_email}`,
    },
    s.phone && { icon: Phone, label: s.phone, href: `tel:${s.phone}` },
    s.instagram_url && {
      icon: Instagram,
      label: "Instagram",
      href: s.instagram_url,
      ext: true,
    },
    s.facebook_url && {
      icon: Facebook,
      label: "Facebook",
      href: s.facebook_url,
      ext: true,
    },
    s.address && { icon: MapPin, label: s.address },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    href?: string;
    ext?: boolean;
  }[];

  return (
    <div className="section">
      <div className="container-avs">
        <SectionHeading
          eyebrow="Contact Us"
          title="Let's make something unforgettable"
          sub="Share your idea and we'll get back with a free quote."
        />
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <EnquiryForm services={options} initialService={pre} />
          </div>
          <aside className="space-y-5 lg:col-span-2">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full bg-[#25D366] py-4 text-obsidian hover:opacity-90"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            )}
            <div className="card space-y-4 p-6">
              <h3 className="font-display text-lg font-bold">Get in touch</h3>
              {rows.length === 0 && (
                <p className="text-sm text-muted">
                  Contact details will appear here once added in the admin
                  dashboard.
                </p>
              )}
              {rows.map(({ icon: Icon, label, href, ext }) => {
                const inner = (
                  <>
                    <Icon size={18} className="mt-0.5 shrink-0 text-gold" />
                    <span>{label}</span>
                  </>
                );
                return href ? (
                  <a
                    key={label}
                    href={href}
                    {...(ext
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex gap-3 text-sm text-ivory/75 transition-colors duration-300 hover:text-gold"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={label}
                    className="flex gap-3 text-sm text-ivory/75"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
            {mapQ && (
              <iframe
                title="AVS location"
                loading="lazy"
                className="h-64 w-full rounded-3xl border border-border"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQ)}&output=embed`}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
