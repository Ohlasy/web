import clsx from "clsx";
import Link from "next/link";

type CommonProps = {
  text: string;
  style?: "primary" | "secondary";
  size?: "regular" | "small";
  disabled?: boolean;
  stretch?: "always" | "never" | "mobile";
};

type ActionProps =
  | {
      onClick?: (event: React.SyntheticEvent) => void;
      type?: "button" | "submit" | "reset";
    }
  | { href: string; target?: "_blank" };

type Props = CommonProps & ActionProps;

export const Button = (props: Props) => {
  const {
    text,
    style = "primary",
    size = "regular",
    disabled = false,
    stretch = "never",
  } = props;

  const styles = clsx(
    // Base shape
    "block px-5 py-2 rounded-sm shadow-md",
    // Cursor
    "cursor-pointer disabled:cursor-not-allowed",
    // Colors
    style === "primary"
      ? "bg-brown text-white"
      : "bg-white text-brown border-2 border-brown",
    // Text
    "text-center",
    size === "small" && "text-sm",
    // Disabled style
    "disabled:bg-gray disabled:text-white disabled:border-none",
    // Active
    "active:not-disabled:shadow-none",
    // Stretch
    stretch === "always"
      ? "w-full"
      : stretch === "mobile"
        ? "max-sm:w-full"
        : "",
  );

  if ("href" in props) {
    // TBD: If disabled, create a proper disabled button instead?
    const { href, target } = props;
    return (
      <Link className={styles} href={disabled ? "" : href} target={target}>
        {text}
      </Link>
    );
  } else {
    const { onClick, type = "button" } = props;
    return (
      <button
        className={styles}
        type={type}
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </button>
    );
  }
};
