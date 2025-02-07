import { Button as BaseButton } from "@kobalte/core/button";
import type { JSX, ParentProps } from "solid-js";
import { cn } from "~/lib/cn";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, ...rest }: ParentProps<Props>) {
  return (
    <BaseButton
      class={cn(
        "bg-purple-300 text-slate-200 px-4 py-2 rounded-md",
        "hover:brightness-110 focus:ring-1 cursor-pointer dark:bg-purple-700"
      )}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}

export default Button;
