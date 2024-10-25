export const OrderForm = () => (
  <div>
    <form className="flex flex-col gap-4">
      <DeliveryTypeSelect />

      <TextInput id="form-name" label="Celé jméno:" required />

      <TextInput
        id="form-address"
        label="Dodací adresa:"
        placeholder="Rašínova 1234, 68001 Boskovice"
        required
      />

      <TextInput
        id="form-email"
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
        value="personal"
        id="form-personal"
        defaultChecked
      />
      <label htmlFor="form-personal">osobně po Boskovicích (zdarma)</label>
    </div>
    <div className="flex flex-row gap-2 items-center">
      <input type="radio" name="deliveryType" value="post" id="form-post" />
      <label htmlFor="form-post">poštou kamkoliv (za příplatek)</label>
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
      placeholder={placeholder}
      className="border-[1px] border-gray rounded px-2 py-2"
      size={40}
      required={required}
    />
  </section>
);
