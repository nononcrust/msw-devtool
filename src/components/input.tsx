import { cn } from '@/lib/utils';

type InputProps = React.ComponentPropsWithRef<'input'>;

const Input = ({
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) => {
  return (
    <input
      aria-invalid={ariaInvalid}
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-background px-3 text-main text-sm shadow-xs',
        'focus-visible:focus-input-ring',
        'placeholder-placeholder',
        'disabled:pointer-events-none disabled:bg-background-100 disabled:opacity-50',
        'read-only:bg-background-100',
        ariaInvalid && 'focus-visible:focus-input-ring-error border-error',
        className
      )}
      {...props}
    />
  );
};

export { Input };
