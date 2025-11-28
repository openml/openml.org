import Link from "next/link";
import { ReactNode, CSSProperties } from "react";

/**
 * Reusable Section Container - Server Component
 * Provides consistent spacing and max-width for homepage sections
 */
interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

export function SectionContainer({
  children,
  className = "",
  id,
  style,
}: SectionContainerProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`} style={style}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">{children}</div>
    </section>
  );
}
