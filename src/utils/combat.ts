export interface CharacterStats {
  name: string
  level: number
  strength: number
  vitality: number
  intelligence: number
  mentality: number
  agility: number
  dexterity: number
  luck: number
  physicalResistance: number
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
}

export interface ArmorStats extends EquippableItem {
  type: "armor"
  physicalResistance: number
}

export interface ConsumableStats extends EquippableItem {
  type: "consumable"
}

export interface TerrainStats {
  name: string
  attackModifier: number
  defenseModifier: number
}

export function calculateEquipmentWeight(
  equippedItems: EquippableItem[]
): number {
  return equippedItems.reduce((total, item) => total + item.weight, 0)
}

export function calculateAccuracy(
  character: CharacterStats,
  equippedItems: EquippableItem[]
): number {
  const baseHit = character.agility + Math.floor(character.dexterity / 4)
  const totalWeight = calculateEquipmentWeight(equippedItems)
  return baseHit - totalWeight
}

export function calculateEvasiveness(
  character: CharacterStats,
  equippedItems: EquippableItem[]
): number {
  const baseEvasion = character.agility + Math.floor(character.dexterity / 4)
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
  equippedItems: EquippableItem[]
): number {
  const equippedArmor: ArmorStats[] = equippedItems.filter(
    (item): item is ArmorStats => item.type == "armor"
  )

  const armorPhysicalResistance = equippedArmor.reduce(
    (total, armor) => total + armor.physicalResistance,
    0
  )

  return character.physicalResistance - armorPhysicalResistance
}

export function getWeapons(equippedItems: EquippableItem[]): WeaponStats[] {
  const weapons: WeaponStats[] = equippedItems.filter(
    (item): item is WeaponStats => item.type == "weapon"
  )
  return weapons
}
