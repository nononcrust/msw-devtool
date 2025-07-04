'use client';

import type React from 'react';
import { useId, useState } from 'react';
import { createContextFactory } from '@/lib/context';
import { cn } from '@/lib/utils';

type TextFieldProps = Omit<
  React.ComponentPropsWithRef<'div'>,
  'onChange' | 'value'
> & {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean;
  errorMessage?: React.ReactNode;
  maxGraphemeCount?: number;
  required?: boolean;
};

const TextField = ({
  value: externalValue,
  onChange: externalOnChange,
  defaultValue,
  className,
  children,
  label,
  description,
  maxGraphemeCount,
  required,
  error,
  errorMessage,
  ...props
}: TextFieldProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const value = externalValue ?? internalValue;
  const onChange = externalOnChange ?? setInternalValue;

  const textFieldId = useId();
  const descriptionId = useId();
  const errorMessageId = useId();

  const [descriptionElement, setDescriptionElement] =
    useState<HTMLParagraphElement | null>(null);
  const [errorMessageElement, setErrorMessageElement] =
    useState<HTMLParagraphElement | null>(null);

  const contextValue = {
    value,
    onChange,
    defaultValue,
    required,
    maxGraphemeCount,
    error,
    textFieldId,
    descriptionId,
    errorMessageId,
    descriptionElement,
    errorMessageElement,
    setDescriptionElement,
    setErrorMessageElement,
  };

  return (
    <TextFieldContext value={contextValue}>
      <div className={cn('flex w-full flex-col', className)} {...props}>
        {label}
        <div
          className={cn(
            'flex min-h-10 rounded-md border border-border bg-background shadow-xs',
            'focus-within:focus-input-ring',
            'has-data-invalid:focus-within:focus-input-ring-error has-data-invalid:border-error',
            'has-data-disabled:pointer-events-none has-data-disabled:bg-background-100 has-data-disabled:opacity-50',
            'has-data-readonly:bg-background-100'
          )}
        >
          {children}
        </div>
        {(description || maxGraphemeCount || (error && errorMessage)) && (
          <div className="mt-1 flex justify-end gap-3">
            <div className="flex-1">
              {description && description}
              {error && errorMessage}
            </div>
            {maxGraphemeCount && (
              <span
                className={cn(
                  'font-medium text-[0.8125rem] text-subtle',
                  className
                )}
                {...props}
              >
                {value.length}/{maxGraphemeCount}
              </span>
            )}
          </div>
        )}
      </div>
    </TextFieldContext>
  );
};

type TextFieldInputProps = React.ComponentPropsWithRef<'input'>;

const TextFieldInput = ({ className, ...props }: TextFieldInputProps) => {
  const { register } = useRegisterTextField();

  return (
    <input
      className={cn(
        'w-full px-3 text-main text-sm placeholder-placeholder outline-hidden',
        className
      )}
      data-disabled={props.disabled}
      data-readonly={props.readOnly}
      {...register}
      {...props}
    />
  );
};

type TextFieldTextareaProps = React.ComponentPropsWithRef<'textarea'>;

const TextFieldTextarea = ({ className, ...props }: TextFieldTextareaProps) => {
  const { register } = useRegisterTextField();

  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 text-main text-sm placeholder-placeholder outline-hidden',
        'min-h-[7.5rem]',
        'field-sizing-content',
        className
      )}
      data-disabled={props.disabled}
      data-readonly={props.readOnly}
      {...register}
      {...props}
    />
  );
};

type TextFieldAdornmentProps = React.ComponentPropsWithRef<'div'>;

const TextFieldPrefix = ({
  className,
  children,
  ...props
}: TextFieldAdornmentProps) => {
  return (
    <div
      className={cn('flex items-center justify-center pl-3', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const TextFieldSuffix = ({
  className,
  children,
  ...props
}: TextFieldAdornmentProps) => {
  return (
    <div
      className={cn('flex items-center justify-center pr-3', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const TextFieldLabel = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<'label'>) => {
  const { required, textFieldId } = useTextFieldContext();

  return (
    <label
      className={cn('mb-2 flex items-center', className)}
      htmlFor={textFieldId}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-error">*</span>}
    </label>
  );
};

type TextFieldDescriptionProps = React.ComponentPropsWithRef<'p'>;

const TextFieldDescription = ({
  className,
  children,
  ...props
}: TextFieldDescriptionProps) => {
  const { descriptionId, setDescriptionElement } = useTextFieldContext();

  const refCallback = (node: HTMLParagraphElement | null) => {
    if (node) {
      setDescriptionElement(node);
    }

    return () => {
      setDescriptionElement(null);
    };
  };

  return (
    <p
      className={cn(
        'flex-1 font-medium text-[0.8125rem] text-subtle',
        className
      )}
      id={descriptionId}
      ref={refCallback}
      {...props}
    >
      {children}
    </p>
  );
};

type TextFieldErrorMessageProps = React.ComponentPropsWithRef<'p'>;

const TextFieldErrorMessage = ({
  className,
  children,
  ...props
}: TextFieldErrorMessageProps) => {
  const { errorMessageId, setErrorMessageElement } = useTextFieldContext();

  const refCallback = (node: HTMLParagraphElement | null) => {
    if (node) {
      setErrorMessageElement(node);
    }

    return () => {
      setErrorMessageElement(null);
    };
  };

  return (
    <p
      className={cn(
        'mt-1 flex-1 font-medium text-[0.8125rem] text-error',
        className
      )}
      id={errorMessageId}
      ref={refCallback}
      {...props}
    >
      {children}
    </p>
  );
};

type TextFieldContextValue = {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  maxGraphemeCount?: number;
  required?: boolean;
  error?: boolean;
  textFieldId: string;
  errorMessageId: string;
  descriptionId: string;
  descriptionElement: HTMLParagraphElement | null;
  errorMessageElement: HTMLParagraphElement | null;
  setDescriptionElement: (element: HTMLParagraphElement | null) => void;
  setErrorMessageElement: (element: HTMLParagraphElement | null) => void;
};

const [TextFieldContext, useTextFieldContext] =
  createContextFactory<TextFieldContextValue>('');

const useRegisterTextField = () => {
  const {
    textFieldId,
    value,
    onChange,
    error,
    descriptionElement,
    errorMessageElement,
    errorMessageId,
    descriptionId,
    maxGraphemeCount,
  } = useTextFieldContext();

  const onFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (maxGraphemeCount) {
      const slicedValue = event.target.value.slice(0, maxGraphemeCount);
      return onChange(slicedValue);
    }

    onChange(event.target.value);
  };

  const register = {
    id: textFieldId,
    value,
    onChange: onFieldChange,
    'aria-invalid': error || undefined,
    'data-invalid': error || undefined,
    'aria-describedby': cn(
      descriptionElement && descriptionId,
      errorMessageElement && errorMessageId
    ),
  };

  return { register };
};

TextField.Input = TextFieldInput;
TextField.Textarea = TextFieldTextarea;
TextField.Prefix = TextFieldPrefix;
TextField.Suffix = TextFieldSuffix;
TextField.Label = TextFieldLabel;
TextField.Description = TextFieldDescription;
TextField.ErrorMessage = TextFieldErrorMessage;

export { TextField };
