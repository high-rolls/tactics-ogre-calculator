import { cn } from "@/lib/utils"
import type { ElementType } from "@/utils/combat"

function getElementIconUrl(element: ElementType) {
  return new URL(`../assets/elements/${element}.png`, import.meta.url).href
}

interface ElementIconProps {
  element: ElementType
  size?: number,
  className?: string
}

export function ElementIcon({
  element,
  size = 16,
  className,
}: ElementIconProps) {
  return (
    <img
      src={getElementIconUrl(element)}
      alt={element}
      width={size}
      height={size}
      style={{ imageRendering: "pixelated" }}
      className={cn("inline-block", className)}
    />
  )
}
