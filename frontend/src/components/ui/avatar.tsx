import * as AvatarPrimitive from "@radix-ui/react-avatar";

export function UserAvatar({
  src,
  alt,
  fallback,
}: {
  src?: string;
  alt?: string;
  fallback?: string;
}) {
  return (
    <AvatarPrimitive.Root className="inline-flex items-center justify-center rounded-full h-12 w-12 bg-gray-200 overflow-hidden">
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <AvatarPrimitive.Fallback className="text-gray-600 font-medium">
          {fallback || "U"}
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
  );
}
