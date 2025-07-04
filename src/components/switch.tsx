import { Switch as SwitchBase } from '@base-ui-components/react/switch';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

type SwitchProps = Omit<
  SwitchBase.Root.Props,
  'onChange' | 'onCheckedChange' | 'className'
> &
  VariantProps<typeof switchVariants> & {
    className?: string;
    onChange?: (checked: boolean) => void;
  };

const switchVariants = tv({
  slots: {
    root: cn(
      'group inline-flex shrink-0 cursor-pointer items-center rounded-full border-[0.25rem] border-transparent transition-colors duration-100',
      'data-unchecked:bg-border',
      'data-checked:border-primary data-checked:bg-primary',
      'disabled:pointer-events-none disabled:opacity-50'
    ),
    thumb: cn(
      'pointer-events-none block rounded-full bg-white shadow-xs',
      'data-unchecked:translate-x-0',
      'transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]'
    ),
  },
  variants: {
    size: {
      small: {
        root: 'h-5 w-8',
        thumb: cn('size-[0.75rem] data-checked:translate-x-[0.75rem]'),
      },
      medium: {
        root: 'h-6 w-10',
        thumb: cn('size-[1rem] data-checked:translate-x-[1rem]'),
      },
      large: {
        root: 'h-6.5 w-11',
        thumb: cn('size-[1.125rem] data-checked:translate-x-[1.125rem]'),
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

const Switch = ({ className, onChange, size, ...props }: SwitchProps) => {
  const variants = switchVariants({ size, className });

  return (
    <SwitchBase.Root
      className={variants.root()}
      onCheckedChange={onChange}
      {...props}
    >
      <SwitchBase.Thumb className={variants.thumb()} />
    </SwitchBase.Root>
  );
};

export { Switch };
