import {
  calculateAttackPower,
  calculateDefensePower,
  calculateNetElementalResistance,
  calculatePhysicalResistance,
  calculateWeaponCorrection,
  isIndirectWeapon,
  type ResolvedCharacter,
  type WeaponStats,
  calculateHitChance,
  type AttackDirection,
} from "@/utils/combat"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { ItemIcon } from "./ItemIcon"
import { BowArrowIcon, SwordsIcon, XIcon } from "lucide-react"
import { FaHandFist } from "react-icons/fa6"
import { ElementIcon } from "./ElementIcon"

interface AttackPredictionCardProps {
  attacker: ResolvedCharacter
  defender: ResolvedCharacter
  weapon: WeaponStats
  attackDirection: AttackDirection
  attackerCorrection: number
  defenderCorrection: number
  type: "attack" | "counter"
}

export function AttackPredictionCard({
  attacker,
  defender,
  weapon,
  attackDirection,
  attackerCorrection,
  defenderCorrection,
  type,
}: AttackPredictionCardProps) {
  const weaponCorrection = calculateWeaponCorrection(attacker, weapon)

  const attackCorrection = Math.max(
    0,
    Math.min(
      200,
      50 +
        attackerCorrection +
        weaponCorrection
    )
  )

  const defenseCorrection = Math.max(0,Math.min(200, 50 + defenderCorrection))

  const weaponMultiplier = weapon?.multiplier || 1.0

  const finalHitChance = calculateHitChance(attacker, defender, attackCorrection, defenseCorrection, attackDirection)

  const attackPower = calculateAttackPower(attacker, weapon)
  const defensePower = calculateDefensePower(defender)
  const defenderPhysicalResistance = calculatePhysicalResistance(defender)
  const defenderNetResistances = calculateNetElementalResistance(defender)

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
      (baseDamage + attacker.luck - defender.luck) *
        weaponMultiplier
    )
  )

  return (
    <Card
      className={`gap-2 pt-0 rounded-md ${type === "attack" ? "justify-self-start" : "justify-self-end"} ${type === "attack" ? "bg-blue-500/50" : "bg-red-500/50"}`}
    >
      <CardHeader className="border-b-2 py-2">
        <CardTitle className="flex min-w-fit items-center justify-between gap-2">
          {/* {type === "counter" && <UndoIcon />} */}
          <div className="flex flex-row items-center gap-2 rounded-md text-2xl font-medium tracking-tighter whitespace-nowrap">
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
          <div className="flex flex-row items-center gap-2 text-sm whitespace-nowrap">
            <div className="flex flex-col items-center">
              {weapon.element ? (
                <ElementIcon element={weapon.element} size={16} />
              ) : (
              isIndirectWeapon(weapon.category) ? (
                <BowArrowIcon size={16} />
              ) : (
                <SwordsIcon size={16} />
              ))}
              {attackPower}
            </div>
            <div className="flex flex-col items-center">
              <XIcon size={16} />
              {attackCorrection}%
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-2 shadow-sm">
            <span className="mt-1 text-2xl font-black text-destructive">
              {finalDamage}
            </span>
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Damage
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-2 shadow-sm">
            <span className="mt-1 text-2xl font-black text-amber-500">
              {finalHitChance}%
            </span>
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Hit Chance
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 text-[11px] text-muted-foreground">
        <div className="space-y-0.5">
          
        </div>
        <div className="space-y-0.5 border-l pl-3">
          <div className="font-semibold text-foreground">Defender</div>
          <div>
            RES:{" "}
            <span className="font-medium text-foreground">
              {defenderResistance}%
            </span>
          </div>
          <div>
            COR:{" "}
            <span className="font-medium text-foreground">
              {defenseCorrection}%
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
