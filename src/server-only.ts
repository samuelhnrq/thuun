import { isServer } from "solid-js/web";

if (!isServer) {
  throw new Error("Logger should not be used in the browser");
}
