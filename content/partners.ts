/** Confirmed by Ilyas. Asset sources and unresolved identities: refs/LOGOS.md. */
export type Venue = {
  name: string;
  group: "business" | "education";
  logo?: string;
  mark?: boolean;
  dark?: boolean;
  crop?: boolean;
};

export const venues: Venue[] = [
  { name: "BCC HUB", group: "business", logo: "bcc-hub.svg" },
  { name: "Nur Otan", group: "business", logo: "nur-otan.jpg" },
  { name: "QazInnovations", group: "business", logo: "qazinnovations.svg" },
  { name: "MARS", group: "business", logo: "mars.svg" },
  { name: "1FIT", group: "business", logo: "1fit.svg" },
  { name: "QADAM", group: "business" },
  {
    name: "Nazarbayev University",
    group: "education",
    logo: "nazarbayev-university.svg",
  },
  { name: "AlmaU", group: "education", logo: "almau.svg" },
  { name: "Astana Hub", group: "business", logo: "astana-hub.svg" },
  { name: "НПП «Атамекен»", group: "business", logo: "atameken.svg" },
  {
    name: "MOST IT Hub",
    group: "business",
    logo: "most-it-hub.png",
    mark: true,
  },
  { name: "iKOMEK 109", group: "business", logo: "ikomek.svg" },
  { name: "Арт-студия MiA", group: "business" },
  { name: "Телевидение «Акцент»", group: "business", logo: "akcent.png" },
  { name: "ERG", group: "business", logo: "erg.svg" },
  {
    name: "Documentolog",
    group: "business",
    logo: "documentolog.svg",
    mark: true,
  },
  { name: "Enactus", group: "business", logo: "enactus.png" },
  {
    name: "DigitalBusiness.kz",
    group: "business",
    logo: "digitalbusiness.svg",
  },
  {
    name: "Байтурсынов университет",
    group: "education",
    logo: "baitursynov.png",
    mark: true,
  },
  {
    name: "Торайгыров университет",
    group: "education",
    logo: "toraighyrov.png",
  },
  { name: "КарТУ им. Сагинова", group: "education", logo: "saginov.png" },
  { name: "КИнЭУ", group: "education", logo: "kineu.jpg" },
  { name: "ИнЭУ", group: "education", logo: "ineu.png", mark: true },
  { name: "РИУ", group: "education", logo: "riu.png", mark: true },
  { name: "КМУ", group: "education", logo: "qmu.png", mark: true },
  {
    name: "АРУ им. Жубанова",
    group: "education",
    logo: "zhubanov.svg",
    mark: true,
    dark: true,
  },
  { name: "ISFT", group: "education", logo: "isft.png", crop: true },
  { name: "ХГТВК", group: "education", logo: "hgtk.jpg", mark: true },
  { name: "АВПК", group: "education", logo: "avpk.png", mark: true },
];

export const partnerCopy = {
  title: "Работал с",
  lead: "Бизнес. Образование. Сообщества.",
  all: "Все организации",
  collapse: "Свернуть список",
  pause: "Остановить движение",
  play: "Продолжить движение",
};
