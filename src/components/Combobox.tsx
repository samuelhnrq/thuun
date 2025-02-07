import {
  Combobox,
  type ComboboxInputProps,
  type ComboboxRootProps,
} from "@kobalte/core/combobox";
import clsx from "clsx";
import CheckIcon from "~icons/material-symbols/check-rounded";
import ArrowDownIcon from "~icons/material-symbols/keyboard-double-arrow-down-rounded";
import type { JSX } from "solid-js";

type Props<T> = ComboboxRootProps<T> & {
  label: string;
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement> & ComboboxInputProps;
};

function AppCombobox<T>(outProps: Props<T>) {
  return (
    <Combobox
      itemComponent={(props) => (
        <Combobox.Item
          item={props.item}
          class="text-gray-200 px-2 py-1 w-full data-highlighted:bg-slate-400"
        >
          <Combobox.ItemLabel class="flex items-center justify-between">
            {props.item.textValue}
            <Combobox.ItemIndicator>
              <CheckIcon class="inline-block" />
            </Combobox.ItemIndicator>
          </Combobox.ItemLabel>
        </Combobox.Item>
      )}
      class={clsx(
        "focus:border-b-primary bg-slate-300 dark:bg-slate-600 border-b-2 border-b-gray-500",
        "rounded-t-md py-1",
        { "brightness-75": outProps.disabled }
      )}
      disabled={outProps.disabled}
      onInputChange={outProps.onInputChange}
      multiple={false}
      {...outProps}
    >
      <Combobox.Control class="px-3 py-1 w-full flex items-center flex-wrap">
        <Combobox.Label
          class={clsx(
            "flex-grow basis-[100%] text-sm font-medium text-text/75"
          )}
        >
          {outProps.label}
        </Combobox.Label>
        <Combobox.Input
          class="focus:outline-none flex-1 bg-slate-300 dark:bg-slate-600 placeholder:text-text/25"
          {...outProps.inputProps}
        />
        <Combobox.Trigger>
          <Combobox.Icon>
            <ArrowDownIcon />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      {/* <Combobox.Description />
      <Combobox.ErrorMessage /> */}
      <Combobox.Portal useShadow={false}>
        <Combobox.Content
          class={clsx(
            "animate-contentHide ui-expanded:animate-contentShow rounded-md",
            "bg-slate-300 dark:bg-slate-600 overflow-hidden"
          )}
        >
          {/* <Combobox.Arrow /> */}
          <Combobox.Listbox />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox>
  );
}

export { AppCombobox as Combobox };
