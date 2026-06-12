import { PlusIcon } from "lucide-react"

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
  ItemTitle,
} from "@/components/ui/item"
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
import { CLASS_CATALOG } from "@/utils/classes"
import {
  type AlignmentType,
  type CharacterStats,
  type ElementType,
  type FactionType,
  type GenderType,
  type ItemKey,
  type ItemSlotType,
  type ResolvedCharacter,
  type SpeciesType,
  ALIGNMENTS,
  calculateAccuracy,
  calculateAttackPower,
  calculateDefensePower,
  calculateEvasiveness,
  calculateMagicAttack,
  calculateMagicDefense,
  calculateMaxWT,
  calculateSpecialAttack,
  CHARACTER_ALLOWED_ELEMENTS,
  FACTIONS,
  GENDERS,
  getAdjustedStats,
  SPECIES,
} from "@/utils/combat" // Assuming types are located here
import { useState } from "react"
import { ITEM_BY_KEY, ITEM_CATALOG } from "@/utils/items"
import { Field, FieldLabel } from "./ui/field"
import { InventoryItem } from "./InventoryItem"
import { ElementIcon } from "./ElementIcon"

interface CharacterCardProps {
  character: ResolvedCharacter
  onCharacterChange: (updatedCharacter: CharacterStats) => void
}

export function CharacterCard({
  character,
  onCharacterChange,
}: CharacterCardProps) {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0)
  const [showItemSelection, setShowItemSelection] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Helper function to update character attributes dynamically
  const updateAttribute = (
    key: keyof CharacterStats,
    value: string | number | null
  ) => {
    const updated = { ...character, [key]: value }
    if (onCharacterChange) onCharacterChange(updated)
  }

  const equippedItems = character.items.map((key) =>
    key ? ITEM_BY_KEY[key] : null
  )

  const setItem = (slotIndex: number, newItem: ItemKey | null) => {
    const updatedItems = character.items.map((oldItem, index) =>
      index === slotIndex ? newItem : oldItem
    )
    onCharacterChange({ ...character, items: updatedItems })
  }

  const handleSelectItem = (selectedItem: ItemKey) => {
    setItem(activeSlotIndex, selectedItem)
    setShowItemSelection(false)
  }

  const handleClassChange = (classId: string) => {
    const selectedClass = Object.values(CLASS_CATALOG).find(
      (cls) => cls.id === Number(classId)
    )

    if (!selectedClass || !onCharacterChange) return

    onCharacterChange({
      ...character,
      classId: Number(classId),
    })
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

  const adjustedCharacter = getAdjustedStats(character, equippedItems)
  const attackPower = calculateAttackPower(adjustedCharacter, null)
  const magicAttack = calculateMagicAttack(adjustedCharacter)
  const accuracy = calculateAccuracy(adjustedCharacter, equippedItems)
  const defensePower = calculateDefensePower(adjustedCharacter)
  const magicDefense = calculateMagicDefense(adjustedCharacter)
  const specialAttack = calculateSpecialAttack(adjustedCharacter)
  const evasiveness = calculateEvasiveness(adjustedCharacter, equippedItems)
  const maximumWT = calculateMaxWT(
    adjustedCharacter as ResolvedCharacter,
    equippedItems
  )

  const searchedItems = ITEM_CATALOG.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const itemSlotTabs: ItemSlotType[] = ["hands", "head", "body", "feet", "bag"]

  return (
    <Dialog open={showItemSelection}>
      <Card className="mx-auto w-full max-w-sm shadow-md md:max-w-4xl lg:min-w-xl">
        {/* Editable Header */}
        <CardHeader className="space-y-1 border-b pb-4">
          <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4">
            <Field>
              <FieldLabel>Faction</FieldLabel>
              <Select
                value={character.faction}
                onValueChange={(val) =>
                  updateAttribute("faction", val as FactionType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FACTIONS.map((fa) => (
                      <SelectItem
                        key={fa.key}
                        value={fa.key}
                        className="text-xs"
                      >
                        {fa.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <NumberField
              value={
                character.faction === "player" ? character.rosterNumber : null
              }
              onValueChange={(val) => updateAttribute("rosterNumber", val)}
              min={1}
              max={999}
              disabled={character.faction !== "player"}
            >
              <NumberFieldScrubArea label="Number" className="text- text-xs" />
              <NumberFieldGroup className="w-full">
                <NumberFieldDecrement />
                <NumberFieldInput className="w-full text-center" />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={character.name}
                onChange={(e) => updateAttribute("name", e.target.value)}
                placeholder="Enter character name..."
              />
            </Field>
            <Field>
              <FieldLabel>Species</FieldLabel>
              <Select
                value={character.species}
                onValueChange={(val) =>
                  updateAttribute("species", val as SpeciesType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SPECIES.map((sp) => (
                      <SelectItem
                        key={sp.key}
                        value={sp.key}
                        className="text-xs"
                      >
                        {sp.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Gender</FieldLabel>
              <Select
                value={character.gender}
                onValueChange={(val) =>
                  updateAttribute("gender", val as GenderType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {GENDERS.map((ge) => (
                      <SelectItem
                        key={ge.key}
                        value={ge.key}
                        className="text-xs"
                      >
                        {ge.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Element</FieldLabel>
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
                        {el.label} <ElementIcon element={el.key} />
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Alignment</FieldLabel>
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
            </Field>
            <Field>
              <FieldLabel>Class</FieldLabel>
              <Select
                value={character.classId.toString()}
                onValueChange={handleClassChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {Object.values(CLASS_CATALOG).map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardHeader>

        {/* Attributes Grid */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
            {numericAttributes.map(({ key, label }) => (
              <NumberField
                key={key}
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
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 border-t pt-4 text-center">
            <StatBox label="Attack Power" value={attackPower} />
            <StatBox label="Magic Power" value={magicAttack} />
            <StatBox label="Special Power" value={specialAttack} />
            <StatBox label="Max WT" value={maximumWT} />
            <StatBox label="Physical Defense" value={defensePower} />
            <StatBox label="Magic Defense" value={magicDefense} />
            <StatBox label="Accuracy" value={accuracy} />
            <StatBox label="Evasiveness" value={evasiveness} />
          </div>
          <h2 className="mt-4 mb-2 text-xs tracking-wider text-muted-foreground uppercase">
            Inventory
          </h2>
          <ItemGroup className="md:grid md:grid-cols-2">
            {[0, 1, 2, 3].map((slotIndex) => {
              const item = equippedItems[slotIndex]

              if (item) {
                return (
                  <InventoryItem
                    key={slotIndex}
                    item={item}
                    onClick={() => {
                      setActiveSlotIndex(slotIndex)
                      setShowItemSelection(true)
                    }}
                    isRemoveButtonShown={true}
                    onRemove={() => setItem(slotIndex, null)}
                  />
                )
              }
              return (
                <Item key={slotIndex} variant="muted" asChild>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveSlotIndex(slotIndex)
                      setShowItemSelection(true)
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
              )
            })}
          </ItemGroup>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-sm md:max-w-2xl lg:max-w-4xl">
        <DialogHeader className="gap-3">
          <DialogTitle>
            Editing Slot #{activeSlotIndex !== null ? activeSlotIndex + 1 : "?"}
          </DialogTitle>
        </DialogHeader>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search item..."
        ></Input>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hands">Hands</TabsTrigger>
            <TabsTrigger value="head">Head</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="feet">Feet</TabsTrigger>
            <TabsTrigger value="bag">Bag</TabsTrigger>
          </TabsList>
          <TabsContent
            value="all"
            className="-mx-4 max-h-[70vh] scrollbar-thumb-amber-100 overflow-y-auto px-4"
          >
            <ItemGroup className="gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
              {searchedItems.map((item) => (
                <InventoryItem
                  key={item.key}
                  item={item}
                  onClick={() => handleSelectItem(item.key)}
                />
              ))}
            </ItemGroup>
            {searchedItems.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No item found.
              </p>
            )}
          </TabsContent>
          {itemSlotTabs.map((itemSlot: ItemSlotType) => (
            <TabsContent
              key={itemSlot}
              value={itemSlot}
              className="-mx-4 max-h-[70vh] scrollbar-thumb-amber-100 overflow-y-auto px-4"
            >
              <ItemGroup className="gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
                {searchedItems
                  .filter((item) => item.slot === itemSlot)
                  .map((item) => (
                    <InventoryItem
                      key={item.key}
                      item={item}
                      onClick={() => handleSelectItem(item.key)}
                    />
                  ))}
              </ItemGroup>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

interface StatBoxProps {
  label: string
  value: number
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="rounded bg-muted/40 p-2">
      <div className="text-sm font-bold text-foreground">{value}</div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase">
        {label}
      </div>
    </div>
  )
}
