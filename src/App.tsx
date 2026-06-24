import { CharacterCard } from "@/components/CharacterCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  applyEquipmentStats,
  resolveCharacter,
  type CharacterStats,
} from "@/utils/combat"
import { useEffect, useMemo, useState } from "react"
import ActionCalculatorCard from "./components/ActionCalculatorCard"
import { DeleteCharacterDialog } from "./components/DeleteCharacterDialog"
import { Button } from "./components/ui/button"
import { Field, FieldLabel } from "./components/ui/field"
import { CLASS_CATALOG } from "./utils/classes"

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

export function App() {
  const [characters, setCharacters] = useState<CharacterStats[]>(loadCharacters)
  const [attackerId, setAttackerId] = useState<string>(characters[0].id)
  const [defenderId, setDefenderId] = useState<string>(characters[1].id)

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

  const attackerStats = useMemo(
    () => characters.find((c) => c.id === attackerId) || characters[0],
    [characters, attackerId]
  )

  const resolvedAttacker = useMemo(
    () => resolveCharacter(attackerStats),
    [attackerStats]
  )

  const equippedAttacker = useMemo(
    () => applyEquipmentStats(resolvedAttacker),
    [resolvedAttacker]
  )

  const defenderStats = useMemo(
    () => characters.find((c) => c.id === defenderId) || characters[0],
    [characters, defenderId]
  )

  const resolvedDefender = useMemo(
    () => resolveCharacter(defenderStats),
    [defenderStats]
  )

  const equippedDefender = useMemo(
    () => applyEquipmentStats(resolvedDefender),
    [resolvedDefender]
  )

  return (
    <div className="mx-auto min-h-screen space-y-4 px-4 py-4">
      <header className="border-b pb-4 text-center">
        <h1 className="text-3xl font-black tracking-tight text-primary uppercase">
          Tactics Ogre Attack Simulator
        </h1>
      </header>

      <main className="grid grid-cols-1 justify-items-center gap-4 lg:grid-cols-3">
        <div className="col-span-1 space-y-4">
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
                  onConfirm={() => deleteCharacter(attackerStats.id)}
                />
              </div>
            </div>
          </Field>
          <CharacterCard
            character={attackerStats}
            onCharacterChange={updateCharacter}
          />
        </div>

        <div className="col-span-1 w-full space-y-4 lg:mt-6">
          <ActionCalculatorCard attacker={equippedAttacker} defender={equippedDefender} />
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
                  onConfirm={() => deleteCharacter(defenderStats.id)}
                />
              </div>
            </div>
          </Field>
          <CharacterCard
            character={defenderStats}
            onCharacterChange={updateCharacter}
          />
        </div>
      </main>
    </div>
  )
}

export default App
