import { Show } from "solid-js";
import { useSession } from "~/lib/session";
import { Link } from "./Link";

function Navbar() {
  const session = useSession();
  const user = session?.user;
  return (
    <div class="bg-gray-800 fixed top-0 left-0 z-50 w-screen">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <Link href="/" class="text-white text-2xl font-bold no-underline">
            Thuun
          </Link>
          <div class="flex items-center justify-end">
            <Show when={user}>
              <Link href="/">Profile</Link>
              <Link href="/api/auth/signout" target="_self">
                Sign Out
              </Link>
            </Show>
            <Show when={!user}>
              <Link href="/api/auth/signin" target="_self">
                Sign In
              </Link>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Navbar };
