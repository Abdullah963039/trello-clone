"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { FormErrors } from "./form-errors";

interface FormInputProps {
  id: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      className,
      defaultValue = "",
      disabled,
      errors,
      label,
      onBlur,
      placeholder,
      required,
      type = "text",
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Input
            onBlur={onBlur}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            name={id}
            id={id}
            disabled={pending || disabled}
            placeholder={placeholder}
            type={type}
            className={cn("text-sm px-2 py-1 h-7", className)}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors errors={errors} id={id} />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
