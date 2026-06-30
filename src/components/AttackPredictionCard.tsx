import { ElementIcon } from "@/components/ElementIcon"
import { ItemIcon } from "@/components/ItemIcon"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  calculateAttackPower,
  calculateDefensePower,
  calculateHitChance,
  calculateNetElementalResistance,
  calculatePhysicalResistance,
  calculateWeaponCorrection,
  isIndirectWeapon,
  type AttackDirection,
  type ResolvedCharacter,
  type WeaponStats,
} from "@/utils/combat"
import { BowArrowIcon, SwordsIcon, XIcon } from "lucide-react"
import { useMemo } from "react"

interface AttackPredictionCardProps {
  attacker: ResolvedCharacter
  defender: ResolvedCharacter
  weapon: WeaponStats
  attackDirection: AttackDirection
  attackerCorrection: number
  defenderCorrection: number
  className?: string
}

export function AttackPredictionCard({
  attacker,
  defender,
  weapon,
  attackDirection,
  attackerCorrection,
  defenderCorrection,
  className,
}: AttackPredictionCardProps) {
  const weaponCorrection = useMemo(
    () => calculateWeaponCorrection(attacker, defender, weapon),
    [attacker, defender, weapon]
  )

  const attackCorrection = useMemo(
    () => Math.max(0, Math.min(200, attackerCorrection + weaponCorrection)),
    [attackerCorrection, weaponCorrection]
  )

  const defenseCorrection = useMemo(
    () => Math.max(0, Math.min(200, defenderCorrection)),
    [defenderCorrection]
  )

  const finalHitChance = useMemo(
    () =>
      calculateHitChance(
        attacker,
        defender,
        attackCorrection,
        defenseCorrection,
        attackDirection
      ),
    [attacker, defender, attackCorrection, defenseCorrection, attackDirection]
  )

  const attackPower = useMemo(
    () => calculateAttackPower(attacker, weapon),
    [attacker, weapon]
  )

  const defensePower = useMemo(
    () => calculateDefensePower(defender),
    [defender]
  )

  const defenderPhysicalResistance = useMemo(
    () => calculatePhysicalResistance(defender),
    [defender]
  )

  const defenderNetResistances = useMemo(
    () => calculateNetElementalResistance(defender),
    [defender]
  )

  const defenderResistance = useMemo(
    () =>
      weapon?.element === undefined
        ? defenderPhysicalResistance
        : defenderNetResistances[weapon.element],
    [weapon, defenderPhysicalResistance, defenderNetResistances]
  )

  const baseDamage = useMemo(
    () =>
      Math.trunc(
        ((Math.trunc((attackPower * attackCorrection) / 100) -
          Math.trunc((defensePower * defenseCorrection) / 100)) *
          defenderResistance) /
          100
      ),
    [
      attackPower,
      attackCorrection,
      defensePower,
      defenseCorrection,
      defenderResistance,
    ]
  )
  const finalDamage = useMemo(() => {
    const rawDamage =
      (baseDamage + attacker.luck - defender.luck) * (weapon?.multiplier || 1.0)
    return Math.max(
      1,
      weapon.roundingFunction
        ? weapon.roundingFunction(rawDamage)
        : Math.round(rawDamage)
    )
  }, [baseDamage, attacker, defender, weapon])

  return (
    <Card className={cn("w-full max-w-xs", className)}>
      <CardContent className="flex flex-col gap-3 items-center">
        <div className="flex flex-row w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {weapon.slot && (
              <div className="flex size-11 items-center justify-center rounded-sm bg-amber-200 [&_img]:size-8">
                <ItemIcon item={weapon} />
              </div>
            )}
            <h1 className="text-lg">{weapon.name}</h1>
          </div>
          <div className="flex flex-row gap-1 text-xs text-muted-foreground">
            <div className="flex flex-col items-center">
              {weapon.element ? (
                <ElementIcon element={weapon.element} size={16} />
              ) : isIndirectWeapon(weapon.category) ? (
                <BowArrowIcon size={16} />
              ) : (
                <SwordsIcon size={16} />
              )}
              {attackPower}
            </div>
            <div className="flex flex-col items-center">
              <XIcon size={16} />
              {attackCorrection}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-2 shadow-sm">
            <span className="mt-1 text-xl font-black text-destructive">
              {finalDamage}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Damage
            </span>
          </div>


          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-2 shadow-sm">
            <span className="mt-1 text-xl font-black text-amber-500">
              {finalHitChance}%
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Hit Chance
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
