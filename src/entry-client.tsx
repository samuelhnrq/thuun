// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";
import { ThuunError } from "./lib/errors";

const rootElement = document.getElementById("app");
if (!rootElement) {
  throw new ThuunError("No #app element found"); // unreachable
}

mount(() => <StartClient />, rootElement);
