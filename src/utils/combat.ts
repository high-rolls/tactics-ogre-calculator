import { CLASS_CATALOG } from "./classes"
import { ITEM_BY_KEY, type ITEM_CATALOG } from "./items"

export type ElementType = "wind" | "earth" | "fire" | "water" | "holy" | "dark"
export type FactionType = "player" | "enemy" | "guest"
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
  | "blowgun"
export type SkillSetType =
  | "valkyrie"
  | "wizard"
  | "shaman"
  | "lich"
  | "witch"
  | "warlock"
  | "exorcist"
  | "cleric"
  | "priest"
export type SpecialTraitType =
  | "attack-plus"
  | "anti-dragon"
  | "fear"
  | "beast-support"
  | "giant-support"
  | "dragon-support"
  | "gunnery"
  | "undead"
export type AttackDirection = "front" | "side" | "back"

export type ItemKey = (typeof ITEM_CATALOG)[number]["key"]

export interface ElementalResistances {
  wind: number
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
  skillSlots?: number
  skillSet?: SkillSetType
  specialTraits?: SpecialTraitType[]
  indirectAttack?: ItemKey
}

export interface CharacterStats {
  id: string
  rosterNumber?: number
  faction: FactionType
  name: string
  species: SpeciesType
  gender: GenderType
  element: ElementType
  alignment: AlignmentType
  classId: number
  level: number
  strength: number
  vitality: number
  intelligence: number
  mentality: number
  agility: number
  dexterity: number
  luck: number
  antiDragon?: boolean
  items: (ItemKey | null)[]
}

export interface ResolvedCharacter extends CharacterStats {
  class: CharacterClass
  equippedItems: (EquippableItem | null)[]
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

export interface BaseItem {
  type: "weapon" | "armor" | "consumable"
  key: string
  name: string
  description?: string
  weight: number
  slot: ItemSlotType | null
  handsRequired: number
  statModifiers?: StatModifiers
  elementalResistances?: Partial<ElementalResistances>
}

export interface WeaponStats extends BaseItem {
  type: "weapon"
  slot: "hands" | null
  category: WeaponCategoryType
  strength: number
  element?: ElementType
  antiDragon?: boolean
  multiplier?: number
  roundingFunction?: (_: number) => number
}

export interface Skill {
  name: string
  type: "damage" | "ailment" | "support" | "healing"
  element: ElementType
  alignment: AlignmentType
  mpCost: number
  skillSets: SkillSetType[]
}

const INDIRECT_WEAPON_CATEGORIES = new Set<WeaponCategoryType>([
  "bow",
  "crossbow",
  "gun",
])

export interface ArmorStats extends BaseItem {
  type: "armor"
  physicalResistance: number
}

export interface ConsumableStats extends BaseItem {
  type: "consumable"
  slot: "bag"
}

export type EquippableItem = WeaponStats | ArmorStats | ConsumableStats

export interface ElementalModifiers {
  water: number
  earth: number
  fire: number
  wind: number
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

const DIRECTION_MODIFIERS: Record<AttackDirection, number> = {
  front: 0,
  side: 25,
  back: 50,
}

export const FACTIONS: { key: FactionType; label: string }[] = [
  { key: "player", label: "Player" },
  { key: "enemy", label: "Enemy" },
  { key: "guest", label: "Guest" },
]

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

export const ELEMENTS: { key: ElementType; label: string }[] = [
  { key: "wind", label: "Wind" },
  { key: "earth", label: "Earth" },
  { key: "fire", label: "Fire" },
  { key: "water", label: "Water" },
  { key: "holy", label: "Holy" },
  { key: "dark", label: "Dark" },
]

export const CHARACTER_ALLOWED_ELEMENTS = ELEMENTS.filter(
  (el) => el.key !== "holy" && el.key !== "dark"
)

export function isIndirectWeapon(category: WeaponCategoryType): boolean {
  return INDIRECT_WEAPON_CATEGORIES.has(category)
}

// Enriches the character stats, resolving the class and equipped items objects
export function resolveCharacter(character: CharacterStats): ResolvedCharacter {
  const classData = Object.values(CLASS_CATALOG).find(
    (c) => c.id === character.classId
  )

  if (!classData) {
    throw new Error(`Unknown class id ${character.classId}`)
  }

  const equippedItems = character.items.map((key) =>
    key ? ITEM_BY_KEY[key] : null
  )

  return {
    ...character,
    class: classData,
    equippedItems: equippedItems,
  }
}

export function calculateEquipmentWeight(
  equippedItems: (EquippableItem | null)[]
): number {
  return equippedItems.reduce((total, item) => total + (item?.weight || 0), 0)
}

export function applyEquipmentStats(
  character: ResolvedCharacter
): ResolvedCharacter {
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
    const totalStatModifier = character.equippedItems.reduce(
      (total, item) => total + (item?.statModifiers?.[stat] || 0),
      0
    )
    adjusted[stat] += totalStatModifier
  })
  return adjusted
}

export function calculateAccuracy(character: ResolvedCharacter): number {
  const baseHit = character.agility + ((character.dexterity + 2) >> 2)
  const totalWeight = calculateEquipmentWeight(character.equippedItems)
  return baseHit - totalWeight
}

export function calculateEvasiveness(character: ResolvedCharacter): number {
  const baseEvasion = character.agility + ((character.dexterity + 2) >> 2)
  const totalWeight = calculateEquipmentWeight(character.equippedItems)
  return baseEvasion - totalWeight
}

export function calculateAttackPower(
  character: ResolvedCharacter,
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

export function calculateSpecialAttack(character: CharacterStats): number {
  return ((3 * character.mentality + 1) >> 1) + ((character.strength + 1) >> 1)
}

export function calculatePhysicalResistance(
  character: ResolvedCharacter
): number {
  const equippedArmor: ArmorStats[] = character.equippedItems.filter(
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
  if (element === "wind" && otherElement === "earth") return 1
  if (element === "earth" && otherElement === "wind") return 1
  if (element === "fire" && otherElement === "water") return 1
  if (element === "water" && otherElement === "fire") return 1
  if (element === "holy" && otherElement === "dark") return 1
  if (element === "dark" && otherElement === "holy") return 1
  return 0
}

export function calculateNetElementalResistance(
  character: ResolvedCharacter
): ElementalResistances {
  const elements: (keyof ElementalResistances)[] = [
    "wind",
    "earth",
    "fire",
    "water",
    "holy",
    "dark",
  ]

  const netResistances = {} as ElementalResistances

  elements.forEach((element) => {
    const totalResistance = character.equippedItems.reduce(
      (total, item) => total + (item?.elementalResistances?.[element] || 0),
      0
    )
    netResistances[element] =
      character.class.baseResistances[element] - totalResistance
  })

  return netResistances
}

export function calculateMaxWT(character: ResolvedCharacter) {
  const equipmentWeight = calculateEquipmentWeight(character.equippedItems)
  return (
    510 - character.agility + equipmentWeight + character.class.weightPenalty
  )
}

export function calculateCharacterCorrection(
  character: ResolvedCharacter,
  terrain: TerrainStats,
  weather: WeatherType,
  isAttacker: boolean,
  withWeatherResistance: boolean = true
): number {
  const terrainModifier = isAttacker
    ? terrain.attackModifier
    : terrain.defenseModifier

  const terrainElementalModifier =
    character.element in terrain.elementalModifiers
      ? terrain.elementalModifiers[
          character.element as keyof ElementalModifiers
        ] || 0
      : 0

  const weatherModifier =
    WEATHER_ALIGNMENT_MODIFIERS[weather][character.alignment]

  return (
    50 +
    terrainModifier +
    terrainElementalModifier +
    weatherModifier +
    (withWeatherResistance ? character.class.weatherResistance : 0)
  )
}

export function calculateWeaponCorrection(
  character: ResolvedCharacter,
  weapon: WeaponStats
): number {
  const weaponElementalModifier =
    weapon?.element !== undefined
      ? -10 * calculateElementalMatchup(weapon.element, character.element)
      : 0

  const preferredWeaponBonus =
    character.class.preferredWeaponCategory === weapon?.category ? 3 : 0

  const antiDragonBonus =
    (character.antiDragon ? 8 : 0) + (weapon?.antiDragon ? 8 : 0)

  return weaponElementalModifier + preferredWeaponBonus + antiDragonBonus
}

export function calculateHitChance(
  attacker: ResolvedCharacter,
  defender: ResolvedCharacter,
  attackCorrection: number,
  defenseCorrection: number,
  attackDirection: AttackDirection
) {
  const attackerAccuracy = calculateAccuracy(attacker)
  const defenderEvasiveness = calculateEvasiveness(defender)
  const sideModifier = DIRECTION_MODIFIERS[attackDirection]
  return Math.max(
    1,
    Math.min(
      100,
      Math.trunc((attackerAccuracy * attackCorrection) / 100) -
        Math.trunc((defenderEvasiveness * defenseCorrection) / 100) +
        attacker.luck -
        defender.luck +
        50 +
        sideModifier
    )
  )
}

interface CalculateDamageProps {
  attacker: ResolvedCharacter
  defender: ResolvedCharacter
  attackerCorrection: number
  defenderCorrection: number
  weapon: WeaponStats
}

export function calculateDamage({
  attacker,
  defender,
  attackerCorrection,
  defenderCorrection,
  weapon,
}: CalculateDamageProps) {
  const attackPower = calculateAttackPower(attacker, weapon)
  const weaponCorrection = calculateWeaponCorrection(attacker, weapon)
  const attackCorrection = Math.max(0, Math.min(200, attackerCorrection + weaponCorrection))
  const defensePower = calculateDefensePower(defender)
  const defenseCorrection = Math.max(0, Math.min(200, defenderCorrection))
  const defenderResistance = weapon?.element
    ? calculateNetElementalResistance(defender)[weapon.element]
    : calculatePhysicalResistance(defender)

  const baseDamage = Math.trunc(
    ((Math.trunc((attackPower * attackCorrection) / 100) -
      Math.trunc((defensePower * defenseCorrection) / 100)) *
      defenderResistance) /
      100
  )
  const finalDamage = Math.max(
    1,
    Math.round(
      (baseDamage + attacker.luck - defender.luck) * (weapon.multiplier || 1)
    )
  )
  return finalDamage
}
