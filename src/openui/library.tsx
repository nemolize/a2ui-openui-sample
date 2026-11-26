import { Fragment, type ReactNode } from "react";
import { z } from "zod/v4";
import { createLibrary, defineComponent } from "@openuidev/react-lang";
import { BarChartView } from "../shared/BarChartView";

type Render = (node: unknown) => ReactNode;
const kids = (children: unknown[] | undefined, renderNode: Render) =>
  (children ?? []).map((c, i) => <Fragment key={i}>{renderNode(c)}</Fragment>);

// The same ten-component vocabulary as the pruned A2UI catalog.
const Column = defineComponent({
  name: "Column",
  description: "Stacks its children vertically.",
  props: z.object({ children: z.array(z.any()) }),
  component: ({ props, renderNode }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{kids(props.children, renderNode as Render)}</div>
  ),
});
const Row = defineComponent({
  name: "Row",
  description: "Places its children side by side.",
  props: z.object({ children: z.array(z.any()) }),
  component: ({ props, renderNode }) => (
    <div style={{ display: "flex", flexDirection: "row", gap: 16, alignItems: "center" }}>{kids(props.children, renderNode as Render)}</div>
  ),
});
const Card = defineComponent({
  name: "Card",
  description: "A bordered box around one child. Wrap several elements in a Column first.",
  props: z.object({ child: z.any() }),
  component: ({ props, renderNode }) => (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12 }}>{(renderNode as Render)(props.child)}</div>
  ),
});
const Text = defineComponent({
  name: "Text",
  description: "A line of text.",
  props: z.object({ text: z.string(), variant: z.enum(["body", "caption"]).optional() }),
  component: ({ props }) => <span style={props.variant === "caption" ? { fontSize: 12 } : undefined}>{props.text}</span>,
});
const TextField = defineComponent({
  name: "TextField",
  description: "A single-line text input with a label and an initial value.",
  props: z.object({ label: z.string(), value: z.string().optional() }),
  component: ({ props }) => (
    <label>
      {props.label} <input key={props.value} type="text" defaultValue={props.value ?? ""} />
    </label>
  ),
});
const DateTimeInput = defineComponent({
  name: "DateTimeInput",
  description: "A date input with a label and an initial value written as YYYY-MM-DD.",
  props: z.object({ label: z.string(), value: z.string().optional() }),
  component: ({ props }) => (
    <label>
      {props.label} <input key={props.value} type="date" defaultValue={props.value ?? ""} />
    </label>
  ),
});
const ChoicePicker = defineComponent({
  name: "ChoicePicker",
  description: "Choose one option from a list of strings.",
  props: z.object({ label: z.string(), options: z.array(z.string()), value: z.string().optional() }),
  component: ({ props }) => (
    <fieldset>
      <legend>{props.label}</legend>
      {props.options.map((o) => (
        <label key={o} style={{ marginRight: 12 }}>
          <input type="radio" name={props.label} defaultChecked={o === props.value} /> {o}
        </label>
      ))}
    </fieldset>
  ),
});
const Button = defineComponent({
  name: "Button",
  description: "A button with a text label.",
  props: z.object({ label: z.string(), variant: z.enum(["default", "primary"]).optional() }),
  component: ({ props }) => <button type="button">{props.label}</button>,
});
const Divider = defineComponent({
  name: "Divider",
  description: "A horizontal rule.",
  props: z.object({}),
  component: () => <hr />,
});
const BarChart = defineComponent({
  name: "BarChart",
  description: "A vertical bar chart with one bar per label.",
  props: z.object({ title: z.string(), labels: z.array(z.string()), values: z.array(z.number()) }),
  component: ({ props }) => <BarChartView title={props.title} labels={props.labels} values={props.values} />,
});

export const library = createLibrary({
  components: [Column, Row, Card, Text, TextField, DateTimeInput, ChoicePicker, Button, Divider, BarChart],
  root: "Column",
});

export function openuiSystemPrompt(): string {
  return library.prompt({ preamble: "You are a UI assistant. Answer the user's request with a screen, not with prose." });
}
