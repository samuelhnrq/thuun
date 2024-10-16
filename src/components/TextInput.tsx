import {
  Input,
  Label,
  TextField,
  type TextFieldInputProps,
} from "@kobalte/core/text-field";
import { type JSX, createSignal } from "solid-js";
import { cn } from "~/lib/cn";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & TextFieldInputProps;

function TextInput(props: Props) {
  const [val, setVal] = createSignal("");
  const value = () => val() || props.value;
  return (
    <TextField>
      <Label
        class={cn("block text-sm font-medium text-text/75", {
          "text-transparent": !value(),
        })}
      >
        {props.placeholder}
      </Label>
      <Input
        class={cn(
          "bg-bg text-text",
          "focus:outline-none focus:border-b-primary",
          "border-b-2 border-b-gray-500",
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
