import { replay, type Arm } from "./replay";

const fixtures = import.meta.glob("../fixtures/*.txt", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const host = document.getElementById("root")!;

// `window.__replay` is what the benchmark runner calls with the chunks a model streamed.
(window as any).__replay = (arm: Arm, chunks: string[]) => replay(arm, chunks, host);

// `?arm=a2ui-express|a2ui-json|openui-lang` shows the hand-written fixture of that format.
const arm = new URLSearchParams(location.search).get("arm") as Arm | null;
const text = arm ? fixtures[`../fixtures/${arm}.txt`] : undefined;
if (arm && text) void replay(arm, [text], host, true);
