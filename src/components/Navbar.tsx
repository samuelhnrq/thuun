import { Link } from "./Link";

function Navbar() {
  return (
    <div class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <Link href="/" class="text-white text-2xl font-bold no-underline">
            Thuun
          </Link>
          <div class="flex items-center">
            <Link href="/">Home</Link>
            <Link href="/">About</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Navbar };
