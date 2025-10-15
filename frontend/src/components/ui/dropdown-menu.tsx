import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = ({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) => (
  <DropdownMenuPrimitive.Content
    className={cn(
      "z-50 min-w-[160px] rounded-md border border-gray-200 bg-white p-1 shadow-md animate-in fade-in-80",
      className
    )}
    sideOffset={4}
    {...props}
  />
);

export const DropdownMenuItem = ({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuItemProps) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
      className
    )}
    {...props}
  />
);

export const DropdownMenuLabel = ({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuLabelProps) => (
  <DropdownMenuPrimitive.Label
    className={cn("px-2 py-1.5 text-sm font-semibold text-gray-900", className)}
    {...props}
  />
);

export const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSeparatorProps) => (
  <DropdownMenuPrimitive.Separator
    className={cn("my-1 h-px bg-gray-200", className)}
    {...props}
  />
);
