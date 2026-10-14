import type { SVGProps } from "react";
import type { ServiceIcon } from "@dila/content";

/**
 * Hand-rolled stroke icons so the shared package stays dependency-free.
 * All icons share a 24×24 viewBox and inherit `currentColor`.
 */
const paths = {
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  external: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94L14.7 6.3Z" />
  ),
  diagnose: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  tyre: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    </>
  ),
  brake: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3.5v3" />
      <path d="M12 17.5v3" />
      <path d="M20.5 12h-3" />
      <path d="M6.5 12h-3" />
      <path d="M17.9 6.1l-2.1 2.1" />
      <path d="M8.2 15.8l-2.1 2.1" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="7" width="16" height="10" rx="2" />
      <path d="M22 11v2" />
      <path d="M6 11v2" />
      <path d="M10 11v2" />
    </>
  ),
  carburettor: <path d="M12 2c3.5 4 6 7.1 6 10.2A6 6 0 0 1 6 12.2C6 9.1 8.5 6 12 2Z" />,
  exhaust: (
    <>
      <path d="M3 14h10a4 4 0 0 0 4-4V9" />
      <path d="M19 6l2 3-2 3" />
      <path d="M3 18h10" />
    </>
  ),
  snow: (
    <>
      <path d="M12 2v20" />
      <path d="M3.5 7l17 10" />
      <path d="M20.5 7l-17 10" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

const serviceIconMap: Record<ServiceIcon, IconName> = {
  wrench: "wrench",
  diagnose: "diagnose",
  tyre: "tyre",
  brake: "brake",
  battery: "battery",
  carburettor: "carburettor",
  exhaust: "exhaust",
  snow: "snow",
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName | ServiceIcon;
  size?: number;
}

export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  const key = (serviceIconMap as Record<string, IconName>)[name] ?? (name as IconName);

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {paths[key]}
    </svg>
  );
}
