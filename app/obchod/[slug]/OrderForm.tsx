type Props = {
  itemId: string;
  action: (formData: FormData) => Promise<void>;
};

export const OrderForm = ({ itemId, action }: Props) => (
  <div>
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="orderedItemId" value={itemId} />

      <DeliveryTypeSelect />

      <TextInput id="deliveryName" label="Celé jméno:" required />

      <TextInput
        id="deliveryAddress"
        label="Dodací adresa:"
        placeholder="Rašínova 1234, 68001 Boskovice"
        required
      />

      <TextInput
        id="deliveryEmail"
        label="E-mail:"
        placeholder="váš@email.cz"
        type="email"
        required
      />

      <section className="mt-3">
        <input
          type="submit"
          className="btn-primary"
          value="Odeslat objednávku"
        />
      </section>
    </form>
  </div>
);

const DeliveryTypeSelect = () => (
  <section className="flex flex-col">
    <legend className="mb-1">Způsob doručení:</legend>
    <div className="flex flex-row gap-2 items-center">
      <input
        type="radio"
        name="deliveryType"
        value="osobně"
        id="orderPersonal"
        defaultChecked
      />
      <label htmlFor="orderPersonal">osobně po Boskovicích (zdarma)</label>
    </div>
    <div className="flex flex-row gap-2 items-center">
      <input type="radio" name="deliveryType" value="poštou" id="orderPost" />
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
};

const TextInput = ({
  id,
  label,
  placeholder,
  required,
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
    />
  </section>
);
