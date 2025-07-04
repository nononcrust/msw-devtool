import { useRender } from "@base-ui-components/react/use-render";
import { tv, VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { buttonVariant } from "@/components/button";

export type IconButtonProps = useRender.ComponentProps<"button"> &
  VariantProps<typeof iconButtonVariants> & {
    ["aria-label"]: string;
  };

const iconButtonVariants = tv({
  base: cn(
    "inline-flex justify-center items-center border border-transparent whitespace-nowrap transition-colors",
    "disabled:opacity-50 disabled:pointer-events-none"
  ),
  variants: {
    variant: buttonVariant,
    size: {
      xsmall: "size-7 text-xs rounded-[0.5rem]",
      small: "size-8 text-sm rounded-[0.5rem]",
      medium: "size-9 text-base rounded-md",
      large: "size-10 text-lg rounded-md",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

const IconButton = ({
  className,
  variant,
  size,
  disabled,
  render,
  "aria-label": ariaLabel,
  ...props
}: IconButtonProps) => {
  const defaultRender = <button />;

  return useRender({
    render: render ?? defaultRender,
    props: {
      className: cn(iconButtonVariants({ size, variant, className })),
      disabled,
      type: render ? undefined : "button",
      "aria-label": ariaLabel,
      ...props,
    },
  });
};

export { IconButton };
