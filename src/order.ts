// The data and the request every format is asked to turn into a screen.
export const ORDER = {
  currency: "JPY",
  items: [
    { name: "Espresso beans 500g", quantity: 2, unitPrice: 1800 },
    { name: "Paper filters (100)", quantity: 1, unitPrice: 650 },
    { name: "Ceramic dripper", quantity: 1, unitPrice: 3200 },
  ],
  total: 7450,
  deliveryAddress: "1-2-3 Midori, Chuo-ku, Tokyo",
  deliveryDate: "2026-12-05",
  paymentMethods: ["Credit card", "Bank transfer", "Cash on delivery"],
  monthlyTotals: [
    { month: "Jun", total: 4200 },
    { month: "Jul", total: 6100 },
    { month: "Aug", total: 3900 },
    { month: "Sep", total: 8200 },
    { month: "Oct", total: 5600 },
    { month: "Nov", total: 7450 },
  ],
};

export const CHART_TITLE = "Monthly order totals";
export const CONFIRM_LABEL = "Confirm order";

export const USER_REQUEST = `A customer is about to place an order. Build the screen where they confirm it.

The screen must show:
- a title line at the top
- every order line with its name, quantity and unit price, and the order total
- a text field for the delivery address, filled in with the given address
- a date field for the delivery date, filled in with the given date
- a choice of payment method among the given methods
- a button labelled "${CONFIRM_LABEL}"
- a bar chart of the customer's monthly order totals, titled "${CHART_TITLE}"

Use only the components you were given.

Order data:
${JSON.stringify(ORDER, null, 2)}`;
