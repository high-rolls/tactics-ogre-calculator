import { AttackPredictionCard } from "@/components/AttackPredictionCard"
import { CharacterCard } from "@/components/CharacterCard"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type CharacterStats,
  type EquippableItem,
  type TerrainStats,
  type WeaponStats,
  type WeatherType,
} from "@/utils/combat"
import { TERRAINS } from "@/utils/terrains"
import { useState } from "react"
import {
  WiCloudy,
  WiDaySunny,
  WiRain,
  WiSprinkle,
  WiThunderstorm,
} from "weather-icons-react"
import { Input } from "./components/ui/input"
import { CLASS_CATALOG } from "./utils/classes"

const DEFAULT_CHARACTERS: CharacterStats[] = [
  {
    name: "Sara",
    species: "human",
    gender: "female",
    element: "air",
    alignment: "neutral",
    class: CLASS_CATALOG["cleric"],
    level: 17,
    strength: 102,
    vitality: 105,
    intelligence: 116,
    mentality: 120,
    agility: 123,
    dexterity: 126,
    luck: 50,
  },
  {
    name: "Neilson",
    species: "human",
    gender: "male",
    element: "air",
    alignment: "chaotic",
    class: CLASS_CATALOG["skeleton"],
    level: 17,
    strength: 116,
    vitality: 88,
    intelligence: 109,
    mentality: 102,
    agility: 130,
    dexterity: 106,
    luck: 50,
  },
  {
    name: "Nelson",
    species: "human",
    gender: "male",
    element: "water",
    alignment: "chaotic",
    class: CLASS_CATALOG["ghost"],
    level: 17,
    strength: 95,
    vitality: 76,
    intelligence: 133,
    mentality: 141,
    agility: 104,
    dexterity: 102,
    luck: 50,
  },
  {
    name: "Delta",
    species: "human",
    gender: "male",
    element: "water",
    alignment: "neutral",
    class: CLASS_CATALOG["lizardMan"],
    level: 17,
    strength: 131,
    vitality: 116,
    intelligence: 70,
    mentality: 111,
    agility: 118,
    dexterity: 97,
    luck: 50,
  },
  {
    name: "Margaret",
    species: "human",
    gender: "female",
    element: "fire",
    alignment: "neutral",
    class: CLASS_CATALOG["siren"],
    level: 17,
    strength: 117,
    vitality: 92,
    intelligence: 134,
    mentality: 120,
    agility: 98,
    dexterity: 118,
    luck: 50,
  },
  {
    name: "Penelope",
    species: "human",
    gender: "female",
    element: "air",
    alignment: "neutral",
    class: CLASS_CATALOG["valkyrie"],
    level: 17,
    strength: 124,
    vitality: 104,
    intelligence: 125,
    mentality: 109,
    agility: 105,
    dexterity: 114,
    luck: 49,
  },
]

type AttackDirection = "front" | "side" | "back"
const DIRECTION_MODIFIERS: Record<AttackDirection, number> = {
  front: 0,
  side: 25,
  back: 50,
}

export function App() {
  const [attacker, setAttacker] = useState<CharacterStats>(
    DEFAULT_CHARACTERS[0]
  )
  const [attackerItems, setAttackerItems] = useState<(EquippableItem | null)[]>(
    [null, null, null, null]
  )
  const [defenderItems, setDefenderItems] = useState<(EquippableItem | null)[]>(
    [null, null, null, null]
  )
  const [defender, setDefender] = useState<CharacterStats>(
    DEFAULT_CHARACTERS[1]
  )
  const [direction, setDirection] = useState<AttackDirection>("front")
  const [attackerTerrain, setAttackerTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [defenderTerrain, setDefenderTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [weather, setWeather] = useState<WeatherType>("sunny")
  const [attackCorrection, setAttackCorrection] = useState<number>(0)
  const [defenseCorrection, setDefenseCorrection] = useState<number>(0)

  const attackerWeapons = attackerItems.filter(
    (item): item is WeaponStats => item?.type === "weapon"
  )

  const defenderPrimaryWeapon =
    defenderItems.find(
      (item): item is WeaponStats => item !== null && item.type === "weapon"
    ) || null

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
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">
                    Attack Correction
                  </Label>
                  <Input
                    type="number"
                    value={attackCorrection}
                    onChange={(e) =>
                      e.target.value !== "" &&
                      setAttackCorrection(Number(e.target.value))
                    }
                    min={-999}
                    max={999}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">
                    Defense Correction
                  </Label>
                  <Input
                    type="number"
                    value={defenseCorrection}
                    onChange={(e) =>
                      e.target.value !== "" &&
                      setDefenseCorrection(Number(e.target.value))
                    }
                    min={-999}
                    max={999}
                  />
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
                attackCorrection={attackCorrection}
                defenseCorrection={defenseCorrection}
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
                  attackCorrection={attackCorrection}
                  defenseCorrection={defenseCorrection}
                />
              ))
            )}

            <div className="mx-3 pl-1 text-xs font-bold tracking-widest text-sky-500 uppercase">
              🛡️ Counter Attack
            </div>

            <AttackPredictionCard
              attacker={defender}
              attackerItems={defenderItems}
              defender={attacker}
              defenderItems={attackerItems}
              attackerTerrain={defenderTerrain}
              defenderTerrain={attackerTerrain}
              weapon={defenderPrimaryWeapon}
              sideModifier={DIRECTION_MODIFIERS["front"]}
              weather={weather}
              attackCorrection={defenseCorrection}
              defenseCorrection={attackCorrection}
            />
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
