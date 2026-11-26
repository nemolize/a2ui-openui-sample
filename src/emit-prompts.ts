// Writes the system prompt of every format and the shared user request as JSON, for a runner that calls a model.
import { a2uiSystemPrompt } from "./a2ui/agent";
import { openuiSystemPrompt } from "./openui/library";
import { USER_REQUEST } from "./order";

console.log(
  JSON.stringify({
    request: USER_REQUEST,
    prompts: {
      "a2ui-express": a2uiSystemPrompt("express"),
      "a2ui-json": a2uiSystemPrompt("json"),
      "openui-lang": openuiSystemPrompt(),
    },
    extra: { "a2ui-express-full-catalog": a2uiSystemPrompt("express", false) },
  }),
);
