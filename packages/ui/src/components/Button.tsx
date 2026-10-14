import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Renders an icon (or anything else) before the label. */
  icon?: ReactNode;
}

interface LinkProps extends BaseProps {
  href: string;
  /** Internal anchors use a plain `<a>`; routes use `next/link`. */
  external?: boolean;
}

interface ButtonElementProps extends BaseProps {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
}

type Props = LinkProps | ButtonElementProps;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-strong shadow-sm shadow-ink-900/10",
  secondary: "bg-ink-900 text-white hover:bg-ink-800",
  outline:
    "border border-ink-200 bg-paper text-ink-900 hover:border-ink-300 hover:bg-surface",
  ghost: "text-ink-900 hover:bg-ink-100",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button(props: Props) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    icon,
  } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if ("href" in props && props.href) {
    const { href, external } = props;
    const isRoute = href.startsWith("/") && !external;

    if (isRoute) {
      return (
        <Link href={href} className={classes}>
          {content}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.href === undefined && "type" in props ? (props.type ?? "button") : "button"}
      onClick={"onClick" in props ? props.onClick : undefined}
      className={classes}
    >
      {content}
    </button>
  );
}
