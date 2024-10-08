import { createSignal } from "solid-js";
import Button from "./button";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <Button onClick={() => setCount((x) => x + 1)} type="button">
      Clicks: {count()}
    </Button>
  );
}
