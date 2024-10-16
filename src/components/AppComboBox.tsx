import {
  Combobox,
  type ComboboxInputProps,
  type ComboboxRootProps,
} from "@kobalte/core/combobox";
import clsx from "clsx";
import { FaSolidArrowDown, FaSolidCheck } from "solid-icons/fa";
import type { JSX } from "solid-js";
import { cn } from "~/lib/cn";

type Props<T> = ComboboxRootProps<T> & {
  label: string;
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement> & ComboboxInputProps;
};

function AppCombobox<T>({ inputProps, label, ...props }: Props<T>) {
  return (
    <Combobox
      itemComponent={(props) => (
        <Combobox.Item item={props.item} class="text-text w-full">
          <Combobox.ItemLabel class="flex items-center justify-between">
            {props.item.textValue}
            <Combobox.ItemIndicator>
              <FaSolidCheck class="inline-block" />
            </Combobox.ItemIndicator>
          </Combobox.ItemLabel>
        </Combobox.Item>
      )}
      class={cn(
        "focus:border-b-primary bg-bgDarker border-b-2 border-b-gray-500",
        "px-3 py-1 rounded-t-md",
      )}
      multiple={false}
      {...props}
    >
      <Combobox.Label class={cn("block text-sm font-medium text-text/75")}>
        {label}
      </Combobox.Label>
      <Combobox.Control>
        <Combobox.Input
          class="focus:outline-none bg-bgDarker placeholder:text-text/25"
          {...inputProps}
        />
        <Combobox.Trigger>
          <Combobox.Icon>
            <FaSolidArrowDown />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      {/* <Combobox.Description />
      <Combobox.ErrorMessage /> */}
      <Combobox.Portal>
        <Combobox.Content
          class={clsx(
            "animate-contentHide ui-expanded:animate-contentShow rounded-md bg-bgDarker",
            "border-slate-600 dark:border-slate-400 border-1 px-2 py-1",
          )}
        >
          {/* <Combobox.Arrow /> */}
          <Combobox.Listbox />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox>
  );
}

export default AppCombobox;
export { AppCombobox as Combobox };
