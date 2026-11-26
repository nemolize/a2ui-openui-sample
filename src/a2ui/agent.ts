import { A2uiGenerator, CatalogConfig, DirectJsonFormatFactory, ExpressFormatFactory } from "@a2ui/agent";
import { CATALOG_ID, agentCatalog, pruner } from "./catalog";

export type A2uiFormat = "express" | "json";

// `pruned: false` keeps all 18 Basic Catalog components (+ BarChart) in the prompt.
export function createRequestProcessor(format: A2uiFormat, pruned = true) {
  const config = new CatalogConfig(agentCatalog as any, pruned ? [pruner] : undefined);
  const factory = format === "express" ? new ExpressFormatFactory() : new DirectJsonFormatFactory();
  const generator = new A2uiGenerator([config], undefined, factory);
  return generator.createProcessor({ "1.0": { supportedCatalogIds: [CATALOG_ID] } } as any);
}

export function a2uiSystemPrompt(format: A2uiFormat, pruned = true): string {
  return `You are a UI assistant. Answer the user's request with a screen, not with prose.\n\n${createRequestProcessor(format, pruned).promptSnippet}`;
}
