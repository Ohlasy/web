import { useFormState } from "react-dom";
import { placeOrder } from "./actions";
import Link from "next/link";

type Props = {
  itemId: string;
};

// TBD: Fix pending state
export function OrderForm({ itemId }: Props) {
  const [state, formAction, isPending] = useFormState(placeOrder, {
    tag: "idle",
  });

  if (state.tag === "sent") {
    return (
      <div className="flex flex-col gap-7">
        <p>
          Objednávka úspěšně odeslána! Evidujeme ji pod číslem {state.orderId}.
        </p>
        <div>
          <Link
            href={state.invoiceUrl}
            target="_blank"
            className="btn-primary py-3"
          >
            Zobrazit fakturu a zaplatit
          </Link>
        </div>
      </div>
    );
  }

  console.assert(state.tag === "idle" || state.tag === "error");

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="orderedItemId" value={itemId} />

        <DeliveryTypeSelect disabled={isPending} />

        <TextInput
          id="deliveryName"
          label="Celé jméno:"
          disabled={isPending}
          required
        />

        <TextInput
          id="deliveryAddress"
          label="Dodací adresa:"
          placeholder="Rašínova 1234, 68001 Boskovice"
          disabled={isPending}
          required
        />

        <TextInput
          id="deliveryEmail"
          label="E-mail:"
          placeholder="váš@email.cz"
          type="email"
          disabled={isPending}
          required
        />

        <section className="mt-3 mb-2">
          <input
            type="submit"
            className="btn-primary"
            value={isPending ? "Odesílám…" : "Odeslat objednávku"}
            disabled={isPending}
          />
        </section>

        {state.tag === "error" && (
          <p>
            Při zpracování objednávky došlo k chybě. ({state.message}) Zkuste
            prosím objednávku odeslat ještě jednou a kdyby to stále nefungovalo,
            dejte nám vědět na{" "}
            <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>. Pardon
            za nepříjemnosti!
          </p>
        )}
      </form>
    </div>
  );
}

const DeliveryTypeSelect = ({ disabled }: { disabled?: boolean }) => (
  <section className="flex flex-col">
    <legend className="mb-1">Způsob doručení:</legend>
    <div className="flex flex-row gap-2 items-center">
      <input
        type="radio"
        name="deliveryType"
        value="osobně"
        id="orderPersonal"
        disabled={disabled}
        defaultChecked
      />
      <label htmlFor="orderPersonal">osobně po Boskovicích (zdarma)</label>
    </div>
    <div className="flex flex-row gap-2 items-center">
      <input
        type="radio"
        name="deliveryType"
        value="poštou"
        id="orderPost"
        disabled={disabled}
      />
      <label htmlFor="orderPost">poštou kamkoliv (za příplatek)</label>
    </div>
  </section>
);

type TextInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email";
  required?: boolean;
  disabled?: boolean;
};

const TextInput = ({
  id,
  label,
  placeholder,
  required,
  disabled,
  type = "text",
}: TextInputProps) => (
  <section>
    <label className="block mb-1" htmlFor={id}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      className="border-[1px] border-gray rounded px-2 py-2"
      size={40}
      required={required}
      disabled={disabled}
    />
  </section>
);
