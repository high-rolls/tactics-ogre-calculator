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
  resolveCharacter,
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
import { CLASS_CATALOG } from "./utils/classes"
import { Button } from "./components/ui/button"
import { Field, FieldLabel } from "./components/ui/field"

const DEFAULT_CHARACTERS: CharacterStats[] = [
  {
    id: crypto.randomUUID(),
    rosterNumber: 1,
    faction: "player",
    name: "Denim",
    species: "human",
    gender: "male",
    element: "earth",
    alignment: "chaotic",
    classId: CLASS_CATALOG["berzerker"].id,
    level: 17,
    strength: 121,
    vitality: 128,
    intelligence: 107,
    mentality: 123,
    agility: 125,
    dexterity: 123,
    luck: 50,
  },
  {
    id: crypto.randomUUID(),
    rosterNumber: 2,
    faction: "player",
    name: "Nelson",
    species: "human",
    gender: "male",
    element: "water",
    alignment: "chaotic",
    classId: CLASS_CATALOG["ghost"].id,
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
    id: crypto.randomUUID(),
    rosterNumber: 4,
    faction: "player",
    name: "Delta",
    species: "human",
    gender: "male",
    element: "water",
    alignment: "neutral",
    classId: CLASS_CATALOG["lizardMan"].id,
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
    id: crypto.randomUUID(),
    rosterNumber: 6,
    faction: "player",
    name: "Penelope",
    species: "human",
    gender: "female",
    element: "wind",
    alignment: "neutral",
    classId: CLASS_CATALOG["valkyrie"].id,
    level: 17,
    strength: 124,
    vitality: 104,
    intelligence: 125,
    mentality: 109,
    agility: 105,
    dexterity: 114,
    luck: 49,
  },
  {
    id: crypto.randomUUID(),
    rosterNumber: 7,
    faction: "player",
    name: "Margaret",
    species: "human",
    gender: "female",
    element: "fire",
    alignment: "neutral",
    classId: CLASS_CATALOG["siren"].id,
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
    id: crypto.randomUUID(),
    rosterNumber: 10,
    faction: "player",
    name: "Neilson",
    species: "human",
    gender: "male",
    element: "wind",
    alignment: "chaotic",
    classId: CLASS_CATALOG["skeleton"].id,
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
    id: crypto.randomUUID(),
    rosterNumber: 11,
    faction: "player",
    name: "Sara",
    species: "human",
    gender: "female",
    element: "wind",
    alignment: "neutral",
    classId: CLASS_CATALOG["cleric"].id,
    level: 17,
    strength: 102,
    vitality: 105,
    intelligence: 116,
    mentality: 120,
    agility: 123,
    dexterity: 126,
    luck: 50,
  },
]

function loadCharacters(): CharacterStats[] {
  const saved = localStorage.getItem("characters")

  if (saved) {
    return JSON.parse(saved)
  }

  return DEFAULT_CHARACTERS
}

function createCharacter(rosterNumber?: number): CharacterStats {
  return {
    id: crypto.randomUUID(),
    rosterNumber,
    faction: "player",
    name: "New",
    species: "human",
    gender: "male",
    element: "wind",
    alignment: "neutral",
    classId: 0x01,
    level: 1,
    strength: 8,
    vitality: 5,
    intelligence: 6,
    mentality: 6,
    agility: 6,
    dexterity: 6,
    luck: 50,
  }
}

function getNextRosterNumber(characters: CharacterStats[]): number {
  const usedNumbers = new Set(characters.map((c) => c.rosterNumber))

  let num = 1

  while (usedNumbers.has(num)) {
    num++
  }

  return num
}

type AttackDirection = "front" | "side" | "back"
const DIRECTION_MODIFIERS: Record<AttackDirection, number> = {
  front: 0,
  side: 25,
  back: 50,
}

export function App() {
  const [characters, setCharacters] = useState<CharacterStats[]>(loadCharacters)
  const [attackerId, setAttackerId] = useState<string>(characters[0].id)
  const [attackerItems, setAttackerItems] = useState<(EquippableItem | null)[]>(
    [null, null, null, null]
  )
  const [defenderItems, setDefenderItems] = useState<(EquippableItem | null)[]>(
    [null, null, null, null]
  )
  const [defenderId, setDefenderId] = useState<string>(characters[1].id)
  const [direction, setDirection] = useState<AttackDirection>("front")
  const [attackerTerrain, setAttackerTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [defenderTerrain, setDefenderTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [weather, setWeather] = useState<WeatherType>("sunny")

  const updateCharacter = (updated: CharacterStats) => {
    setCharacters((current) =>
      current.map((character) =>
        character.id === updated.id ? updated : character
      )
    )
  }

  const addCharacter = (fromAttacker: boolean) => {
    const character = createCharacter(getNextRosterNumber(characters))
    setCharacters((current) => [...current, character])
    if (fromAttacker) {
      setAttackerId(character.id)
    } else {
      setDefenderId(character.id)
    }
  }

  const deleteCharacter = (id: string) => {
    const remainingCharacters = characters.filter((c) => c.id !== id)

    if (remainingCharacters.length === 0) {
      return // Will not allow an empty characters list
    }

    setCharacters(remainingCharacters)

    if (attackerId === id) {
      setAttackerId(remainingCharacters[0].id)
    }

    if (defenderId === id) {
      setDefenderId(remainingCharacters[0].id)
    }
  }

  const attacker = resolveCharacter(
    characters.find((c) => c.id === attackerId) ?? characters[0]
  )

  const defender = resolveCharacter(
    characters.find((c) => c.id === defenderId) ?? characters[1]
  )

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
          Tactics Ogre Attack Simulator
        </h1>
        <p className="text-sm text-muted-foreground">
          Tweak statistics on either side to instantly evaluate match-ups.
        </p>
      </header>

      <main className="grid grid-cols-1 justify-items-center gap-6 xl:grid-cols-4">
        <div className="space-y-4 lg:col-span-1 max-w-sm md:max-w-2xl">
          <Field>
            <FieldLabel className="text-emerald-500 text-md">
              Attacker ⚔️
            </FieldLabel>
            <div className="grid w-full grid-cols-2 gap-4">
              <Select
                value={attackerId}
                onValueChange={(id) => setAttackerId(id)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {characters.map((character) => (
                    <SelectItem key={character.id} value={character.id}>
                      {character.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex w-full flex-row gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => addCharacter(true)}
                >
                  Add
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => deleteCharacter(attackerId)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Field>
          <CharacterCard
            character={attacker}
            onCharacterChange={updateCharacter}
            equippedItems={attackerItems}
            onEquippedItemsChange={(updated) => setAttackerItems(updated)}
          />
        </div>

        <div className="space-y-4 w-full lg:col-span-2 lg:mt-6">
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
                  Attack Vector
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
                  <Label>
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
            />
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Field>
            <FieldLabel className="text-md text-sky-500">
              Defender 🛡️
            </FieldLabel>
            <div className="grid w-full grid-cols-2 gap-4">
              <Select
                value={String(defenderId)}
                onValueChange={(id) => setDefenderId(id)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {characters.map((character) => (
                    <SelectItem key={character.id} value={character.id}>
                      {character.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex w-full flex-row gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => addCharacter(false)}
                >
                  Add
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => deleteCharacter(defenderId)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Field>
          <CharacterCard
            character={defender}
            onCharacterChange={updateCharacter}
            equippedItems={defenderItems}
            onEquippedItemsChange={(updated) => setDefenderItems(updated)}
          />
        </div>
      </main>
    </div>
  )
}

export default App
