import { a2uiSystemPrompt } from "./a2ui/agent";
import { openuiSystemPrompt } from "./openui/library";

const rows: [string, string][] = [
  ["a2ui-express (pruned)", a2uiSystemPrompt("express")],
  ["a2ui-json (pruned)", a2uiSystemPrompt("json")],
  ["a2ui-express (all 18 + BarChart)", a2uiSystemPrompt("express", false)],
  ["openui-lang", openuiSystemPrompt()],
];
for (const [name, prompt] of rows) console.log(`${name}: ${prompt.length} characters`);
