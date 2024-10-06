// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";

const rootElement = document.getElementById("app");
if (!rootElement) {
  throw new Error("No #app element found"); // unreachable
}

mount(() => <StartClient />, rootElement);
