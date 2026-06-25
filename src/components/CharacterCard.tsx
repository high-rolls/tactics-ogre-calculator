import { Card, CardContent } from "@/components/ui/card"
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
  resolveCharacter,
  SPECIES,
} from "@/utils/combat" // Assuming types are located here
import { ITEM_BY_KEY, ITEM_CATALOG } from "@/utils/items"
import { Field, FieldLabel } from "./ui/field"
import { ElementIcon } from "./ElementIcon"
import { ItemPickerDialog } from "./ItemPickerDialog"
import { useMemo, useState, type ReactNode } from "react"
import { ShieldIcon } from "lucide-react"
import { Separator } from "./ui/separator"

interface CharacterCardProps {
  character: CharacterStats
  onCharacterChange: (updatedCharacter: CharacterStats) => void
}

export function CharacterCard({
  character,
  onCharacterChange,
}: CharacterCardProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const searchedItems = useMemo(
    () =>
      ITEM_CATALOG.filter(
        (item) =>
          item.slot !== null &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  )

  const allowedClasses = useMemo(
    () =>
      Object.values(CLASS_CATALOG).filter(
        (cls) =>
          cls.species === character.species &&
          cls.allowedGenders.includes(character.gender) &&
          cls.allowedAlignments.includes(character.alignment)
      ),
    [character]
  )

  const resolvedCharacter = useMemo(
    () => resolveCharacter(character),
    [character]
  )

  // Helper function to update character attributes dynamically
  const updateAttribute = (
    key: keyof CharacterStats,
    value: string | number | null
  ) => {
    const updated = { ...character, [key]: value }
    if (onCharacterChange) onCharacterChange(updated)
  }

  const equippedItems = useMemo(
    () => character.items.map((key) => (key ? ITEM_BY_KEY[key] : null)),
    [character]
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

  const attackPower = calculateAttackPower(resolvedCharacter, null)
  const magicAttack = calculateMagicAttack(character)
  const accuracy = calculateAccuracy(resolvedCharacter)
  const defensePower = calculateDefensePower(character)
  const magicDefense = calculateMagicDefense(character)
  const specialAttack = calculateSpecialAttack(character)
  const evasiveness = calculateEvasiveness(resolvedCharacter)
  const maximumWT = calculateMaxWT(resolvedCharacter)
  const physicalResistance = calculatePhysicalResistance(resolvedCharacter)
  const elementalResistances =
    calculateNetElementalResistance(resolvedCharacter)

  return (
    <Card className="mx-auto w-full max-w-4xl shadow-md">
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 pt-2 @lg:grid-cols-4">
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
              className="text-sm"
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
                  {allowedClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 @lg:grid-cols-4">
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
        <Separator />
        <div>
          <h2 className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
            Derived Stats
          </h2>
          <div className="grid grid-cols-4 gap-1">
            <StatBox label="Attack Power" value={attackPower} />
            <StatBox label="Magic Power" value={magicAttack} />
            <StatBox label="Special Power" value={specialAttack} />
            <StatBox label="Max WT" value={maximumWT} />
            <StatBox label="Physical Defense" value={defensePower} />
            <StatBox label="Magic Defense" value={magicDefense} />
            <StatBox label="Accuracy" value={accuracy} />
            <StatBox label="Evasion" value={evasiveness} />
          </div>
          <h2 className="mt-4 mb-2 text-xs tracking-wider text-muted-foreground uppercase">
            Resistances
          </h2>
          <div className="grid grid-cols-7 gap-1 text-center">
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
        </div>
        <Separator />
        <div>
          <h2 className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
            Inventory
          </h2>
          <ItemGroup className="grid grid-cols-1 gap-2 @lg:grid-cols-2">
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
        </div>
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
    <div className="flex h-full flex-col items-center justify-center rounded bg-muted/40 p-2 text-center">
      {icon}
      <div className="text-sm font-bold text-foreground">{value}</div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase">
        {label}
      </div>
    </div>
  )
}
