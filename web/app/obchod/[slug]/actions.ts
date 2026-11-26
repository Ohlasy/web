import { useState } from "react";

export type DeliveryType = "osobně" | "poštou" | "knihkupectví";

export type OrderState =
  | { tag: "idle" }
  | { tag: "sending" }
  | { tag: "error"; message: string }
  | { tag: "sent"; orderId: number; invoiceUrl: string };

const ordersEndpoint = "https://api.ohlasy.info/store/orders";

const buildPayload = (formData: FormData): Record<string, unknown> => {
  const get = (key: string) => (formData.get(key) as string | null) ?? "";
  const deliveryType = get("deliveryType") as DeliveryType;
  const payload: Record<string, unknown> = {
    orderedItemId: get("orderedItemId"),
    itemCount: parseInt(get("itemCount"), 10),
    deliveryType,
    deliveryName: get("deliveryName"),
    deliveryEmail: get("deliveryEmail"),
    deliveryPhone: get("deliveryPhone"),
  };
  if (deliveryType !== "knihkupectví") {
    payload.deliveryAddress = get("deliveryAddress");
  }
  return payload;
};

export function useOrderSubmission() {
  const [state, setState] = useState<OrderState>({ tag: "idle" });

  const submit = async (formData: FormData) => {
    setState({ tag: "sending" });
    try {
      const response = await fetch(ordersEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(formData)),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as {
        createdOrderId: number;
        publicInvoiceUrl: string;
      };
      setState({
        tag: "sent",
        orderId: data.createdOrderId,
        invoiceUrl: data.publicInvoiceUrl,
      });
    } catch (e) {
      console.error(e);
      setState({ tag: "error", message: `${e}` });
    }
  };

  return { state, submit, pending: state.tag === "sending" };
}
