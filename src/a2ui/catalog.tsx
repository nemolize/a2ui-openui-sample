import { z } from "zod";
import { Catalog } from "@a2ui/web_core";
import { basicCatalog } from "@a2ui/web_core/catalogs/basic/v1";
import { CommonSchemas } from "@a2ui/web_core/v1_0";
import { createComponentImplementation } from "@a2ui/react";
import { ComponentPruningTransformer } from "@a2ui/agent";
import { BarChartView } from "../shared/BarChartView";

export const CATALOG_ID = "https://example.com/catalogs/order-screen/v1/catalog.json";

// The components the screen needs. The Basic Catalog has 18; it has no chart, so BarChart is custom.
export const ALLOWED = ["Column", "Row", "Card", "Text", "TextField", "DateTimeInput", "ChoicePicker", "Button", "Divider", "BarChart"];

// Agent side: the catalog as a JSON document. A custom component defined in code only
// (a Zod schema) reached the prompt as `BarChart()` with no properties, so it is written here as JSON.
const doc: any = structuredClone(basicCatalog.toJson());
doc.catalogId = CATALOG_ID;
doc.$id = CATALOG_ID;
doc.title = "Order screen catalog";
doc.components.BarChart = {
  type: "object",
  description: "A vertical bar chart with one bar per label.",
  properties: {
    component: { const: "BarChart" },
    title: { $ref: "common_types.json#/$defs/DynamicString", description: "Chart title." },
    labels: { type: "array", items: { type: "string" }, description: "One label per bar." },
    values: { type: "array", items: { type: "number" }, description: "One value per bar, in the order of labels." },
  },
  required: ["component", "title", "labels", "values"],
};
doc.$defs.anyComponent.oneOf.push({ $ref: "#/components/BarChart" });

export const agentCatalog = Catalog.fromJson(doc, "1.0", CATALOG_ID);
export const pruner = new ComponentPruningTransformer(ALLOWED);

// Renderer side: the same id, the Basic Catalog's React-rendered components plus BarChart.
const BarChart = createComponentImplementation(
  {
    name: "BarChart",
    schema: z.object({
      title: CommonSchemas.DynamicString,
      labels: z.array(z.string()),
      values: z.array(z.number()),
    }),
  },
  ({ props }) => <BarChartView title={props.title} labels={props.labels} values={props.values} />,
);

export const rendererCatalog = basicCatalog.derive({
  catalogId: CATALOG_ID,
  components: [...ALLOWED.filter((n) => n !== "BarChart"), BarChart],
});
