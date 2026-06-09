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
  type CharacterStats,
  type ElementalModifiers,
  type EquippableItem,
  type TerrainStats,
  type WeaponStats,
  type WeatherType,
} from "@/utils/combat"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface AttackPredictionCardProps {
  attacker: CharacterStats
  defender: CharacterStats
  attackerItems: (EquippableItem | null)[]
  defenderItems: (EquippableItem | null)[]
  weapon: WeaponStats | null
  attackerTerrain: TerrainStats
  defenderTerrain: TerrainStats
  sideModifier: number
  weather: WeatherType
  attackCorrection: number
  defenseCorrection: number
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
}: AttackPredictionCardProps) {
  const adjustedAttacker = getAdjustedStats(attacker, attackerItems)
  const adjustedDefender = getAdjustedStats(defender, defenderItems)

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

  const attackCorrection = Math.max(
    0,
    Math.min(
      200,
      50 +
        attackerTerrain.attackModifier +
        WEATHER_ALIGNMENT_MODIFIERS[weather][adjustedAttacker.alignment] +
        adjustedAttacker.class.weatherResistance +
        attackerTerrainBonus +
        weaponElementModifier +
        preferredWeaponBonus
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
        adjustedDefender.class.weatherResistance
    )
  )

  const weaponMultiplier = weapon !== null ? 1.0 : 0.5

  const finalHitChance = Math.max(
    0,
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
    <Card className="mx-3 mb-4 border bg-card shadow-sm">
      <CardHeader className="border-b bg-muted/20 py-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
          {weapon ? `⚔️ ${weapon.name}` : "🤜 Unarmed (Fists)"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-2 text-[11px] text-muted-foreground">
          <div className="space-y-0.5">
            <div className="font-semibold text-foreground">Attacker Stats</div>
            <div>
              Attack Power:{" "}
              <span className="font-medium text-foreground">{attackPower}</span>
            </div>
            <div>
              Accuracy:{" "}
              <span className="font-medium text-foreground">
                {attackerAccuracy}
              </span>
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
              Defense Power:{" "}
              <span className="font-medium text-foreground">
                {defensePower}
              </span>
            </div>
            <div>
              Evasiveness:{" "}
              <span className="font-medium text-foreground">
                {defenderEvasiveness}
              </span>
            </div>
            <div>
              Defense Correction:{" "}
              <span className="font-medium text-foreground">
                {defenseCorrection}%
              </span>
            </div>
            <div>
              Defender Resistance:{" "}
              <span className="font-medium text-foreground">
                {defenderResistance}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
