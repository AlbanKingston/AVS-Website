export function whatsappLink(number: string, text: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function formatPrice(p: number | null) {
  return p === null ? "Custom quotation" : `₹${Number(p).toLocaleString("en-IN")}`;
}
