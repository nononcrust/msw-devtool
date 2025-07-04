"use client";

import { Popover as PopoverBase } from "@base-ui-components/react/popover";
import { cn } from "@/lib/utils";

type PopoverProps = PopoverBase.Root.Props;

const Popover = ({ children, ...props }: PopoverProps) => {
  return <PopoverBase.Root {...props}>{children}</PopoverBase.Root>;
};

type PopoverContentProps = PopoverBase.Popup.Props & {
  side?: PopoverBase.Positioner.Props["side"];
};

const PopoverContent = ({
  className,
  children,
  side = "bottom",
  ...props
}: PopoverContentProps) => {
  return (
    <PopoverBase.Portal>
      <PopoverBase.Positioner sideOffset={4} side={side}>
        <PopoverBase.Popup
          className={cn(
            "border-border bg-background text-main outline-hidden relative z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-lg border shadow-lg",
            "max-h-[calc(var(--available-height)-0.5rem)]",
            "data-starting-style:opacity-0 data-open:duration-150",
            "data-[side=top]:data-starting-style:translate-y-[0.5rem]",
            "data-[side=bottom]:data-starting-style:translate-y-[-0.5rem]",
            "data-[side=left]:data-starting-style:translate-x-[0.5rem]",
            "data-[side=right]:data-starting-style:translate-x-[-0.5rem]",
            className
          )}
          {...props}
        >
          {children}
        </PopoverBase.Popup>
      </PopoverBase.Positioner>
    </PopoverBase.Portal>
  );
};

type PopoverTriggerProps = PopoverBase.Trigger.Props;

const PopoverTrigger = ({ children, ...props }: PopoverTriggerProps) => {
  return <PopoverBase.Trigger {...props}>{children}</PopoverBase.Trigger>;
};

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Close = PopoverBase.Close;

export { Popover };
