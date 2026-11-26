# a2ui-openui-sample

One screen, built two ways: an order confirmation form with a bar chart, drawn from model output written in A2UI (`@a2ui/react`) and in OpenUI Lang (`@openuidev/react-lang`).

It is the sample behind a Zenn article comparing the two. The runner that asks a model for the screen and measures the result is not here; it lives in the article repository, under `benchmarks/a2ui-openui/`.

## What is in it

- `src/order.ts`: the order data and the request every format is asked to turn into a screen.
- `src/a2ui/`: the catalog (the Basic Catalog components the screen needs, plus a custom `BarChart`), the agent-side prompt and parser, and the React renderer's catalog.
- `src/openui/library.tsx`: an OpenUI Lang library with the same ten components.
- `src/replay.tsx`: feeds the chunks of a streamed answer into the renderer of one format, in the browser, and reports what showed up.
- `src/check.ts`: what the request asked for, read off the rendered screen.
- `fixtures/`: one hand-written answer per format.

## Run it

Needs the Node version in `.node-version`.

```sh
npm ci
npm run dev                       # then open /?arm=openui-lang or /?arm=a2ui-express
npm run prompts                   # size of each format's system prompt
npm run typecheck
```

The library versions are pinned in `package.json` and `package-lock.json`.

## License

MIT
