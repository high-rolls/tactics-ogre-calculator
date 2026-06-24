import { AttackPredictionCard } from "@/components/AttackPredictionCard"
import { CharacterCard } from "@/components/CharacterCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  calculateCharacterCorrection,
  applyEquipmentStats,
  isIndirectWeapon,
  resolveCharacter,
  type CharacterStats,
  type TerrainStats,
  type WeaponStats,
  type WeatherType,
  type AttackDirection,
} from "@/utils/combat"
import { TERRAINS } from "@/utils/terrains"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"
import { useEffect, useState } from "react"
import {
  WiCloudy,
  WiDaySunny,
  WiRain,
  WiSprinkle,
  WiThunderstorm,
} from "weather-icons-react"
import { DeleteCharacterDialog } from "./components/DeleteCharacterDialog"
import { Button } from "./components/ui/button"
import { Field, FieldLabel } from "./components/ui/field"
import { CLASS_CATALOG } from "./utils/classes"
import { ITEM_BY_KEY } from "./utils/items"

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
    items: ["baldersd", "balderht", "balderar", "baldersh"],
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
    items: ["balderrb", null, null, "balderst"],
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
    items: [null, null, null, null],
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
    items: [null, null, null, null],
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
    items: [null, null, null, null],
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
    items: [null, null, null, null],
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
    items: [null, null, null, null],
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
    items: [null, null, null, null],
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

function withDefault<T>(items: T[], defaultItem: T): T[] {
  return items.length ? items : [defaultItem]
}

export function App() {
  const [characters, setCharacters] = useState<CharacterStats[]>(loadCharacters)
  const [attackerId, setAttackerId] = useState<string>(characters[0].id)
  const [defenderId, setDefenderId] = useState<string>(characters[1].id)
  const [direction, setDirection] = useState<AttackDirection>("front")
  const [attackerTerrain, setAttackerTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [defenderTerrain, setDefenderTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [weather, setWeather] = useState<WeatherType>("sunny")

  useEffect(() => {
    localStorage.setItem("characters", JSON.stringify(characters))
  }, [characters])

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

  const attacker = applyEquipmentStats(resolveCharacter(
    characters.find((c) => c.id === attackerId) ?? characters[0]
  ))

  const defender = applyEquipmentStats(resolveCharacter(
    characters.find((c) => c.id === defenderId) ?? characters[1]
  ))

  const attackerCorrection = calculateCharacterCorrection(attacker, attackerTerrain, weather, true, true)
  const defenderCorrection = calculateCharacterCorrection(defender, defenderTerrain, weather, false, true)

  const attackerDirectWeapons = withDefault(
    attacker.equippedItems.filter(
      (item): item is WeaponStats =>
        item?.type === "weapon" && !isIndirectWeapon(item.category)
    ),
    ITEM_BY_KEY["punch"]
  ) as WeaponStats[]

  const attackerIndirectWeapons = withDefault(
    attacker.equippedItems.filter(
      (item): item is WeaponStats =>
        item?.type === "weapon" && isIndirectWeapon(item.category)
    ),
    ITEM_BY_KEY["stone"]
  ) as WeaponStats[]

  const attackerWeapons = [...attackerDirectWeapons, ...attackerIndirectWeapons]

  const defenderDirectWeapons = withDefault(
    defender.equippedItems.filter(
      (item): item is WeaponStats =>
        item?.type === "weapon" && !isIndirectWeapon(item.category)
    ),
    ITEM_BY_KEY["punch"]
  ) as WeaponStats[]

  const defenderIndirectWeapons = withDefault(
    defender.equippedItems.filter(
      (item): item is WeaponStats =>
        item?.type === "weapon" && isIndirectWeapon(item.category)
    ),
    ITEM_BY_KEY["stone"]
  ) as WeaponStats[]

  const defenderWeapons = [...defenderDirectWeapons, ...defenderIndirectWeapons]

  return (
    <div className="mx-auto min-h-screen space-y-4 px-4 py-4">
      <header className="border-b pb-4 text-center">
        <h1 className="text-3xl font-black tracking-tight text-primary uppercase">
          Tactics Ogre Attack Simulator
        </h1>
      </header>

      <main className="grid grid-cols-1 justify-items-center gap-4 lg:grid-cols-3">
        <div className="space-y-4 col-span-1">
          <Field>
            <FieldLabel className="text-md text-sky-500">
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
                <Button variant="default" onClick={() => addCharacter(true)}>
                  Add
                </Button>
                <DeleteCharacterDialog
                  onConfirm={() => deleteCharacter(attacker.id)}
                />
              </div>
            </div>
          </Field>
          <CharacterCard
            character={attacker}
            onCharacterChange={updateCharacter}
          />
        </div>

        <div className="col-span-1 space-y-4 lg:mt-6 w-full">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold tracking-wide text-destructive uppercase">
                {attacker.name} vs {defender.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <Field className="col-span-3 lg:col-span-5 xl:col-span-3">
                  <FieldLabel>Side</FieldLabel>
                  <Tabs
                    value={direction}
                    onValueChange={(val) =>
                      setDirection(val as AttackDirection)
                    }
                    orientation="vertical"
                  >
                    <TabsList>
                      <TabsTrigger value="front">
                        <ArrowUpIcon />
                        Front
                      </TabsTrigger>
                      <TabsTrigger value="side">
                        <ArrowRightIcon />
                        Side
                      </TabsTrigger>
                      <TabsTrigger value="back">
                        <ArrowDownIcon />
                        Back
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </Field>
                <Field className="col-span-4 lg:col-span-7 xl:col-span-4">
                  <FieldLabel>Weather</FieldLabel>
                  <Tabs
                    value={weather}
                    onValueChange={(val) => setWeather(val as WeatherType)}
                    orientation="vertical"
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
                </Field>
                <div className="col-span-5 lg:col-span-12 xl:col-span-5 flex flex-col gap-4">
                  <Field>
                    <FieldLabel>Attacker Terrain</FieldLabel>
                    <Select
                      value={attackerTerrain.name}
                      onValueChange={(name) =>
                        setAttackerTerrain(
                          TERRAINS.find((t) => t.name === name)!
                        )
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
                  </Field>
                  <Field>
                    <FieldLabel>Defender Terrain</FieldLabel>
                    <Select
                      value={defenderTerrain.name}
                      onValueChange={(name) =>
                        setDefenderTerrain(
                          TERRAINS.find((t) => t.name === name)!
                        )
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
                  </Field>
                </div>
              </div>

              <div className="grid max-h-[60vh] scrollbar-thumb-amber-200 grid-cols-2 lg:grid-cols-1 gap-3 overflow-y-auto border-t pe-2 py-4">
                <div className="flex flex-col gap-2">
                  {attackerWeapons.map((weapon) => (
                    <AttackPredictionCard
                      attacker={attacker}
                      defender={defender}
                      weapon={weapon}
                      attackDirection={direction}
                      attackerCorrection={attackerCorrection}
                      defenderCorrection={defenderCorrection}
                      type="attack"
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {defenderWeapons.map((weapon) => (
                    <AttackPredictionCard
                      attacker={defender}
                      defender={attacker}
                      weapon={weapon}
                      attackDirection="front"
                      attackerCorrection={defenderCorrection}
                      defenderCorrection={attackerCorrection}
                      type="counter"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Field>
            <FieldLabel className="text-md text-red-500">
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
                <DeleteCharacterDialog
                  buttonClass="flex-1"
                  onConfirm={() => deleteCharacter(defender.id)}
                />
              </div>
            </div>
          </Field>
          <CharacterCard
            character={defender}
            onCharacterChange={updateCharacter}
          />
        </div>
      </main>
    </div>
  )
}

export default App
