import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function BrandButton({ className, type = 'button', ...props }: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'rounded-full bg-brand-dark px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darker',
        className
      )}
      {...props}
    />
  );
}

export function SubmitButton({ className, type = 'submit', ...props }: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'mt-2 w-full rounded-full bg-brand py-3 font-bold text-black transition hover:bg-brand-hover',
        className
      )}
      {...props}
    />
  );
}

export function TextNavButton({ className, type = 'button', ...props }: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn('flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white', className)}
      {...props}
    />
  );
}

export function IconControlButton({ className, type = 'button', ...props }: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn('text-white/60 transition-colors hover:text-white', className)}
      {...props}
    />
  );
}

export function SecondaryButton({ className, type = 'button', ...props }: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn('rounded-full bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20', className)}
      {...props}
    />
  );
}

export function DarkButton({ className, type = 'button', ...props }: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn('rounded-full bg-black px-4 py-2 text-xs text-white transition-colors hover:bg-black/80', className)}
      {...props}
    />
  );
}

export function DotButton({
  active,
  className,
  type = 'button',
  ...props
}: AppButtonProps & { active: boolean }) {
  return (
    <button
      type={type}
      className={cn('h-1.5 w-1.5 rounded-full transition-colors', active ? 'bg-brand' : 'bg-white/30', className)}
      {...props}
    />
  );
}

export function TagRemoveButton({ className, type = 'button', ...props }: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn('text-lg font-bold leading-none text-brand-deepest transition-colors hover:text-white', className)}
      {...props}
    />
  );
}

export function CategoryCardButton({
  colorClass,
  image,
  isSelected,
  name,
  ...props
}: AppButtonProps & {
  colorClass: string;
  image: string;
  isSelected: boolean;
  name: string;
}) {
  return (
    <button type="button" aria-pressed={isSelected} className="group text-left" {...props}>
      <div
        className={cn(
          'w-full overflow-hidden rounded-[20px] transition-all duration-200',
          colorClass,
          isSelected ? 'ring-[5px] ring-brand-ring' : 'ring-0'
        )}
      >
        <div className="p-4 pb-3">
          <p className="mb-3 font-dm text-2xl font-medium text-white">{name}</p>
          <Image
            src={image}
            alt={name}
            width={220}
            height={112}
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
            className="h-28 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    </button>
  );
}

export function MovieCardButton({
  children,
  className,
  type = 'button',
  ...props
}: AppButtonProps & { children: ReactNode }) {
  return (
    <button
      type={type}
      className={cn(
        'group relative aspect-[16/9] overflow-hidden rounded-lg bg-white/5 transition-all duration-300 hover:scale-105',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ModalCloseButton({ className, type = 'button', ...props }: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'absolute right-4 top-4 z-10 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/80',
        className
      )}
      aria-label="Close modal"
      {...props}
    >
      <X size={18} />
    </button>
  );
}
