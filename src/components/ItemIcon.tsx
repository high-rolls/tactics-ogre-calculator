import { cn } from "@/lib/utils"
import type { BaseItem } from "@/utils/combat"
import { hasItemIcon } from "@/utils/itemIcons"

const getItemIconUrl = (iconName?: string) => {
  if (!iconName) iconName = "placeholder"
  return new URL(`../assets/items/${iconName}.gif`, import.meta.url).href
}

interface ItemIconProps {
  item: BaseItem
  size?: number
  className?: string
}

export function ItemIcon({ item, size = 32, className }: ItemIconProps) {
  if (!hasItemIcon(item.key)) {
    return null
  }

  return (
    <img
      src={getItemIconUrl(item.key)}
      alt={item.name}
      style={{ imageRendering: "pixelated" }}
      width={size}
      height={size}
      className={cn(className)}
    />
  )
}
