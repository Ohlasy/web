import Plausible from "plausible-tracker";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/Button";
import { type DeliveryType, useOrderSubmission } from "./actions";

type Props = {
  itemId: string;
  onCancel?: () => void;
};

export function OrderForm({ itemId, onCancel = () => {} }: Props) {
  const { state, submit, pending } = useOrderSubmission();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("osobně");
  const { trackEvent } = Plausible({ domain: "ohlasy.info" });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("Shop Order");
    submit(new FormData(event.currentTarget));
  };

  if (state.tag === "sent") {
    return (
      <div className="flex flex-col gap-7">
        <p>
          Objednávka úspěšně odeslána! Evidujeme ji pod číslem #{state.orderId}.
          Kdybyste měli nějaký dotaz nebo potřebovali s něčím pomoct, napište
          nám prosím na <ClickableMail />.
        </p>
        <div className="flex flex-row">
          <Button
            text="Zobrazit fakturu a zaplatit"
            href={state.invoiceUrl}
            stretch="mobile"
            target="_blank"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="hidden" name="orderedItemId" value={itemId} />

        <DeliveryTypeSelect onChange={setDeliveryType} pending={pending} />

        <TextInput
          id="itemCount"
          label="Počet kusů:"
          type="number"
          defaultValue="1"
          pending={pending}
          required
        />

        <TextInput
          id="deliveryName"
          label="Celé jméno:"
          pending={pending}
          required
        />

        {deliveryType !== "knihkupectví" && (
          <TextInput
            id="deliveryAddress"
            label="Dodací adresa:"
            placeholder="Rašínova 1234, 68001 Boskovice"
            pending={pending}
            required
          />
        )}

        <TextInput
          id="deliveryEmail"
          label="E-mail:"
          placeholder="váš@email.cz"
          type="email"
          pending={pending}
          required
        />

        <TextInput
          id="deliveryPhone"
          label="Telefonní číslo:"
          placeholder="777 123 456"
          type="tel"
          pending={pending}
          required
        />

        <section className="mt-3 mb-2 flex flex-col sm:flex-row gap-4">
          <SubmitButton pending={pending} />
          <CancelButton onClick={onCancel} pending={pending} />
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
  <a href="mailto:ohlasy@ohlasy.info" className="typo-link">
    ohlasy@ohlasy.info
  </a>
);

const CancelButton = ({
  onClick,
  pending,
}: {
  onClick: () => void;
  pending: boolean;
}) => (
  <Button
    type="reset"
    style="secondary"
    text="Zrušit objednávku"
    onClick={onClick}
    stretch="mobile"
    disabled={pending}
  />
);

const SubmitButton = ({ pending }: { pending: boolean }) => (
  <Button
    text={pending ? "Odesílám…" : "Odeslat objednávku"}
    disabled={pending}
    type="submit"
    stretch="mobile"
  />
);

type DeliveryTypeSelectProps = {
  onChange?: (value: DeliveryType) => void;
  pending: boolean;
};

const DeliveryTypeSelect = ({
  onChange = () => {},
  pending,
}: DeliveryTypeSelectProps) => {
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
          <label htmlFor="orderPersonal">Osobní donáška po Boskovicích</label>
        </div>
        <p className="text-sm ml-5">
          Knihu zaplatíte online, po zaplacení vám ji doneseme na adresu v
          Boskovicích.
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
            Vyzvednutí v Knihkupectví Tomáše Špidlíka
          </label>
        </div>
        <p className="text-sm ml-5">
          Knihu zaplatíte online, po zaplacení si ji můžete vyzvednout v{" "}
          <a
            href="https://mapy.cz/s/rezujelega"
            target="_blank"
            rel="noopener"
            className="typo-link"
          >
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
          <label htmlFor="orderPost">Poštou kamkoliv (příplatek 100 Kč)</label>
        </div>
        <p className="text-sm ml-5">
          Knihu zaplatíte online, po zaplacení vám ji pošleme klasicky poštou
          kamkoliv.
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
  pending: boolean;
};

const TextInput = ({
  id,
  label,
  placeholder,
  defaultValue,
  required,
  type = "text",
  pending,
}: TextInputProps) => {
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
        className="border border-gray rounded-sm px-2 py-2 w-full sm:w-[40ex]"
        required={required}
        disabled={pending}
      />
    </section>
  );
};
