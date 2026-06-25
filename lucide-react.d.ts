declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react';

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = FC<LucideProps>;

  export const AlertTriangle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Calendar: LucideIcon;
  export const Check: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Circle: LucideIcon;
  export const Clock: LucideIcon;
  export const Cloud: LucideIcon;
  export const Dot: LucideIcon;
  export const Droplets: LucideIcon;
  export const Gauge: LucideIcon;
  export const GripVertical: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Search: LucideIcon;
  export const Star: LucideIcon;
  export const Wind: LucideIcon;
  export const X: LucideIcon;
}
