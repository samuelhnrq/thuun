import clsx from "clsx";
import type { ParentProps } from "solid-js";
import { Navbar } from "./Navbar";

function Scaffolding(props: ParentProps) {
  return (
    <main
      class={clsx(
        "flex flex-col dark:bg-slate-700 text-text h-screen items-center text-gray-300"
      )}
    >
      <Navbar />
      <div
        class={clsx(
          "flex flex-col gap-4 justify-center align-middle px-5",
          "basis-[60vw] flex-grow min-w-[60vw]"
        )}
      >
        {props.children}
      </div>
    </main>
  );
}

export { Scaffolding };
