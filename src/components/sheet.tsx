"use client";

import { Dialog as SheetBase } from "@base-ui-components/react/dialog";
import { XIcon } from "lucide-react";
import { createContextFactory } from "@/lib/context";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/icon-button";

type SheetProps = SheetBase.Root.Props;

const Sheet = ({ children, ...props }: SheetProps) => {
  return <SheetBase.Root {...props}>{children}</SheetBase.Root>;
};

type SheetBackdropProps = SheetBase.Backdrop.Props;

const SheetBackdrop = ({
  className,
  children,
  ...props
}: SheetBackdropProps) => {
  return (
    <SheetBase.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-ending-style:opacity-0 data-starting-style:opacity-0 duration-150",
        className
      )}
      data-testid="overlay"
      {...props}
    >
      {children}
    </SheetBase.Backdrop>
  );
};

type Side = "top" | "bottom" | "left" | "right";

const styleBySide: Record<Side, string> = {
  top: cn(
    "top-4 left-4 right-4",
    "data-starting-style:translate-y-[-4rem] data-ending-style:translate-y-[-4rem]"
  ),
  bottom: cn(
    "bottom-4 left-4 right-4",
    "data-starting-style:translate-y-[4rem] data-ending-style:translate-y-[4rem]"
  ),
  left: cn(
    "left-4 top-4 bottom-4",
    "data-starting-style:translate-x-[-4rem] data-ending-style:translate-x-[-4rem]"
  ),
  right: cn(
    "right-4 top-4 bottom-4",
    "data-starting-style:translate-x-[4rem] data-ending-style:translate-x-[4rem]"
  ),
};

type SheetContentProps = SheetBase.Popup.Props & {
  side?: Side;
};

const SheetContent = ({
  className,
  children,
  side = "right",
  ...props
}: SheetContentProps) => {
  return (
    <SheetContentContext value={{ side }}>
      <SheetBase.Portal>
        <SheetBackdrop />
        <SheetBase.Popup
          className={cn(
            "fixed z-50",
            "max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)]",
            "bg-background flex w-full flex-col overflow-y-auto rounded-[1rem]",
            "data-ending-style:opacity-0 data-starting-style:opacity-0",
            "duration-150",
            styleBySide[side],
            className
          )}
          {...props}
        >
          {children}
          <SheetBase.Close
            render={
              <IconButton
                className="absolute right-4 top-4"
                variant="ghost"
                aria-label="닫기"
                size="xsmall"
              >
                <XIcon className="size-4" />
              </IconButton>
            }
          />
        </SheetBase.Popup>
      </SheetBase.Portal>
    </SheetContentContext>
  );
};

type SheetHeaderProps = React.ComponentPropsWithRef<"div">;

const SheetHeader = ({ className, children, ...props }: SheetHeaderProps) => {
  return (
    <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props}>
      {children}
    </div>
  );
};

type SheetBodyProps = React.ComponentPropsWithRef<"div">;

const SheetBody = ({ className, children, ...props }: SheetBodyProps) => {
  return (
    <div
      className={cn("flex flex-1 flex-col overflow-y-auto px-5", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type SheetFooterProps = React.ComponentPropsWithRef<"div">;

const SheetFooter = ({ className, children, ...props }: SheetFooterProps) => {
  return (
    <div className={cn("flex justify-end gap-2 p-5", className)} {...props}>
      {children}
    </div>
  );
};

type SheetTitleProps = React.ComponentPropsWithRef<typeof SheetBase.Title>;

const SheetTitle = ({ className, children, ...props }: SheetTitleProps) => {
  return (
    <SheetBase.Title
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    >
      {children}
    </SheetBase.Title>
  );
};

type SheetDescriptionProps = SheetBase.Description.Props;

const SheetDescription = ({
  className,
  children,
  ...props
}: SheetDescriptionProps) => {
  return (
    <SheetBase.Description
      className={cn("text-sub text-sm", className)}
      {...props}
    >
      {children}
    </SheetBase.Description>
  );
};

type SheetTriggerProps = SheetBase.Trigger.Props;

const SheetTrigger = ({ children, ...props }: SheetTriggerProps) => {
  return <SheetBase.Trigger {...props}>{children}</SheetBase.Trigger>;
};

type SheetContentContextValue = {
  side: SheetContentProps["side"];
};

const [SheetContentContext] =
  createContextFactory<SheetContentContextValue>("SheetContent");

Sheet.Trigger = SheetTrigger;
Sheet.Close = SheetBase.Close;
Sheet.Content = SheetContent;
Sheet.Header = SheetHeader;
Sheet.Body = SheetBody;
Sheet.Footer = SheetFooter;
Sheet.Title = SheetTitle;
Sheet.Description = SheetDescription;

export { Sheet };
