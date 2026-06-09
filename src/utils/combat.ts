export type ElementType = "air" | "earth" | "fire" | "water" | "holy" | "dark"
export type AlignmentType = "lawful" | "neutral" | "chaotic"
export type SpeciesType = "human" | "beast" | "dragon" | "giant" | "aquatic"
export type GenderType = "male" | "female"
export type MovementType =
  | "fast"
  | "fast-acrobatic"
  | "slow"
  | "on-water"
  | "underwater"
  | "lava"
  | "float"
  | "fly"
  | "warp"
export type WeatherType =
  | "sunny"
  | "cloudy"
  | "light-rain"
  | "rain"
  | "heavy-rain"
export type ItemSlotType = "head" | "hands" | "body" | "feet" | "bag"
export type WeaponCategoryType =
  | "sword"
  | "axe"
  | "spear"
  | "hammer"
  | "claw"
  | "fan"
  | "staff"
  | "whip"
  | "gun"
  | "bow"
  | "crossbow"

export interface ElementalResistances {
  air: number
  earth: number
  fire: number
  water: number
  holy: number
  dark: number
}

export interface CharacterClass {
  id: number
  name: string
  species: SpeciesType
  allowedGenders: GenderType[]
  allowedAlignments: AlignmentType[]
  weatherResistance: 0 | 2 | 4
  weightPenalty: number
  preferredWeaponCategory?: WeaponCategoryType
  movementTypes: MovementType[]
  physicalResistance: number
  baseResistances: ElementalResistances
}

export interface CharacterStats {
  name: string
  species: SpeciesType
  gender: GenderType
  element: ElementType
  alignment: AlignmentType
  class: CharacterClass
  level: number
  strength: number
  vitality: number
  intelligence: number
  mentality: number
  agility: number
  dexterity: number
  luck: number
}

export interface StatModifiers {
  strength?: number
  vitality?: number
  intelligence?: number
  mentality?: number
  agility?: number
  dexterity?: number
  luck?: number
}

export interface EquippableItem {
  type: "weapon" | "armor" | "consumable"
  name: string
  weight: number
  iconName?: string
  slot: ItemSlotType
  handsRequired: number
  statModifiers?: StatModifiers
  elementalResistances?: Partial<ElementalResistances>
}

export interface WeaponStats extends EquippableItem {
  type: "weapon"
  slot: "hands"
  category: WeaponCategoryType
  strength: number
  element?: ElementType
}

export interface ArmorStats extends EquippableItem {
  type: "armor"
  physicalResistance: number
}

export interface ConsumableStats extends EquippableItem {
  type: "consumable"
  slot: "bag"
}

export interface ElementalModifiers {
  water: number
  earth: number
  fire: number
  air: number
}

export interface TerrainStats {
  name: string
  attackModifier: number
  defenseModifier: number
  elementalModifiers: Partial<ElementalModifiers>
}

export const WEATHER_ALIGNMENT_MODIFIERS: Record<
  WeatherType,
  Record<AlignmentType, number>
> = {
  sunny: {
    neutral: 0,
    lawful: 1,
    chaotic: -3,
  },
  cloudy: {
    neutral: 0,
    lawful: 0,
    chaotic: -2,
  },
  "light-rain": {
    neutral: 0,
    lawful: -1,
    chaotic: -1,
  },
  rain: {
    neutral: 0,
    lawful: -2,
    chaotic: 0,
  },
  "heavy-rain": {
    neutral: 0,
    lawful: -3,
    chaotic: 1,
  },
}

export const SPECIES: { key: SpeciesType; label: string }[] = [
  { key: "human", label: "Human" },
]

export const GENDERS: { key: GenderType; label: string }[] = [
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
]

export const ALIGNMENTS: { key: AlignmentType; label: string }[] = [
  { key: "lawful", label: "Lawful" },
  { key: "neutral", label: "Neutral" },
  { key: "chaotic", label: "Chaotic" },
]

export const ELEMENTS: { key: ElementType; label: string; icon: string }[] = [
  { key: "air", label: "Air", icon: "💨" },
  { key: "earth", label: "Earth", icon: "🌱" },
  { key: "fire", label: "Fire", icon: "🔥" },
  { key: "water", label: "Water", icon: "💧" },
  { key: "holy", label: "Holy", icon: "🕊️" },
  { key: "dark", label: "Dark", icon: "💀" },
]

export const CHARACTER_ALLOWED_ELEMENTS = ELEMENTS.filter(
  (el) => el.key !== "holy" && el.key !== "dark"
)

export function calculateEquipmentWeight(
  equippedItems: (EquippableItem | null)[]
): number {
  return equippedItems.reduce((total, item) => total + (item?.weight || 0), 0)
}

export function getAdjustedStats(
  character: CharacterStats,
  equippedItems: (EquippableItem | null)[]
): CharacterStats {
  const statKeys: (keyof StatModifiers)[] = [
    "strength",
    "vitality",
    "intelligence",
    "mentality",
    "agility",
    "dexterity",
    "luck",
  ]
  const adjusted = { ...character }
  statKeys.forEach((stat) => {
    const totalStatModifier = equippedItems.reduce(
      (total, item) => total + (item?.statModifiers?.[stat] || 0),
      0
    )
    adjusted[stat] += totalStatModifier
  })
  return adjusted
}

export function calculateAccuracy(
  character: CharacterStats,
  equippedItems: (EquippableItem | null)[]
): number {
  const baseHit = character.agility + ((character.dexterity + 2) >> 2)
  const totalWeight = calculateEquipmentWeight(equippedItems)
  return baseHit - totalWeight
}

export function calculateEvasiveness(
  character: CharacterStats,
  equippedItems: (EquippableItem | null)[]
): number {
  const baseEvasion = character.agility + ((character.dexterity + 2) >> 2)
  const totalWeight = calculateEquipmentWeight(equippedItems)
  return baseEvasion - totalWeight
}

export function calculateAttackPower(
  character: CharacterStats,
  equippedWeapon: WeaponStats | null
): number {
  return (
    character.strength +
    (equippedWeapon?.strength || 0) +
    ((character.dexterity + 1) >> 1)
  )
}

export function calculateMagicAttack(character: CharacterStats): number {
  return character.intelligence + ((character.mentality + 1) >> 1)
}

export function calculateDefensePower(character: CharacterStats): number {
  return character.vitality + ((character.strength + 1) >> 1)
}

export function calculateMagicDefense(character: CharacterStats): number {
  return character.vitality + ((character.mentality + 1) >> 1)
}

export function calculatePhysicalResistance(
  character: CharacterStats,
  equippedItems: (EquippableItem | null)[]
): number {
  const equippedArmor: ArmorStats[] = equippedItems.filter(
    (item): item is ArmorStats => item?.type == "armor"
  )

  const armorPhysicalResistance = equippedArmor.reduce(
    (total, armor) => total + armor.physicalResistance,
    0
  )

  return character.class.physicalResistance - armorPhysicalResistance
}

export function getWeapons(
  equippedItems: (EquippableItem | null)[]
): WeaponStats[] {
  const weapons: WeaponStats[] = equippedItems.filter(
    (item): item is WeaponStats => item?.type == "weapon"
  )
  return weapons
}

export function calculateElementalMatchup(
  element: ElementType,
  otherElement: ElementType
): number {
  if (element === otherElement) return -1
  if (element === "air" && otherElement === "earth") return 1
  if (element === "earth" && otherElement === "air") return 1
  if (element === "fire" && otherElement === "water") return 1
  if (element === "water" && otherElement === "fire") return 1
  if (element === "holy" && otherElement === "dark") return 1
  if (element === "dark" && otherElement === "holy") return 1
  return 0
}

export function calculateNetElementalResistance(
  character: CharacterStats,
  equippedItems: (EquippableItem | null)[]
): ElementalResistances {
  const elements: (keyof ElementalResistances)[] = [
    "air",
    "earth",
    "fire",
    "water",
    "holy",
    "dark",
  ]

  const netResistances = {} as ElementalResistances

  elements.forEach((element) => {
    const totalResistance = equippedItems.reduce(
      (total, item) => total + (item?.elementalResistances?.[element] || 0),
      0
    )
    netResistances[element] =
      character.class.baseResistances[element] - totalResistance
  })

  return netResistances
}
