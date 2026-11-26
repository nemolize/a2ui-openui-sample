// Reads what a screen shows, looking inside shadow roots (the A2UI Basic Catalog is built from Web Components).
export type Inspection = { text: string; inputValues: string[]; inputs: number; buttons: string[]; bars: number };

export function inspect(root: Node): Inspection {
  const out: Inspection = { text: "", inputValues: [], inputs: 0, buttons: [], bars: 0 };
  const parts: string[] = [];
  const walk = (node: Node, into: string[]) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = (node.textContent ?? "").trim();
      if (t) into.push(t);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName?.toLowerCase();
    if (tag === "style" || tag === "script") return;
    if (tag === "input" || tag === "textarea" || tag === "select") {
      const type = (el as HTMLInputElement).type;
      if (type !== "radio" && type !== "checkbox") out.inputs += 1;
      const v = (el as HTMLInputElement).value;
      if (v) out.inputValues.push(v);
    }
    if (tag === "rect" && el.hasAttribute("data-bar")) out.bars += 1;
    const sub: string[] = [];
    if ((el as Element).shadowRoot) walk((el as Element).shadowRoot as ShadowRoot, sub);
    el.childNodes.forEach((c) => walk(c, sub));
    if (tag === "button") out.buttons.push(sub.join(" "));
    into.push(...sub);
  };
  walk(root, parts);
  out.text = parts.join(" ");
  return out;
}
