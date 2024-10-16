import { Subject } from "rxjs";
import { createSignal } from "solid-js";
import { Combobox } from "./AppCombobox";

const textInput = new Subject<string>();

export default function ArtistSelector() {
  const [text, setText] = createSignal("");
  return (
    <Combobox
      options={["a", "b", "c"]}
      label="Artiste"
      value={text()}
      onChange={(value) => setText(value || "")}
      onInputChange={(value) => textInput.next(value)}
      inputProps={{
        placeholder: "Search for an artist",
        autofocus: true,
      }}
    />
  );
}
