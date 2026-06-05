import { useState } from "react"
import {
  WiDaySunny,
  WiCloudy,
  WiSprinkle,
  WiRain,
  WiThunderstorm,
} from "weather-icons-react"
import { CharacterCard } from "./components/CharacterCard"
import {
  type CharacterStats,
  type EquippableItem,
  type TerrainStats,
  type WeaponStats,
  type WeatherType,
} from "./utils/combat"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "./components/ui/label"
import { AttackPredictionCard } from "./components/AttackPredictionCard"

const defaultAttacker: CharacterStats = {
  name: "Sara",
  level: 17,
  element: "air",
  alignment: "neutral",
  className: "cleric",
  strength: 102,
  vitality: 105,
  intelligence: 116,
  mentality: 120,
  agility: 123,
  dexterity: 126,
  luck: 50,
  physicalResistance: 125,
  baseResistances: {
    air: 95,
    fire: 95,
    earth: 95,
    water: 95,
    holy: 90,
    dark: 100,
  },
  weatherResistance: 2,
}

const defaultDefender: CharacterStats = {
  name: "Neilson",
  level: 17,
  element: "air",
  alignment: "chaotic",
  className: "skeleton",
  strength: 116,
  vitality: 88,
  intelligence: 109,
  mentality: 102,
  agility: 130,
  dexterity: 106,
  luck: 50,
  physicalResistance: 110,
  baseResistances: {
    air: 100,
    fire: 100,
    earth: 100,
    water: 100,
    holy: 125,
    dark: 75,
  },
  weatherResistance: 2,
}

const TERRAINS: TerrainStats[] = [
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

type AttackDirection = "front" | "side" | "back"
const DIRECTION_MODIFIERS: Record<AttackDirection, number> = {
  front: 0,
  side: 25,
  back: 50,
}

export function App() {
  const [attacker, setAttacker] = useState<CharacterStats>(defaultAttacker)
  const [attackerItems, setAttackerItems] = useState<(EquippableItem | null)[]>(
    [null, null, null, null]
  )
  const [defenderItems, setDefenderItems] = useState<(EquippableItem | null)[]>(
    [null, null, null, null]
  )
  const [defender, setDefender] = useState<CharacterStats>(defaultDefender)
  const [direction, setDirection] = useState<AttackDirection>("front")
  const [attackerTerrain, setAttackerTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [defenderTerrain, setDefenderTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [weather, setWeather] = useState<WeatherType>("sunny")

  const attackerWeapons = attackerItems.filter(
    (item): item is WeaponStats => item?.type === "weapon"
  )

  const sideModifier = DIRECTION_MODIFIERS[direction]

  return (
    <div className="container mx-auto min-h-screen max-w-400 space-y-6 px-4 py-8">
      <header className="border-b pb-4 text-center">
        <h1 className="text-3xl font-black tracking-tight text-primary uppercase">
          RPG Battle Simulator
        </h1>
        <p className="text-sm text-muted-foreground">
          Tweak statistics on either side to instantly evaluate tactical
          match-ups.
        </p>
      </header>

      <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
        <div className="space-y-2 lg:col-span-1">
          <div className="pl-1 text-xs font-bold tracking-widest text-emerald-500 uppercase">
            ⚔️ Attacker Profile
          </div>
          <CharacterCard
            character={attacker}
            onCharacterChange={(updated) => setAttacker(updated)}
            equippedItems={attackerItems}
            onEquippedItemsChange={(updated) => setAttackerItems(updated)}
          />
        </div>

        <div className="space-y-4 lg:col-span-2 lg:mt-6">
          <Card className="border-2 border-destructive/30 bg-destructive/5 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold tracking-wide text-destructive uppercase">
                Engagement Matrix
              </CardTitle>
              <CardDescription>
                {attacker.name} vs {defender.name}
              </CardDescription>

              <div className="flex flex-col items-center justify-center space-y-2 pt-4">
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Attack Vectors
                </span>
                <Tabs
                  value={direction}
                  onValueChange={(val) => setDirection(val as AttackDirection)}
                  className="w-full max-w-xs"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="front">Front</TabsTrigger>
                    <TabsTrigger value="side">Side</TabsTrigger>
                    <TabsTrigger value="back">Back</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2 pt-4">
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Weather
                </span>
                <Tabs
                  value={weather}
                  onValueChange={(val) => setWeather(val as WeatherType)}
                  className="w-full max-w-lg"
                  orientation="horizontal"
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="sunny">
                      <WiDaySunny className="text-amber-200" />
                      Sunny
                    </TabsTrigger>
                    <TabsTrigger value="cloudy">
                      <WiCloudy className="text-white" />
                      Cloudy
                    </TabsTrigger>
                    <TabsTrigger value="light-rain">
                      <WiSprinkle className="text-sky-200" />
                      Light R/S
                    </TabsTrigger>
                    <TabsTrigger value="rain">
                      <WiRain className="text-sky-400" />
                      Rain/Snow
                    </TabsTrigger>
                    <TabsTrigger value="heavy-rain">
                      <WiThunderstorm className="text-indigo-400" />
                      Heavy R/S
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="mx-auto grid max-w-sm grid-cols-2 gap-4 pt-4 text-left">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">
                    Attacker Terrain
                  </Label>
                  <Select
                    value={attackerTerrain.name}
                    onValueChange={(name) =>
                      setAttackerTerrain(TERRAINS.find((t) => t.name === name)!)
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TERRAINS.map((terrain) => (
                        <SelectItem key={terrain.name} value={terrain.name}>
                          {terrain.name} (+{terrain.attackModifier}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">
                    Defender Terrain
                  </Label>
                  <Select
                    value={defenderTerrain.name}
                    onValueChange={(name) =>
                      setDefenderTerrain(TERRAINS.find((t) => t.name === name)!)
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TERRAINS.map((terrain) => (
                        <SelectItem key={terrain.name} value={terrain.name}>
                          {terrain.name} (+{terrain.defenseModifier}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            {attackerWeapons.length === 0 ? (
              <AttackPredictionCard
                attacker={attacker}
                attackerItems={attackerItems}
                defender={defender}
                defenderItems={defenderItems}
                attackerTerrain={attackerTerrain}
                defenderTerrain={defenderTerrain}
                weapon={null}
                sideModifier={sideModifier}
                weather={weather}
              />
            ) : (
              attackerWeapons.map((weapon) => (
                <AttackPredictionCard
                  attacker={attacker}
                  attackerItems={attackerItems}
                  defender={defender}
                  defenderItems={defenderItems}
                  attackerTerrain={attackerTerrain}
                  defenderTerrain={defenderTerrain}
                  weapon={weapon}
                  sideModifier={sideModifier}
                  weather={weather}
                />
              ))
            )}
          </Card>
        </div>

        <div className="space-y-2 lg:col-span-1">
          <div className="pl-1 text-xs font-bold tracking-widest text-sky-500 uppercase">
            🛡️ Defender Profile
          </div>
          <CharacterCard
            character={defender}
            onCharacterChange={(updated) => setDefender(updated)}
            equippedItems={defenderItems}
            onEquippedItemsChange={(updated) => setDefenderItems(updated)}
          />
        </div>
      </main>
    </div>
  )
}

export default App
