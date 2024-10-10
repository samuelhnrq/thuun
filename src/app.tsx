import "./app.css";

import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Navbar } from "~/components/Navbar";
import { SessionProvider } from "~/lib/session";

export default function App() {
  return (
    <Router
      preload={true}
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <Navbar />

          <Suspense fallback={"Loading..."}>
            <SessionProvider>
              <main>{props.children}</main>
            </SessionProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
