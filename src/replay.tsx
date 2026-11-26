import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { MessageProcessor } from "@a2ui/web_core";
import { A2uiSurface } from "@a2ui/react";
import { injectBasicCatalogStyles, setMarkdownRenderer } from "@a2ui/web_core/catalogs/basic/v1";
import { renderMarkdown } from "@a2ui/markdown-it";
import { Renderer } from "@openuidev/react-lang";
import { createRequestProcessor, type A2uiFormat } from "./a2ui/agent";
import { rendererCatalog } from "./a2ui/catalog";
import { library } from "./openui/library";
import { inspect, type Inspection } from "./inspect";
import { missing } from "./check";

setMarkdownRenderer(renderMarkdown);

export type Arm = "a2ui-express" | "a2ui-json" | "openui-lang";
export type ReplayError = { at: number | "close"; name: string; message: string };
export type ReplayResult = {
  // after each chunk: did the screen show anything yet (text or a chart bar)
  shown: boolean[];
  errors: ReplayError[];
  final: Inspection;
  missing: string[];
};

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
const shows = (i: Inspection) => i.text.length > 0 || i.bars > 0;

function A2uiView({ renderer }: { renderer: MessageProcessor }) {
  const [surfaces, setSurfaces] = useState(() => Array.from(renderer.model.surfacesMap.values()));
  useEffect(() => {
    const sync = () => setSurfaces(Array.from(renderer.model.surfacesMap.values()));
    const a = renderer.onSurfaceCreated(sync);
    const b = renderer.onSurfaceDeleted(sync);
    return () => {
      a.unsubscribe();
      b.unsubscribe();
    };
  }, [renderer]);
  return (
    <>
      {surfaces.map((s) => (
        <A2uiSurface key={s.id} surface={s as any} />
      ))}
    </>
  );
}

export async function replay(arm: Arm, chunks: string[], host: HTMLElement, keep = false): Promise<ReplayResult> {
  injectBasicCatalogStyles();
  host.replaceChildren();
  const root = createRoot(host);
  const shown: boolean[] = [];
  const errors: ReplayError[] = [];

  if (arm === "openui-lang") {
    let acc = "";
    let parseErrors: string[] = [];
    for (let k = 0; k < chunks.length; k++) {
      acc += chunks[k];
      try {
        flushSync(() =>
          root.render(
            <Renderer
              response={acc}
              library={library}
              isStreaming={k < chunks.length - 1}
              onParseResult={(r) => {
                parseErrors = (r?.meta.errors ?? []).map((e: any) => `${e.code}: ${e.message ?? e.component ?? ""}`);
              }}
            />,
          ),
        );
      } catch (e: any) {
        errors.push({ at: k, name: e?.name ?? "Error", message: String(e?.message ?? e) });
      }
      await frame();
      shown.push(shows(inspect(host)));
    }
    for (const m of parseErrors) errors.push({ at: "close", name: "openui-parse", message: m });
  } else {
    const format: A2uiFormat = arm === "a2ui-express" ? "express" : "json";
    const renderer = new MessageProcessor([rendererCatalog as any]);
    flushSync(() => root.render(<A2uiView renderer={renderer} />));
    const stream = createRequestProcessor(format).openStream({ afterRejectedBlock: "continue" });
    const apply = (parts: any[], at: number | "close") => {
      for (const p of parts) {
        if (p.type === "a2ui") {
          try {
            renderer.processMessages(p.a2ui);
          } catch (e: any) {
            errors.push({ at, name: e?.name ?? "Error", message: String(e?.message ?? e) });
          }
        } else if (p.type === "error") {
          errors.push({ at, name: p.error?.name ?? "ErrorPart", message: String(p.error?.message ?? p.error) });
        }
      }
    };
    let ended = false;
    for (let k = 0; k < chunks.length; k++) {
      if (!ended) {
        try {
          apply(stream.feed(chunks[k]), k);
        } catch (e: any) {
          errors.push({ at: k, name: e?.name ?? "Error", message: String(e?.message ?? e) });
          ended = true;
        }
      }
      await frame();
      shown.push(shows(inspect(host)));
    }
    if (!ended) {
      try {
        apply(stream.close(), "close");
      } catch (e: any) {
        errors.push({ at: "close", name: e?.name ?? "Error", message: String(e?.message ?? e) });
      }
    }
    await frame();
  }
  const final = inspect(host);
  if (!keep) root.unmount();
  return { shown, errors, final, missing: missing(final) };
}
