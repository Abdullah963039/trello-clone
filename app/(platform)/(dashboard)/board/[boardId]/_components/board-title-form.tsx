"use client";

import { toast } from "sonner";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";

interface BoardTitleFormProps {
  data: Board;
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated!`);
      disableEditing();
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 100);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    execute({ title, id: data.id });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  if (isEditing)
    return (
      <form
        action={onSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          id="title"
          ref={inputRef}
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );

  return (
    <Button
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
      onClick={enableEditing}
    >
      {title}
    </Button>
  );
};
