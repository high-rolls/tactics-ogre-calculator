import {
  MinusIcon,
  ShieldIcon,
  SwordsIcon,
  WeightIcon,
  BowArrowIcon,
  /* HandIcon, */
} from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item"
import { isIndirectWeapon, type ElementType, type EquippableItem } from "@/utils/combat"
import type { ReactElement } from "react"
import { Button } from "./ui/button"
import { ElementIcon } from "./ElementIcon"
import { ItemIcon } from "./ItemIcon"

function renderItemStats(item: EquippableItem): ReactElement | string {
  switch (item.type) {
    case "weapon":
      return (
        <>
          <ItemDescription className="flex flex-row items-center gap-0.5">
            {isIndirectWeapon(item.category) ? (
              <BowArrowIcon size={16} />
            ) : (
              <SwordsIcon size={16} />
            )}
            {item.strength}
          </ItemDescription>
          {/* <ItemDescription className="flex flex-row items-center gap-0.5">
            <HandIcon size={16} />
            {item.handsRequired}
          </ItemDescription> */}
        </>
      )

    case "armor":
      return (
        <ItemDescription className="flex flex-row items-center gap-0.5">
          <ShieldIcon className="inline align-baseline" size={16} />{" "}
          {item.physicalResistance}
        </ItemDescription>
      )

    case "consumable":
      return <></>
  }
}

function renderBonuses(item: EquippableItem) {
  if (!item.statModifiers) return null

  return Object.entries(item.statModifiers)
    .map(([stat, value]) => `${stat.slice(0, 3).toUpperCase()}+${value}`)
    .join(" ")
}

function renderResistances(item: EquippableItem) {
  if (!item.elementalResistances) return null

  return Object.entries(item.elementalResistances).map(([element, value]) => (
    <>
      <ElementIcon element={element as ElementType} size={16} />{value}
    </>
  ))
}

interface InventoryItemProps {
  item: EquippableItem
  isRemoveButtonShown?: boolean
  onClick: () => void
  onRemove?: () => void
}

export function InventoryItem({
  item,
  isRemoveButtonShown = false,
  onClick,
  onRemove,
}: InventoryItemProps) {
  const statBonuses = renderBonuses(item)
  const elementalResistances = renderResistances(item)

  return (
    <Item key={item.name} variant="outline" asChild role="listitem">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
      >
        <ItemMedia variant="image">
          <ItemIcon item={item} className="object-cover" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="gap-0.5">
            {item.name}
            {item.type === "weapon" && item.element && (
              <ElementIcon element={item.element} size={16} />
            )}
          </ItemTitle>
          {item.description && (
            <ItemDescription className="text-xs">
              {item.description}
            </ItemDescription>
          )}
          {item.type === "weapon" && item.antiDragon && (
            <ItemDescription className="text-xs">Dragon slayer</ItemDescription>
          )}
        </ItemContent>
        {(statBonuses || elementalResistances) && (
          <ItemContent>
            {statBonuses && (
              <ItemDescription className="text-xs">
                {statBonuses}
              </ItemDescription>
            )}
            {elementalResistances && (
              <ItemDescription className="flex flex-row text-xs">
                RES:{elementalResistances}
              </ItemDescription>
            )}
          </ItemContent>
        )}

        <ItemContent>
          {renderItemStats(item)}
          <ItemDescription className="flex flex-row items-center justify-end gap-0.5">
            <WeightIcon size={16} />
            {item.weight}
          </ItemDescription>
        </ItemContent>
        {isRemoveButtonShown && (
          <ItemActions>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (onRemove) onRemove()
              }}
            >
              <MinusIcon />
            </Button>
          </ItemActions>
        )}
      </a>
    </Item>
  )
}
