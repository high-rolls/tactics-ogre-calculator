export type ElementType = "air" | "earth" | "fire" | "water" | "holy" | "dark"
export type AlignmentType = "lawful" | "neutral" | "chaotic"
export type WeatherType =
  | "sunny"
  | "cloudy"
  | "light-rain"
  | "rain"
  | "heavy-rain"

export interface ElementalResistances {
  air: number
  earth: number
  fire: number
  water: number
  holy: number
  dark: number
}

export interface CharacterClass {
  name: string
  weatherResistance: 0 | 2 | 4
  physicalResistance: number
  baseResistances: ElementalResistances
}

export interface CharacterStats {
  name: string
  level: number
  element: ElementType
  alignment: AlignmentType
  className: string
  strength: number
  vitality: number
  intelligence: number
  mentality: number
  agility: number
  dexterity: number
  luck: number
  physicalResistance: number
  baseResistances: ElementalResistances
  weatherResistance: 0 | 2 | 4
}

export interface EquippableItem {
  name: string
  weight: number
  type: "weapon" | "armor" | "consumable"
  iconName?: string
}

export interface WeaponStats extends EquippableItem {
  type: "weapon"
  strength: number
  element?: ElementType
}

export interface ArmorStats extends EquippableItem {
  type: "armor"
  physicalResistance: number
  elementalResistances?: Partial<ElementalResistances>
}

export interface ConsumableStats extends EquippableItem {
  type: "consumable"
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

export const CLASS_CATALOG: Record<string, CharacterClass> = {
  archer: {
    name: "Archer",
    weatherResistance: 4,
    physicalResistance: 110,
    baseResistances: {
      air: 100,
      fire: 100,
      earth: 100,
      water: 100,
      holy: 100,
      dark: 95,
    },
  },
  cleric: {
    name: "Cleric",
    weatherResistance: 2,
    physicalResistance: 125,
    baseResistances: {
      air: 95,
      fire: 95,
      earth: 95,
      water: 95,
      holy: 90,
      dark: 100,
    },
  },
  ghost: {
    name: "Ghost",
    weatherResistance: 2,
    physicalResistance: 65,
    baseResistances: {
      air: 110,
      fire: 110,
      earth: 110,
      water: 110,
      holy: 135,
      dark: 85,
    },
  },
  skeleton: {
    name: "Skeleton",
    weatherResistance: 2,
    physicalResistance: 110,
    baseResistances: {
      air: 100,
      fire: 100,
      earth: 100,
      water: 100,
      holy: 125,
      dark: 75,
    },
  },
  siren: {
    name: "Siren",
    weatherResistance: 2,
    physicalResistance: 120,
    baseResistances: {
      air: 100,
      fire: 100,
      earth: 100,
      water: 100,
      holy: 80,
      dark: 80,
    },
  },
  soldier: {
    name: "Soldier",
    weatherResistance: 2,
    physicalResistance: 115,
    baseResistances: {
      air: 100,
      fire: 100,
      earth: 100,
      water: 100,
      holy: 100,
      dark: 100,
    },
  },
  valkyrie: {
    name: "Valkyrie",
    weatherResistance: 4,
    physicalResistance: 110,
    baseResistances: {
      air: 100,
      fire: 100,
      earth: 100,
      water: 100,
      holy: 95,
      dark: 105,
    },
  },
}

export function calculateEquipmentWeight(
  equippedItems: (EquippableItem | null)[]
): number {
  return equippedItems.reduce((total, item) => total + (item?.weight || 0), 0)
}
export function calculateAccuracy(
  character: CharacterStats,
  equippedItems: (EquippableItem | null)[]
): number {
  const baseHit = character.agility + Math.round(character.dexterity / 4)
  const totalWeight = calculateEquipmentWeight(equippedItems)
  return baseHit - totalWeight
}

export function calculateEvasiveness(
  character: CharacterStats,
  equippedItems: (EquippableItem | null)[]
): number {
  const baseEvasion = character.agility + Math.round(character.dexterity / 4)
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
    Math.floor(character.dexterity / 2)
  )
}

export function calculateDefensePower(character: CharacterStats): number {
  return character.vitality + Math.floor(character.strength / 2)
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

  return character.physicalResistance - armorPhysicalResistance
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
  const equippedArmor = equippedItems.filter(
    (item): item is ArmorStats => item?.type === "armor"
  )

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
    const totalArmorRes = equippedArmor.reduce(
      (total, armor) => total + (armor.elementalResistances?.[element] || 0),
      0
    )
    netResistances[element] = character.baseResistances[element] - totalArmorRes
  })

  return netResistances
}
