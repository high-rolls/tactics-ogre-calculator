import type { TerrainStats } from "./combat";

export const TERRAINS: TerrainStats[] = [
  {
    name: "Soil",
    attackModifier: 40,
    defenseModifier: 15,
    elementalModifiers: {
      water: 0,
      earth: 2,
      fire: 0,
      wind: -2,
    },
  },
  {
    name: "Sand",
    attackModifier: 25,
    defenseModifier: 15,
    elementalModifiers: {
      water: -2,
      earth: 0,
      fire: 2,
      wind: 0,
    }
  },
  {
    name: "Ash",
    attackModifier: 20,
    defenseModifier: 10,
    elementalModifiers: {
      water: -3,
      earth: 0,
      fire: 3,
      wind: 0,
    }
  },
  {
    name: "Grass",
    attackModifier: 35,
    defenseModifier: 15,
    elementalModifiers: {
      water: 1,
      earth: -2,
      fire: -1,
      wind: 2,
    },
  },
  {
    name: "Tall Grass",
    attackModifier: 30,
    defenseModifier: 15,
    elementalModifiers: {
      water: 2,
      earth: -3,
      fire: -2,
      wind: 3,
    },
  },
  {
    name: "Snow",
    attackModifier: 25,
    defenseModifier: 20,
    elementalModifiers: {
      water: 2,
      earth: 0,
      fire: -2,
      wind: 0,
    },
  },
  {
    name: "Rock",
    attackModifier: 35,
    defenseModifier: 10,
    elementalModifiers: {
      water: -1,
      earth: 2,
      fire: 1,
      wind: -2,
    },
  },
  {
    name: "Gravel",
    attackModifier: 35,
    defenseModifier: 15,
    elementalModifiers: {
      water: -2,
      earth: 2,
      fire: 2,
      wind: -2,
    },
  },
  {
    name: "Dry Land",
    attackModifier: 25,
    defenseModifier: 15,
    elementalModifiers: {
      water: -2,
      earth: 2,
      fire: 2,
      wind: -2,
    },
  },
  {
    name: "Marsh",
    attackModifier: 30, // TODO: Changes based on weather
    defenseModifier: 20, // TODO: Changes based on weather
    elementalModifiers: {
      water: 2,
      earth: -3,
      fire: -2,
      wind: 3,
    },
  },
  {
    name: "Poison Mold",
    attackModifier: 26, // TODO: Changes based on weather
    defenseModifier: 18, // TODO: Changes based on weather
    elementalModifiers: {
      water: 0,
      earth: 2,
      fire: 0,
      wind: -2,
    },
  },
  {
    name: "Lava Rock",
    attackModifier: 35,
    defenseModifier: 15,
    elementalModifiers: {
      water: -2,
      earth: 2,
      fire: 2,
      wind: -2,
    },
  },
  {
    name: "Tar",
    attackModifier: 20,
    defenseModifier: 15,
    elementalModifiers: {
      water: -3,
      earth: 0,
      fire: 3,
      wind: 0,
    },
  },
  {
    name: "Ice",
    attackModifier: 25,
    defenseModifier: 15,
    elementalModifiers: {
      water: 3,
      earth: 0,
      fire: -3,
      wind: 0,
    },
  },
  {
    name: "Water",
    attackModifier: 10,
    defenseModifier: 5,
    elementalModifiers: {
      water: 2,
      earth: 0,
      fire: -2,
      wind: 0,
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
      wind: 0,
    },
  },
  {
    name: "Lake",
    attackModifier: 10,
    defenseModifier: 5,
    elementalModifiers: {
      water: 2,
      earth: 0,
      fire: -2,
      wind: 0,
    },
  },
  {
    name: "Ocean",
    attackModifier: 20,
    defenseModifier: 5,
    elementalModifiers: {
      water: 2,
      earth: 0,
      fire: -2,
      wind: 0,
    },
  },
  {
    name: "Lava",
    attackModifier: 0,
    defenseModifier: 30,
    elementalModifiers: {
      water: -3,
      earth: 0,
      fire: 3,
      wind: 0,
    },
  },
  {
    name: "Road",
    attackModifier: 40,
    defenseModifier: 20,
    elementalModifiers: {},
  },
  {
    name: "Stone Floor",
    attackModifier: 40,
    defenseModifier: 15,
    elementalModifiers: {},
  },
  {
    name: "Roof",
    attackModifier: 40,
    defenseModifier: 15,
    elementalModifiers: {
      water: -1,
      earth: -2,
      fire: 1,
      wind: 2,
    },
  },
  {
    name: "Stone Wall",
    attackModifier: 40,
    defenseModifier: 15,
    elementalModifiers: {},
  },
  { // 0x1C
    name: "Wood",
    attackModifier: 35,
    defenseModifier: 15,
    elementalModifiers: {
      water: 1,
      earth: -2,
      fire: -1,
      wind: 2,
    },
  },
]