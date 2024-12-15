import { useFormState, useFormStatus } from "react-dom";
import { placeOrder } from "./actions";
import Plausible from "plausible-tracker";
import Link from "next/link";
import { useState } from "react";

type Props = {
  itemId: string;
  onCancel?: () => void;
};

type DeliveryType = "osobně" | "poštou" | "knihkupectví";

export function OrderForm({ itemId, onCancel = () => {} }: Props) {
  const [state, formAction] = useFormState(placeOrder, { tag: "idle" });
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("osobně");
  const { trackEvent } = Plausible({ domain: "ohlasy.info" });

  if (state.tag === "sent") {
    return (
      <div className="flex flex-col gap-7">
        <p>
          Objednávka úspěšně odeslána! Evidujeme ji pod číslem #{state.orderId}.
          Kdybyste měli nějaký dotaz nebo potřebovali s něčím pomoct, napište
          nám prosím na <ClickableMail />.
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
      <form
        action={formAction}
        onSubmit={() => trackEvent("Shop Order")}
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="orderedItemId" value={itemId} />

        <DeliveryTypeSelect onChange={setDeliveryType} />

        <TextInput
          id="itemCount"
          label="Počet kusů:"
          type="number"
          defaultValue="1"
          required
        />

        <TextInput id="deliveryName" label="Celé jméno:" required />

        {deliveryType !== "knihkupectví" && (
          <TextInput
            id="deliveryAddress"
            label="Dodací adresa:"
            placeholder="Rašínova 1234, 68001 Boskovice"
            required
          />
        )}

        <TextInput
          id="deliveryEmail"
          label="E-mail:"
          placeholder="váš@email.cz"
          type="email"
          required
        />

        <TextInput
          id="deliveryPhone"
          label="Telefonní číslo:"
          placeholder="777 123 456"
          type="tel"
          required
        />

        <section className="mt-3 mb-2 flex flex-col sm:flex-row gap-4">
          <SubmitButton />
          <CancelButton onClick={onCancel} />
        </section>

        {state.tag === "error" && (
          <p>
            Při zpracování objednávky došlo k chybě. ({state.message}) Zkuste
            prosím objednávku odeslat ještě jednou a kdyby to stále nefungovalo,
            dejte nám vědět na <ClickableMail />. Pardon za nepříjemnosti!
          </p>
        )}
      </form>
    </div>
  );
}

const ClickableMail = () => (
  <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>
);

const CancelButton = ({ onClick }: { onClick: () => void }) => {
  const { pending } = useFormStatus();
  return (
    <input
      type="button"
      onClick={onClick}
      className="btn-inverted max-sm:w-full"
      value="Zrušit objednávku"
      disabled={pending}
    />
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <input
      type="submit"
      className="btn-primary max-sm:w-full"
      value={pending ? "Odesílám…" : "Odeslat objednávku"}
      disabled={pending}
    />
  );
};

type DeliveryTypeSelectProps = {
  onChange?: (value: DeliveryType) => void;
};

const DeliveryTypeSelect = ({
  onChange = () => {},
}: DeliveryTypeSelectProps) => {
  const { pending } = useFormStatus();
  return (
    <section className="flex flex-col gap-2 mb-2">
      <legend className="mb-1">Způsob doručení:</legend>
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <input
            type="radio"
            name="deliveryType"
            value="osobně"
            onClick={() => onChange("osobně")}
            id="orderPersonal"
            disabled={pending}
            defaultChecked
          />
          <label htmlFor="orderPersonal">osobní donáška po Boskovicích</label>
        </div>
        <p className="text-sm ml-5">
          Knihu vám osobně doneseme na adresu v Boskovicích.
        </p>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <input
            type="radio"
            name="deliveryType"
            onClick={() => onChange("knihkupectví")}
            value="knihkupectví"
            id="orderBookstore"
            disabled={pending}
          />
          <label htmlFor="orderBookstore">
            vyzvednutí v Knihkupectví Tomáše Špidlíka
          </label>
        </div>
        <p className="text-sm ml-5">
          Knihu zaplatíte online, po zaplacení si ji můžete vyzvednout v{" "}
          <a href="https://mapy.cz/s/rezujelega" target="_blank">
            Knihkupectví Tomáše Špidlíka
          </a>
          .
        </p>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <input
            type="radio"
            name="deliveryType"
            onClick={() => onChange("poštou")}
            value="poštou"
            id="orderPost"
            disabled={pending}
          />
          <label htmlFor="orderPost">poštou kamkoliv (příplatek 100 Kč)</label>
        </div>
        <p className="text-sm ml-5">
          Knihu vám pošleme klasicky poštou kamkoliv.
        </p>
      </div>
    </section>
  );
};

type TextInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type?: "text" | "email" | "tel" | "number";
  required?: boolean;
};

const TextInput = ({
  id,
  label,
  placeholder,
  defaultValue,
  required,
  type = "text",
}: TextInputProps) => {
  const { pending } = useFormStatus();
  return (
    <section>
      <label className="block mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="border-[1px] border-gray rounded px-2 py-2 w-full sm:w-[40ex]"
        required={required}
        disabled={pending}
      />
    </section>
  );
};
