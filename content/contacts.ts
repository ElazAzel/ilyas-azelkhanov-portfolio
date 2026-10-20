// SPEC.md §7 /contact — подтверждено Ильясом.
export const contacts = {
  whatsapp: { display: "+7 705 109 76 64", number: "77051097664" },
  telegram: { display: "@elazart", username: "elazart" },
  sla: "Отвечаю в течение 2 часов в будни с 10 до 19 (Алматы)",
} as const;

export function whatsappLink(text: string): string {
  return `https://wa.me/${contacts.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export function telegramLink(): string {
  return `https://t.me/${contacts.telegram.username}`;
}
