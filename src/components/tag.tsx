import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

const tagVariant = tv({
  base: 'inline-flex items-center justify-center font-medium',
  variants: {
    variant: {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-main',
      outlined: 'border border-border text-main',
      info: 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-50',
      success:
        'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-50',
      warning:
        'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-50',
      danger: 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-50',
    },
    size: {
      medium: 'h-6 rounded-[0.375rem] px-2 text-xs',
      large: 'h-7 rounded-[0.5rem] px-[0.625rem] text-[0.8125rem]',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

type TagProps = React.ComponentPropsWithRef<'span'> &
  VariantProps<typeof tagVariant>;

const Tag = ({ className, variant, size, children, ...props }: TagProps) => {
  return (
    <span className={cn(tagVariant({ size, variant, className }))} {...props}>
      {children}
    </span>
  );
};

export { Tag };
