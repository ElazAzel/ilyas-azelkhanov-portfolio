// Реквизиты исполнителя — от Ильяса, 20.10.2026. Публикуются в оферте и подвале (так требует оферта).
export const company = {
  name: "ИП BEEGIN",
  address: "г. Алматы, ул. Шолохова, д. 20/7",
  iin: "971207300019",
  bank: "АО «Kaspi Bank»",
  kbe: "19",
  bik: "CASPKZKA",
  account: "KZ58722S000020135125",
} as const;

export const prepayment = "минимум 50%";

// Условия отмены — предложены Claude по практике рынка, Ильяс поручил решить «по опыту» (20.10.2026).
// Невозвратная часть покрывает уже потраченное: забронированное время и подготовку.
export const nonRefundable = "30%";
export const freeRescheduleHours = 24;
export const refundDays = 10;
