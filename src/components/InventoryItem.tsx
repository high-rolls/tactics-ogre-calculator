import {
  MinusIcon,
  ShieldIcon,
  SwordsIcon,
  WeightIcon,
  BowArrowIcon,
  PlusIcon,
  /* HandIcon, */
} from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "./ui/item"
import {
  isIndirectWeapon,
  type ElementType,
  type EquippableItem,
} from "@/utils/combat"
import { useMemo, type ReactElement } from "react"
import { Button } from "./ui/button"
import { ElementIcon } from "./ElementIcon"
import { ItemIcon } from "./ItemIcon"

function renderItemStats(item: EquippableItem): ReactElement | string {
  switch (item.type) {
    case "weapon":
      return (
        <>
          <ItemDescription className="flex flex-row items-center gap-1">
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

function renderBonuses(item: EquippableItem | null) {
  if (!item?.statModifiers) return null

  return Object.entries(item.statModifiers)
    .map(([stat, value]) => `${stat.slice(0, 3).toUpperCase()}+${value}`)
    .join(" ")
}

function renderResistances(item: EquippableItem | null) {
  if (!item?.elementalResistances) return null

  return Object.entries(item.elementalResistances).map(([element, value]) => (
    <>
      <ElementIcon
        element={element as ElementType}
        size={16}
        className="-translate-y-0.5"
      />
      {value}{" "}
    </>
  ))
}

interface InventoryItemProps {
  item: EquippableItem | null
  isRemoveButtonShown?: boolean
  onClick?: () => void
  onRemove?: () => void
}

export function InventoryItem({
  item,
  isRemoveButtonShown = false,
  onClick,
  onRemove,
}: InventoryItemProps) {
  const statBonuses = useMemo(() => renderBonuses(item), [item])
  const elementalResistances = useMemo(() => renderResistances(item), [item])

  if (item === null) {
    return (
      <Item variant="muted" asChild className="min-h-17 h-full">
        <a href="#" onClick={onClick}>
          <ItemContent>
            <ItemTitle>Empty Slot</ItemTitle>
          </ItemContent>
          <ItemActions>
            <PlusIcon className="size-4" />
          </ItemActions>
        </a>
      </Item>
    )
  }

  return (
    <Item variant="outline" asChild role="listitem" className="min-h-17 p-2 h-full">
      <a href="#" onClick={onClick}>
        <ItemIcon item={item} size={32} />
        <ItemContent>
          <ItemTitle className="gap-0.5">
            <span>{item.name}</span>
            {item.type === "weapon" && item.element && (
              <ElementIcon element={item.element} size={16} />
            )}
          </ItemTitle>
          {statBonuses && (
            <ItemDescription className="text-xs">{statBonuses}</ItemDescription>
          )}
          {elementalResistances && (
            <ItemDescription className="text-xs">
              RES:{elementalResistances}
            </ItemDescription>
          )}
          {item.type === "weapon" && item.antiDragon && (
            <ItemDescription className="text-xs">Dragon slayer</ItemDescription>
          )}
          {item.description && (
            <ItemDescription className="text-xs">
              {item.description}
            </ItemDescription>
          )}
        </ItemContent>
        {/* {(statBonuses || elementalResistances) && (
          <ItemContent>
          </ItemContent>
        )} */}

        <ItemContent>
          {renderItemStats(item)}
          <ItemDescription className="flex flex-row items-center justify-start gap-1">
            <WeightIcon size={16} />
            {item.weight}
          </ItemDescription>
        </ItemContent>
        {isRemoveButtonShown && (
          <ItemActions>
            <Button
              variant="outline"
              size="icon-xs"
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
