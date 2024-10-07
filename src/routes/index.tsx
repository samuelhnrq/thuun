import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import { useSession } from "~/lib/session";

export default function Home() {
  const session = useSession();
  return (
    <>
      <Title>Hello World</Title>
      <Counter />
      <p>Session: {session?.user?.name || "None"}</p>
      <p>Hot reload works!</p>
    </>
  );
}
