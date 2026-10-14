import type { Service } from "@dila/content";
import { Icon } from "./Icon";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <li className="flex gap-4 rounded-2xl border border-line bg-paper p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
        <Icon name={service.icon} size={22} />
      </span>
      <div>
        <h3 className="font-display text-base font-bold text-ink-900">
          {service.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
          {service.description}
        </p>
      </div>
    </li>
  );
}
