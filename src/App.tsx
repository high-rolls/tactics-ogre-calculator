import { useState } from "react"
import { CharacterCard } from "./components/CharacterCard"
import {
  type CharacterStats,
  type EquippableItem,
  type TerrainStats,
  calculateAccuracy,
  calculateEvasiveness,
  calculateAttackPower,
  calculateDefensePower,
  calculatePhysicalResistance,
  type WeaponStats,
} from "./utils/combat"
import {
  Card,
  CardContent,
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

const defaultAttacker: CharacterStats = {
  name: "Sara",
  level: 17,
  strength: 102,
  vitality: 105,
  intelligence: 116,
  mentality: 120,
  agility: 123,
  dexterity: 126,
  luck: 50,
  physicalResistance: 115,
}

const defaultDefender: CharacterStats = {
  name: "Neilson",
  level: 17,
  strength: 116,
  vitality: 88,
  intelligence: 109,
  mentality: 102,
  agility: 130,
  dexterity: 106,
  luck: 50,
  physicalResistance: 115,
}

const TERRAINS: TerrainStats[] = [
  { name: "Grass", attackModifier: 35, defenseModifier: 15 },
  { name: "Soil", attackModifier: 40, defenseModifier: 15 },
  { name: "Road", attackModifier: 40, defenseModifier: 20 },
  { name: "Stone Wall", attackModifier: 40, defenseModifier: 15 },
  { name: "Water", attackModifier: 10, defenseModifier: 5 },
]

const WEAPONS_ARSENAL: (WeaponStats | null)[] = [
  null, // Represents "Unarmed"
  { name: "Mini Dagger", strength: 12, weight: 3, type: "weapon", iconName: "mini" },
  { name: "Short Sword", strength: 15, weight: 7, type: "weapon", iconName: "short" },
  { name: "Balder Dagger", strength: 25, weight: 24, type: "weapon", iconName: "balderkn" },
  { name: "Balder Sword", strength: 30, weight: 31, type: "weapon", iconName: "baldersd" },
  { name: "Flanka Axe", strength: 16, weight: 8, type: "weapon", iconName: "phlanka" },
  { name: "Spear", strength: 12, weight: 9, type: "weapon", iconName: "spear" },
  { name: "Slender Spear", strength: 22, weight: 23, type: "weapon", iconName: "slender" },
  { name: "Heavy Hammer", strength: 18, weight: 14, type: "weapon", iconName: "heavyhm" },
  { name: "Matou Claw", strength: 24, weight: 21, type: "weapon", iconName: "matou" },
  { name: "Cedar Staff", strength: 6, weight: 2, type: "weapon", iconName: "cedar" },
  { name: "Balder Staff", strength: 7, weight: 7, type: "weapon", iconName: "balderst" },
  { name: "Guard Whip", strength: 7, weight: 7, type: "weapon", iconName: "guardwh" },
]

type AttackDirection = "front" | "side" | "back"
const DIRECTION_MODIFIERS: Record<AttackDirection, number> = {
  front: 0,
  side: 25,
  back: 50,
}

export function App() {
  const [attacker, setAttacker] = useState<CharacterStats>(defaultAttacker)
  const [attackerItems, setAttackerItems] = useState<(EquippableItem | null)[]>([WEAPONS_ARSENAL[2], null, null, null])
  const [defenderItems, setDefenderItems] = useState<(EquippableItem | null)[]>([null, null, null, null])
  const [defender, setDefender] = useState<CharacterStats>(defaultDefender)
  const [direction, setDirection] = useState<AttackDirection>("front")
  const [attackerTerrain, setAttackerTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [defenderTerrain, setDefenderTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )

  const [equippedWeapon, setEquippedWeapon] = useState<WeaponStats | null>(null)

  const attackerGear: EquippableItem[] = equippedWeapon ? [equippedWeapon] : []
  const defenderGear: EquippableItem[] = []

  const attackerAccuracy = calculateAccuracy(attacker, attackerGear)
  const defenderEvasiveness = calculateEvasiveness(defender, defenderGear)

  const sideModifier = DIRECTION_MODIFIERS[direction]

  const attackCorrection = 50 + attackerTerrain.attackModifier
  const defenseCorrection = 50 + defenderTerrain.defenseModifier

  const weaponMultiplier = equippedWeapon ? 1.0 : 0.5

  const finalHitChance =
    Math.floor((attackerAccuracy * attackCorrection) / 100) -
    Math.floor((defenderEvasiveness * defenseCorrection) / 100) +
    attacker.luck -
    defender.luck +
    50 +
    sideModifier

  const attackPower = calculateAttackPower(attacker, equippedWeapon)
  const defensePower = calculateDefensePower(defender)
  const defenderPhysicalResistance = calculatePhysicalResistance(
    defender,
    defenderGear
  )

  // Basic attack damage vs base defense check
  const baseDamage = Math.floor(
    Math.floor((attackPower * attackCorrection) / 100) -
      Math.floor(
        (Math.floor((defensePower * defenseCorrection) / 100) *
          defenderPhysicalResistance) /
          100
      )
  )
  const finalDamage = Math.round(
    (baseDamage + attacker.luck - defender.luck) * weaponMultiplier
  )

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
                    Attacker Weapon
                  </Label>
                  <Select
                    value={equippedWeapon ? equippedWeapon.name : "unarmed"}
                    onValueChange={(name) => {
                      const found = WEAPONS_ARSENAL.find(
                        (w) => w?.name === name
                      )
                      setEquippedWeapon(found || null)
                    }}
                  >
                    <SelectTrigger className="bg-background font-medium">
                      <SelectValue placeholder="Unarmed (Fists)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unarmed">
                        🥊 Unarmed (Fists)
                      </SelectItem>
                      {WEAPONS_ARSENAL.filter(Boolean).map((w) => (
                        <SelectItem key={w!.name} value={w!.name}>
                          ⚔️ {w!.name} (+{w!.strength} STR)
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

            <CardContent className="grid grid-cols-2 gap-6 pt-2">
              <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-4 shadow-sm">
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Estimated Damage
                </span>
                <span className="mt-1 text-4xl font-black text-destructive">
                  {finalDamage}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-4 shadow-sm">
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Net Hit Chance
                </span>
                <span className="mt-1 text-4xl font-black text-amber-500">
                  {finalHitChance}%
                </span>
                <span className="mt-1 text-center text-[10px] text-muted-foreground">
                  Attacker Hit minus Defender Evasion
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Helpful Sub-Metrics Summary Box */}
          <div className="grid grid-cols-2 gap-4 px-2 text-xs text-muted-foreground">
            <div className="grid grid-rows-2 gap-2">
              <div>
                • Base Accuracy:{" "}
                <span className="font-semibold text-foreground">
                  {attackerAccuracy}
                </span>
              </div>
              <div>
                • Base Attack Power:{" "}
                <span className="font-semibold text-foreground">
                  {attackPower}
                </span>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-2 text-right">
              <div>
                • Base Evasiveness:{" "}
                <span className="font-semibold text-foreground">
                  {defenderEvasiveness}
                </span>
              </div>
              <div>
                • Base Defense Power:{" "}
                <span className="font-semibold text-foreground">
                  {defensePower}
                </span>
              </div>
            </div>
          </div>
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
