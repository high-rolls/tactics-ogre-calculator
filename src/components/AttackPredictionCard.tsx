import {
  calculateAccuracy,
  calculateAttackPower,
  calculateDefensePower,
  calculateElementalMatchup,
  calculateEvasiveness,
  calculateNetElementalResistance,
  calculatePhysicalResistance,
  getAdjustedStats,
  WEATHER_ALIGNMENT_MODIFIERS,
  type ElementalModifiers,
  type EquippableItem,
  type ResolvedCharacter,
  type TerrainStats,
  type WeaponStats,
  type WeatherType,
} from "@/utils/combat"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ItemIcon } from "./ItemIcon"
import { SwordsIcon, UndoIcon } from "lucide-react"
import { FaHandFist } from "react-icons/fa6"

interface AttackPredictionCardProps {
  attacker: ResolvedCharacter
  defender: ResolvedCharacter
  attackerItems: (EquippableItem | null)[]
  defenderItems: (EquippableItem | null)[]
  weapon: WeaponStats | null
  attackerTerrain: TerrainStats
  defenderTerrain: TerrainStats
  sideModifier: number
  weather: WeatherType
  type: "attack" | "counter"
}

export function AttackPredictionCard({
  attacker,
  defender,
  attackerItems,
  defenderItems,
  weapon,
  attackerTerrain,
  defenderTerrain,
  sideModifier,
  weather,
  type,
}: AttackPredictionCardProps) {
  const adjustedAttacker = getAdjustedStats(
    attacker,
    attackerItems
  ) as ResolvedCharacter
  const adjustedDefender = getAdjustedStats(
    defender,
    defenderItems
  ) as ResolvedCharacter

  const attackerAccuracy = calculateAccuracy(adjustedAttacker, attackerItems)
  const defenderEvasiveness = calculateEvasiveness(
    adjustedDefender,
    defenderItems
  )

  const weaponElementModifier =
    weapon?.element !== undefined
      ? -10 *
        calculateElementalMatchup(weapon.element, adjustedAttacker.element)
      : 0

  const attackerTerrainBonus =
    adjustedAttacker.element in attackerTerrain.elementalModifiers
      ? attackerTerrain.elementalModifiers[
          adjustedAttacker.element as keyof ElementalModifiers
        ] || 0
      : 0

  const preferredWeaponBonus =
    adjustedAttacker.class.preferredWeaponCategory === weapon?.category ? 3 : 0

  const antiDragonBonus =
    (adjustedAttacker.antiDragon ? 8 : 0) + (weapon?.antiDragon ? 8 : 0)

  const attackCorrection = Math.max(
    0,
    Math.min(
      200,
      50 +
        attackerTerrain.attackModifier +
        WEATHER_ALIGNMENT_MODIFIERS[weather][adjustedAttacker.alignment] +
        (adjustedAttacker.class.weatherResistance || 0) +
        attackerTerrainBonus +
        weaponElementModifier +
        preferredWeaponBonus +
        antiDragonBonus
    )
  )

  const defenderTerrainBonus =
    adjustedDefender.element in defenderTerrain.elementalModifiers
      ? defenderTerrain.elementalModifiers[
          adjustedDefender.element as keyof ElementalModifiers
        ] || 0
      : 0

  const defenseCorrection = Math.max(
    0,
    Math.min(
      200,
      50 +
        defenderTerrain.defenseModifier +
        WEATHER_ALIGNMENT_MODIFIERS[weather][adjustedDefender.alignment] +
        defenderTerrainBonus +
        (adjustedDefender.class?.weatherResistance || 0)
    )
  )

  const weaponMultiplier = weapon !== null ? 1.0 : 0.5

  const finalHitChance = Math.max(
    1,
    Math.min(
      100,
      Math.trunc((attackerAccuracy * attackCorrection) / 100) -
        Math.trunc((defenderEvasiveness * defenseCorrection) / 100) +
        adjustedAttacker.luck -
        adjustedDefender.luck +
        50 +
        sideModifier
    )
  )

  const attackPower = calculateAttackPower(adjustedAttacker, weapon)
  const defensePower = calculateDefensePower(adjustedDefender)
  const defenderPhysicalResistance = calculatePhysicalResistance(
    adjustedDefender,
    defenderItems
  )
  const defenderNetResistances = calculateNetElementalResistance(
    adjustedDefender,
    defenderItems
  )

  const defenderResistance =
    weapon?.element === undefined
      ? defenderPhysicalResistance
      : defenderNetResistances[weapon.element]

  // Basic attack damage vs base defense check
  const baseDamage = Math.trunc(
    ((Math.trunc((attackPower * attackCorrection) / 100) -
      Math.trunc((defensePower * defenseCorrection) / 100)) *
      defenderResistance) /
      100
  )
  const finalDamage = Math.max(
    1,
    Math.round(
      (baseDamage + adjustedAttacker.luck - adjustedDefender.luck) *
        weaponMultiplier
    )
  )

  return (
    <Card
      className={`inline-flex flex-col pt-0 ${type === "attack" ? "self-start" : "self-end"} ${type === "attack" ? "bg-blue-500/50" : "bg-red-500/50"}`}
    >
      <CardHeader className="border-b-2 py-2">
        <CardTitle className="flex min-w-fit items-center justify-between gap-2">
          {type === "counter" && <UndoIcon />}
          <div className="flex flex-row items-center gap-2 rounded-md text-xl font-bold tracking-tight whitespace-nowrap">
            {weapon ? (
              <>
                <ItemIcon item={weapon} size={32} />
                {weapon.name}
              </>
            ) : (
              <>
                <FaHandFist size={16} />
                Punch
              </>
            )}
          </div>
          <div className="flex flex-row items-center gap-2 rounded-md text-sm whitespace-nowrap">
            <SwordsIcon size={16} />
            {attackPower}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-4 shadow-sm">
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Damage
            </span>
            <span className="mt-1 text-4xl font-black text-destructive">
              {finalDamage}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-4 shadow-sm">
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Hit Chance
            </span>
            <span className="mt-1 text-4xl font-black text-amber-500">
              {finalHitChance}%
            </span>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="grid grid-cols-2 text-[11px] text-muted-foreground">
        <div className="space-y-0.5">
          <div className="font-semibold text-foreground">Attacker Stats</div>
          <div>
            Attack Power:{" "}
            <span className="font-medium text-foreground">{attackPower}</span>
          </div>
          <div>
            Attack Correction:{" "}
            <span className="font-medium text-foreground">
              {attackCorrection}%
            </span>
          </div>
        </div>
        <div className="space-y-0.5 border-l pl-3">
          <div className="font-semibold text-foreground">Defender Stats</div>
          <div>
            Resistance:{" "}
            <span className="font-medium text-foreground">
              {defenderResistance}%
            </span>
          </div>
          <div>
            Defense Correction:{" "}
            <span className="font-medium text-foreground">
              {defenseCorrection}%
            </span>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  )
}
