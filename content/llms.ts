// Machine-readable version of the site (llms.txt + per-service markdown) - the "Человек / Машина" switch on /services/websites.
import { formatPrice, packagesFor } from "./pricing";
import { services, type Service } from "./services";
import { contacts } from "./contacts";

const plain = (s: string) => s.replace(/ /g, " ");

export function serviceMarkdown(s: Service): string {
  const lines = [
    `# ${s.title}`,
    "",
    `> ${s.offer}`,
    "",
    "## Цены",
    ...packagesFor(s.id).map((p) => `- ${p.title}: ${plain(formatPrice(p))}${p.term ? `, ${p.term}` : ""}`),
    "",
    "## Что входит",
    ...s.includes.map((i) => `- ${i}`),
    "",
    "## Не входит",
    ...s.excludes.map((i) => `- ${i}`),
  ];
  if (s.faq.length) {
    lines.push("", "## Вопросы", ...s.faq.flatMap((f) => [`### ${f.q}`, f.a]));
  }
  lines.push("", `Связь: WhatsApp ${contacts.whatsapp.display}, Telegram ${contacts.telegram.display}.`);
  return lines.join("\n");
}

export function llmsTxt(origin = ""): string {
  return [
    "# Azelkhanov",
    "",
    "> Ильяс Азелханов, Алматы. Делаю сайты, Telegram-ботов, Mini Apps и AI-автоматизацию - и учу команды с этим работать.",
    "",
    "## Услуги",
    ...services.map((s) => `- [${s.title}](${origin}${s.href}): ${s.line}. ${plain(formatPrice(packagesFor(s.id)[0]!))}`),
    "",
    "## Связь",
    `- WhatsApp: ${contacts.whatsapp.display}`,
    `- Telegram: ${contacts.telegram.display}`,
    "",
    "## Подробно",
    "",
    ...services.flatMap((s) => [serviceMarkdown(s), ""]),
  ].join("\n");
}
