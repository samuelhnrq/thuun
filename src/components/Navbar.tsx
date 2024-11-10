import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { useSession } from "~/lib/session";
import Button from "./Button";
import { Link } from "./Link";

function Navbar() {
  const session = useSession();
  const user = () => session()?.user;
  return (
    <div class="bg-gray-800 sticky top-0 left-0 z-50 w-screen cursor-default">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between gap-3">
          <A class="text-white text-2xl font-bold no-underline" href="/">
            Thuun
          </A>
          <Show when={user()}>
            <span class="text-ellipsis overflow-hidden whitespace-nowrap">
              Welcome {user()?.name}
            </span>
            <Button>
              <Link href="/api/auth/signout" target="_self">
                Sign Out
              </Link>
            </Button>
          </Show>
          <Show when={!user()}>
            <Link href="/api/auth/signin" target="_self">
              Sign In
            </Link>
          </Show>
        </div>
      </div>
    </div>
  );
}

export { Navbar };
