import { useRender } from '@base-ui-components/react/use-render';
import { tv, type VariantProps } from 'tailwind-variants';
import { buttonVariant } from '@/components/button';
import { cn } from '@/lib/utils';

export type IconButtonProps = useRender.ComponentProps<'button'> &
  VariantProps<typeof iconButtonVariants> & {
    'aria-label': string;
  };

const iconButtonVariants = tv({
  base: cn(
    'inline-flex items-center justify-center whitespace-nowrap border border-transparent transition-colors',
    'disabled:pointer-events-none disabled:opacity-50'
  ),
  variants: {
    variant: buttonVariant,
    size: {
      xsmall: 'size-7 rounded-[0.5rem] text-xs',
      small: 'size-8 rounded-[0.5rem] text-sm',
      medium: 'size-9 rounded-md text-base',
      large: 'size-10 rounded-md text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

const IconButton = ({
  className,
  variant,
  size,
  disabled,
  render,
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps) => {
  const defaultRender = <button type="button" />;

  return useRender({
    render: render ?? defaultRender,
    props: {
      className: cn(iconButtonVariants({ size, variant, className })),
      disabled,
      'aria-label': ariaLabel,
      ...props,
    },
  });
};

export { IconButton };
