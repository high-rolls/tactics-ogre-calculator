import {
  type WeaponStats,
  type ArmorStats,
  type ConsumableStats,
} from "@/utils/combat"

export const ITEM_CATALOG: (WeaponStats | ArmorStats | ConsumableStats)[] = [
  // Weapons
  {
    name: "Mini Dagger",
    strength: 12,
    weight: 3,
    type: "weapon",
    iconName: "mini",
  },
  {
    name: "Short Sword",
    strength: 15,
    weight: 7,
    type: "weapon",
    iconName: "short",
  },
  {
    name: "Balder Dagger",
    strength: 25,
    weight: 24,
    type: "weapon",
    iconName: "balderkn",
  },
  {
    name: "Balder Sword",
    strength: 30,
    weight: 31,
    type: "weapon",
    iconName: "baldersd",
  },
  // Armor
  {
    name: "Leather Armor",
    physicalResistance: 3,
    weight: 6,
    type: "armor",
    iconName: "leatherar",
  },
  {
    name: "Chain Mail",
    physicalResistance: 6,
    weight: 12,
    type: "armor",
    iconName: "chainar",
  },
  {
    name: "Balder Armor",
    physicalResistance: 9,
    weight: 18,
    type: "armor",
    iconName: "balderar"
  },
  {
    name: "Robe",
    physicalResistance: 1,
    weight: 1,
    type: "armor",
    iconName: "robe"
  },
  {
    name: "Balder Robe",
    physicalResistance: 4,
    weight: 3,
    type: "armor",
    iconName: "robe"
  },
  {
    name: "Leather Cap",
    physicalResistance: 2,
    weight: 4,
    type: "armor",
    iconName: "leatherht",
  },
  {
    name: "Balder Helmet",
    physicalResistance: 6,
    weight: 12,
    type: "armor",
    iconName: "balderht",
  },
  {
    name: "Battle Boots",
    physicalResistance: 4,
    weight: 7,
    type: "armor",
    iconName: "battlebt",
  },
  {
    name: "Tower Shield",
    physicalResistance: 10,
    weight: 10,
    type: "armor",
    iconName: "tower",
  },
  {
    name: "Balder Shield",
    physicalResistance: 15,
    weight: 20,
    type: "armor",
    iconName: "baldersh",
  },
  {
    name: "Power Gauntlet",
    physicalResistance: 10,
    weight: 10,
    type: "armor",
    iconName: "powergt",
  },
  {
    name: "Balder Gauntlet",
    physicalResistance: 13,
    weight: 16,
    type: "armor",
    iconName: "baldergt",
  },
  {
    name: "Cure",
    weight: 1,
    type: "consumable",
    iconName: "cure",
  },
  {
    name: "Cure+",
    weight: 1,
    type: "consumable",
    iconName: "cure2",
  },
  {
    name: "Antidote",
    weight: 1,
    type: "consumable",
    iconName: "antidote",
  },
]
