import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, type ParentProps } from "solid-js";
import "./app.css";
import "uno.css";
import { SessionProvider } from "~/lib/session";
import { Navbar } from "~/components/Navbar";

function MainContent({ children }: ParentProps) {
  return (
    <Suspense fallback={"Loading..."}>
      <SessionProvider>
        <main class="h-screen flex flex-col justify-center items-center">
          {children}
        </main>
      </SessionProvider>
    </Suspense>
  );
}

export default function App() {
  return (
    <Router
      preload={true}
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <Navbar />
          <MainContent>{props.children}</MainContent>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
