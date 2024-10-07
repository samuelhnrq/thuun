import { createSignal } from "solid-js";
import { Button } from "./ui/button";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <Button
      class="increment"
      onClick={() => setCount((x) => x + 1)}
      type="button"
    >
      Clicks: {count()}
    </Button>
  );
}
