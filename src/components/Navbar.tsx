import { A } from "@solidjs/router";

function Navbar() {
  const linkClasses =
    "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 " +
    "rounded-md text-sm font-medium no-underline";
  return (
    <div class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <A href="/" class="text-white text-2xl font-bold no-underline">
            Thuun
          </A>
          <div class="flex items-center">
            <A href="/" class={linkClasses}>
              Home
            </A>
            <A href="/" class={linkClasses}>
              About
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Navbar };
