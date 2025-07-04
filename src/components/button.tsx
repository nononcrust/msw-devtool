"use client";

import { useRender } from "@base-ui-components/react/use-render";
import { tv, VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

export type ButtonProps = useRender.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export const buttonVariant = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  primaryLow:
    "bg-primary-lighter text-primary hover:bg-primary-lighter-hover dark:bg-primary-darker dark:text-white dark:hover:bg-primary-darker-hover",
  primaryOutlined:
    "bg-background border border-border text-primary hover:bg-background-hover",
  primaryLowOutlined:
    "border border-primary text-primary bg-primary-lighter hover:bg-primary-lighter-hover dark:bg-primary-darker dark:text-white dark:border-primary-dark dark:hover:bg-primary-darker-hover",
  secondary: "bg-secondary text-main hover:bg-secondary-dark",
  contained: "bg-neutral text-background hover:bg-neutral-dark",
  outlined: "border border-border text-main hover:bg-background-hover",
  ghost: "hover:bg-background-hover",
  error: "bg-error text-white hover:bg-error-dark",
};

const buttonVariants = tv({
  base: cn(
    "inline-flex justify-center items-center gap-2 font-semibold outline-hidden whitespace-nowrap transition-colors",
    "disabled:opacity-50 disabled:pointer-events-none"
  ),
  variants: {
    variant: buttonVariant,
    size: {
      xsmall: "px-[0.625rem] h-8 text-xs rounded-[0.5rem]",
      small: "px-3 h-9 text-sm rounded-md",
      medium: "px-[0.875rem] h-10 text-[0.9375rem] rounded-md",
      large: "px-4 h-11 text-base rounded-lg",
      xlarge: "px-[1.25rem] h-[3.5rem] rounded-lg text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
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
  const defaultRender = <button />;

  return useRender({
    render: render ?? defaultRender,
    props: {
      className: cn(buttonVariants({ size, variant, className })),
      disabled,
      type: render ? undefined : "button",
      ...props,
    },
  });
};

export { Button };
