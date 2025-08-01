import { Decimal } from "./generated/prisma/runtime/library";

export function formatRupiah(value: Decimal | number | string) {
  const amount =
    typeof value === "object" && "toNumber" in value
      ? value.toNumber()
      : Number(value);

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Remove the space after 'Rp'
  return formatted.replace(/\s/, "");
}
