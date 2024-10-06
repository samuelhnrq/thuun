import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { createSignal } from "solid-js";
import Counter from "~/components/Counter";
import { api } from "~/lib/api";

export default function Home() {
  const hello = createAsync(
    async () => {
      try {
        return await api.example.hello.query("world");
      } catch {
        // VERY IMPORTANT: TRPC's errors are unserializable and cannot be sent to the client
        // vinxi will CRASH if you try to send a TRPC error to the client
        return "fail";
      }
    },
    { initialValue: "Loading..." },
  );
  const [test, setTest] = createSignal(false);
  return (
    <main>
      <Title>Hello World</Title>
      <Counter />
      <pre>
        <code>{hello()}</code>
      </pre>
      <p>Hot reload works!</p>
      <button type="button" onClick={() => setTest(!test())}>
        {test() ? "Hide" : "Show"}
      </button>
    </main>
  );
}
