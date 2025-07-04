'use client';

import { useRender } from '@base-ui-components/react/use-render';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

export type ButtonProps = useRender.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>;

export const buttonVariant = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  primaryLow:
    'bg-primary-lighter text-primary hover:bg-primary-lighter-hover dark:bg-primary-darker dark:text-white dark:hover:bg-primary-darker-hover',
  primaryOutlined:
    'bg-background border border-border text-primary hover:bg-background-hover',
  primaryLowOutlined:
    'border border-primary text-primary bg-primary-lighter hover:bg-primary-lighter-hover dark:bg-primary-darker dark:text-white dark:border-primary-dark dark:hover:bg-primary-darker-hover',
  secondary: 'bg-secondary text-main hover:bg-secondary-dark',
  contained: 'bg-neutral text-background hover:bg-neutral-dark',
  outlined: 'border border-border text-main hover:bg-background-hover',
  ghost: 'hover:bg-background-hover',
  error: 'bg-error text-white hover:bg-error-dark',
};

const buttonVariants = tv({
  base: cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold outline-hidden transition-colors',
    'disabled:pointer-events-none disabled:opacity-50'
  ),
  variants: {
    variant: buttonVariant,
    size: {
      xsmall: 'h-8 rounded-[0.5rem] px-[0.625rem] text-xs',
      small: 'h-9 rounded-md px-3 text-sm',
      medium: 'h-10 rounded-md px-[0.875rem] text-[0.9375rem]',
      large: 'h-11 rounded-lg px-4 text-base',
      xlarge: 'h-[3.5rem] rounded-lg px-[1.25rem] text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

const Button = ({
  className,
  variant,
  size,
  render,
  disabled,
  ...props
}: ButtonProps) => {
  const defaultRender = <button type="button" />;

  return useRender({
    render: render ?? defaultRender,
    props: {
      className: cn(buttonVariants({ size, variant, className })),
      disabled,
      ...props,
    },
  });
};

export { Button };
