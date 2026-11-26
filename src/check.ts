import { CHART_TITLE, CONFIRM_LABEL, ORDER } from "./order";
import type { Inspection } from "./inspect";

// Everything the request asked for, read off the rendered screen. Returns what is missing.
export function missing(i: Inspection): string[] {
  const text = i.text.replace(/,/g, "");
  const out: string[] = [];
  for (const it of ORDER.items) if (!i.text.includes(it.name)) out.push(`item: ${it.name}`);
  if (!text.includes(String(ORDER.total))) out.push("total");
  if (!i.inputValues.some((v) => v.includes("Midori"))) out.push("address prefilled");
  if (!i.inputValues.some((v) => v.includes(ORDER.deliveryDate))) out.push("date prefilled");
  for (const m of ORDER.paymentMethods) if (!i.text.includes(m)) out.push(`payment: ${m}`);
  if (!i.buttons.some((b) => b.toLowerCase().includes(CONFIRM_LABEL.toLowerCase()))) out.push("confirm button");
  if (i.bars !== ORDER.monthlyTotals.length) out.push(`chart bars: ${i.bars}`);
  if (!i.text.includes(CHART_TITLE)) out.push("chart title");
  return out;
}
