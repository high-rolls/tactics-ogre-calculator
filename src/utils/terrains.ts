import type { TerrainStats } from "./combat";

export const TERRAINS: TerrainStats[] = [
  {
    name: "Grass",
    attackModifier: 35,
    defenseModifier: 15,
    elementalModifiers: {
      water: 1,
      earth: -2,
      fire: -1,
      air: 2,
    },
  },
  {
    name: "Gravel",
    attackModifier: 35,
    defenseModifier: 15,
    elementalModifiers: {
      water: 3,
      earth: 2,
      fire: 2,
      air: -2,
    },
  },
  {
    name: "River",
    attackModifier: 15,
    defenseModifier: 10,
    elementalModifiers: {
      water: 2,
      earth: 0,
      fire: -2,
      air: 0,
    },
  },
  {
    name: "Road",
    attackModifier: 40,
    defenseModifier: 20,
    elementalModifiers: {},
  },
  {
    name: "Snow",
    attackModifier: 25,
    defenseModifier: 20,
    elementalModifiers: {
      water: 2,
      earth: 0,
      fire: -2,
      air: 0,
    },
  },
  {
    name: "Soil",
    attackModifier: 40,
    defenseModifier: 15,
    elementalModifiers: {
      water: 0,
      earth: 2,
      fire: 0,
      air: -2,
    },
  },
  {
    name: "Stone Wall",
    attackModifier: 40,
    defenseModifier: 15,
    elementalModifiers: {},
  },
  {
    name: "Water",
    attackModifier: 10,
    defenseModifier: 5,
    elementalModifiers: {
      water: 2,
      earth: 0,
      fire: -2,
      air: 0,
    },
  },
]