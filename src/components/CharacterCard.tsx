import { PlusIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/reui/number-field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type AlignmentType,
  type CharacterStats,
  type ElementType,
  type EquippableItem,
  ALIGNMENTS,
  CHARACTER_ALLOWED_ELEMENTS,
  CLASS_CATALOG,
} from "@/utils/combat" // Assuming types are located here
import { useState } from "react"
import { ITEM_CATALOG } from "@/utils/itemsMock"

interface CharacterCardProps {
  character: CharacterStats
  onCharacterChange?: (updatedCharacter: CharacterStats) => void
  equippedItems: (EquippableItem | null)[]
  onEquippedItemsChange?: (
    updatedEquippedItems: (EquippableItem | null)[]
  ) => void
}

const getItemIconUrl = (iconName?: string) => {
  if (!iconName) iconName = "placeholder"
  return new URL(`../assets/items/${iconName}.gif`, import.meta.url).href
}

export function CharacterCard({
  character,
  onCharacterChange,
  equippedItems,
  onEquippedItemsChange,
}: CharacterCardProps) {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Helper function to update character attributes dynamically
  const updateAttribute = (
    key: keyof CharacterStats,
    value: string | number | null
  ) => {
    const updated = { ...character, [key]: value }
    if (onCharacterChange) onCharacterChange(updated)
  }

  const handleSelectItem = (newItem: EquippableItem | null) => {
    const newEquippedItems = equippedItems.map((oldItem, index) => {
      if (index === activeSlotIndex) return newItem
      return oldItem
    })
    if (onEquippedItemsChange) onEquippedItemsChange(newEquippedItems)
    setActiveSlotIndex(null)
    setSearchTerm("")
  }

  const handleClassChange = (newClassName: string) => {
    const selectedClass = CLASS_CATALOG[newClassName]
    if (!selectedClass || !onCharacterChange) return

    const updatedCharacter = {
      ...character,
      className: newClassName,
      weatherResistance: selectedClass.weatherResistance,
      physicalResistance: selectedClass.physicalResistance,
      baseResistances: { ...selectedClass.baseResistances },
    }

    onCharacterChange(updatedCharacter)
  }

  // List of attributes to loop through for the grid (excluding non-number fields)
  const numericAttributes: { key: keyof CharacterStats; label: string }[] = [
    { key: "level", label: "Level" },
    { key: "strength", label: "Strength" },
    { key: "vitality", label: "Vitality" },
    { key: "intelligence", label: "Intelligence" },
    { key: "mentality", label: "Mentality" },
    { key: "agility", label: "Agility" },
    { key: "dexterity", label: "Dexterity" },
    { key: "luck", label: "Luck" },
  ]

  const searchedItems = ITEM_CATALOG.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const weaponsList = searchedItems.filter((item) => item.type === "weapon")
  const armorList = searchedItems.filter((item) => item.type === "armor")
  const consumablesList = searchedItems.filter(
    (item) => item.type === "consumable"
  )

  return (
    <Dialog
      open={activeSlotIndex !== null}
      onOpenChange={(open) => {
        if (!open) setActiveSlotIndex(null)
      }}
    >
      <Card className="mx-auto w-full max-w-sm shadow-md">
        {/* Editable Header */}
        <CardHeader className="space-y-1 border-b pb-4">
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <Label
                className="text-xs tracking-wider text-muted-foreground uppercase"
              >
                Character Name
              </Label>
              <Input
                value={character.name}
                onChange={(e) => updateAttribute("name", e.target.value)}
                placeholder="Enter character name..."
              />
            </div>
            <div className="flex flex-col">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Class Tier
              </Label>
              <Select
                value={character.className}
                onValueChange={(newClassName) =>
                  handleClassChange(newClassName)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {Object.entries(CLASS_CATALOG).map(([key, value]) => (
                      <SelectItem value={key}>{value.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Affinity Element
              </Label>
              <Select
                value={character.element}
                onValueChange={(val) =>
                  updateAttribute("element", val as ElementType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CHARACTER_ALLOWED_ELEMENTS.map((el) => (
                      <SelectItem
                        key={el.key}
                        value={el.key}
                        className="text-xs"
                      >
                        {el.icon} {el.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Moral Alignment
              </Label>
              <Select
                value={character.alignment}
                onValueChange={(val) =>
                  updateAttribute("alignment", val as AlignmentType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ALIGNMENTS.map((al) => (
                      <SelectItem
                        key={al.key}
                        value={al.key}
                        className="text-xs"
                      >
                        {al.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {/* Attributes Grid */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {numericAttributes.map(({ key, label }) => (
              <div key={key} className="flex flex-col space-y-1.5">
                <NumberField
                  value={character[key] as number}
                  onValueChange={(val) => updateAttribute(key, val)}
                  min={1}
                  max={999}
                >
                  <NumberFieldScrubArea label={label} />
                  <NumberFieldGroup className="w-full">
                    <NumberFieldDecrement />
                    <NumberFieldInput className="w-full text-center" />
                    <NumberFieldIncrement />
                  </NumberFieldGroup>
                </NumberField>
              </div>
            ))}
          </div>
          <h2 className="mt-4 mb-2 text-xs tracking-wider text-muted-foreground uppercase">
            Inventory
          </h2>
          <div className="flex flex-col gap-y-2">
            {[0, 1, 2, 3].map((slotIndex) => {
              const item = equippedItems[slotIndex]

              if (item) {
                return (
                  <div
                    className="flex w-full max-w-md cursor-pointer flex-col gap-4"
                    onClick={() => setActiveSlotIndex(slotIndex)}
                  >
                    <Item variant="outline" asChild>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveSlotIndex(slotIndex)
                        }}
                      >
                        <ItemMedia>
                          <Avatar>
                            <AvatarImage
                              src={getItemIconUrl(item.iconName)}
                              style={{ imageRendering: "pixelated" }}
                            />
                            <AvatarFallback>
                              {item.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{item.name}</ItemTitle>
                          <ItemDescription>
                            Weight: {item.weight}
                            {item.type === "weapon" && "strength" in item && (
                              <> | Strength: +{item.strength}</>
                            )}
                            {item.type === "armor" &&
                              "physicalResistance" in item && (
                                <> | Armor: +{item.physicalResistance}</>
                              )}
                          </ItemDescription>
                        </ItemContent>
                      </a>
                    </Item>
                  </div>
                )
              }
              return (
                <div
                  className="flex w-full max-w-md cursor-pointer flex-col gap-4"
                  onClick={() => setActiveSlotIndex(slotIndex)}
                >
                  <Item variant="outline" asChild>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveSlotIndex(slotIndex)
                      }}
                    >
                      <ItemContent>
                        <ItemTitle>Slot {slotIndex + 1}</ItemTitle>
                        <ItemDescription>Empty Slot</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <PlusIcon className="size-4" />
                      </ItemActions>
                    </a>
                  </Item>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="gap-3">
          <DialogTitle>
            Editing Slot #{activeSlotIndex !== null ? activeSlotIndex + 1 : "?"}
          </DialogTitle>
          <Button variant="destructive" onClick={() => handleSelectItem(null)}>
            Remove Item
          </Button>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Type the item's name..."
          ></Input>
        </DialogHeader>
        <Tabs defaultValue="weapon">
          <TabsList>
            <TabsTrigger value="weapon">Weapons</TabsTrigger>
            <TabsTrigger value="armor">Armor</TabsTrigger>
            <TabsTrigger value="consumable">Consumables</TabsTrigger>
          </TabsList>
          <TabsContent
            value="weapon"
            className="-mx-4 max-h-[50vh] scrollbar-thumb-amber-100 overflow-y-auto px-4"
          >
            <ItemGroup className="gap-2">
              {weaponsList.map((weapon) => (
                <Item key={weapon.name} variant="outline" asChild>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSelectItem(weapon)
                    }}
                  >
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage
                          src={getItemIconUrl(weapon.iconName)}
                          style={{ imageRendering: "pixelated" }}
                        />
                        <AvatarFallback>{weapon.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{weapon.name}</ItemTitle>
                      <ItemDescription>
                        Weight: {weapon.weight} | Strength: +{weapon.strength}
                      </ItemDescription>
                    </ItemContent>
                  </a>
                </Item>
              ))}
            </ItemGroup>
            {weaponsList.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No weapons found.
              </p>
            )}
          </TabsContent>
          <TabsContent
            value="armor"
            className="-mx-4 max-h-[50vh] scrollbar-thumb-amber-100 overflow-y-auto px-4"
          >
            <ItemGroup className="max-w-sm gap-2">
              {armorList.map((armor) => (
                <Item key={armor.name} variant="outline" asChild>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSelectItem(armor)
                    }}
                  >
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage
                          src={getItemIconUrl(armor.iconName)}
                          style={{ imageRendering: "pixelated" }}
                        />
                        <AvatarFallback>{armor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{armor.name}</ItemTitle>
                      <ItemDescription>
                        Weight: {armor.weight} | Armor: +
                        {armor.physicalResistance}
                      </ItemDescription>
                    </ItemContent>
                  </a>
                </Item>
              ))}
            </ItemGroup>
            {armorList.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No armor found.
              </p>
            )}
          </TabsContent>
          <TabsContent
            value="consumable"
            className="-mx-4 max-h-[50vh] scrollbar-thumb-amber-100 overflow-y-auto px-4"
          >
            <ItemGroup className="max-w-sm gap-2">
              {consumablesList.map((consumable) => (
                <Item key={consumable.name} variant="outline" asChild>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSelectItem(consumable)
                    }}
                  >
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage
                          src={getItemIconUrl(consumable.iconName)}
                          style={{ imageRendering: "pixelated" }}
                        />
                        <AvatarFallback>
                          {consumable.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{consumable.name}</ItemTitle>
                      <ItemDescription>
                        Weight: {consumable.weight}
                      </ItemDescription>
                    </ItemContent>
                  </a>
                </Item>
              ))}
            </ItemGroup>
            {consumablesList.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No items found.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
