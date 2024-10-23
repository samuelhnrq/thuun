import {
  Combobox,
  type ComboboxInputProps,
  type ComboboxRootProps,
} from "@kobalte/core/combobox";
import clsx from "clsx";
import { FaSolidArrowDown, FaSolidCheck } from "solid-icons/fa";
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
          class="text-text px-2 py-1 w-full ui-highlighted:bg-primary"
        >
          <Combobox.ItemLabel class="flex items-center justify-between">
            {props.item.textValue}
            <Combobox.ItemIndicator>
              <FaSolidCheck class="inline-block" />
            </Combobox.ItemIndicator>
          </Combobox.ItemLabel>
        </Combobox.Item>
      )}
      class={clsx(
        "focus:border-b-primary bg-bgDarker border-b-2 border-b-gray-500",
        "rounded-t-md py-1",
      )}
      multiple={false}
      {...outProps}
    >
      <Combobox.Label
        class={clsx("block px-3 text-sm font-medium text-text/75")}
      >
        {outProps.label}
      </Combobox.Label>
      <Combobox.Control class="px-3 py-1 w-full flex items-center">
        <Combobox.Input
          class="focus:outline-none flex-1 bg-bgDarker placeholder:text-text/25"
          {...outProps.inputProps}
        />
        <Combobox.Trigger>
          <Combobox.Icon>
            <FaSolidArrowDown />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      {/* <Combobox.Description />
      <Combobox.ErrorMessage /> */}
      <Combobox.Portal useShadow={false}>
        <Combobox.Content
          class={clsx(
            "animate-contentHide ui-expanded:animate-contentShow rounded-md bg-bgDarker overflow-hidden",
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
