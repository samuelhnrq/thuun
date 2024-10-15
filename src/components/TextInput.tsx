import { createSignal, type JSX } from "solid-js";
import { cn } from "~/lib/cn";
import {
  Input,
  Label,
  TextField,
  type TextFieldInputProps,
} from "@kobalte/core/text-field";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & TextFieldInputProps;

function TextInput(props: Props) {
  const [val, setVal] = createSignal("");
  return (
    <TextField>
      <Label
        class={cn("block text-sm font-medium text-text/75", {
          "text-transparent": !(val() || props.value),
        })}
      >
        {props.placeholder}
      </Label>
      <Input
        class={cn(
          "bg-bg text-text",
          "focus:outline-none focus:border-b-primary",
          "border-b-2 border-b-gray-500"
        )}
        type="text"
        placeholder=""
        value={val()}
        onInput={(e) => setVal(e.currentTarget.value)}
        {...props}
      />
    </TextField>
  );
}

export default TextInput;
export { TextInput };
