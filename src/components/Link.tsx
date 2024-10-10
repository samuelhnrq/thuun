import { A } from "@solidjs/router";
import type { JSX } from "solid-js";
import { cn } from "~/lib/cn";

interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: string;
  href: string;
}

function Link({ children, class: className, ...rest }: LinkProps) {
  return (
    <A
      class={cn(
        "text-gray-300 hover:bg-gray-700 hover:text-white",
        "px-3 py-2 rounded-md text-sm font-medium no-underline",
        className,
      )}
      {...rest}
    >
      {children}
    </A>
  );
}

export { Link };
