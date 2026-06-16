import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ItemGroup } from "@/components/ui/item"
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
  calculateNetElementalResistance,
  calculatePhysicalResistance,
  calculateSpecialAttack,
  CHARACTER_ALLOWED_ELEMENTS,
  ELEMENTS,
  FACTIONS,
  GENDERS,
  getAdjustedStats,
  SPECIES,
} from "@/utils/combat" // Assuming types are located here
import { ITEM_BY_KEY, ITEM_CATALOG } from "@/utils/items"
import { Field, FieldLabel } from "./ui/field"
import { ElementIcon } from "./ElementIcon"
import { ItemPickerDialog } from "./ItemPickerDialog"
import { useMemo, useState, type ReactNode } from "react"
import { ShieldIcon } from "lucide-react"

interface CharacterCardProps {
  character: ResolvedCharacter
  onCharacterChange: (updatedCharacter: CharacterStats) => void
}

export function CharacterCard({
  character,
  onCharacterChange,
}: CharacterCardProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const searchedItems = useMemo(
    () =>
      ITEM_CATALOG.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  )

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
  const physicalResistance = calculatePhysicalResistance(
    adjustedCharacter,
    equippedItems
  )
  const elementalResistances = calculateNetElementalResistance(
    adjustedCharacter,
    equippedItems
  )

  return (
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
                    <SelectItem key={fa.key} value={fa.key} className="text-xs">
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
                    <SelectItem key={sp.key} value={sp.key} className="text-xs">
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
                    <SelectItem key={ge.key} value={ge.key} className="text-xs">
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
                    <SelectItem key={el.key} value={el.key} className="text-xs">
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
                    <SelectItem key={al.key} value={al.key} className="text-xs">
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
        <div className="grid grid-cols-4 gap-2 border-t pt-4">
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
          Resistances
        </h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          <StatBox
            label="Phys."
            value={physicalResistance}
            icon={<ShieldIcon className="text-muted-foreground" size={16} />}
          />
          {ELEMENTS.map(({ key, label }) => (
            <StatBox
              key={key}
              label={label}
              value={elementalResistances[key]}
              icon={<ElementIcon element={key} size={16} />}
            />
          ))}
        </div>
        <h2 className="mt-4 mb-2 text-xs tracking-wider text-muted-foreground uppercase">
          Inventory
        </h2>
        <ItemGroup className="md:grid md:grid-cols-2">
          {[0, 1, 2, 3].map((slotIndex) => {
            const item = equippedItems[slotIndex]

            return (
              <ItemPickerDialog
                key={slotIndex}
                item={item}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                searchedItems={searchedItems}
                onItemSelected={(itemKey) => setItem(slotIndex, itemKey)}
                onItemRemoved={() => setItem(slotIndex, null)}
              />
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

interface StatBoxProps {
  label: string
  value: number
  icon?: ReactNode
}

function StatBox({ label, value, icon }: StatBoxProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded bg-muted/40 p-2">
      {icon}
      <div className="text-sm font-bold text-foreground">{value}</div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase">
        {label}
      </div>
    </div>
  )
}
