import { cn } from "~/lib/cn";
import {
  Button as BaseButton,
  type ButtonRootProps,
} from "@kobalte/core/button";
import type { ParentProps } from "solid-js";

function Button({
  children,
  ...rest
}: ParentProps<ButtonRootProps<HTMLButtonElement>>) {
  return (
    <BaseButton
      class={cn("bg-primary text-primary-foreground px-4 py-2")}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}

export default Button;
