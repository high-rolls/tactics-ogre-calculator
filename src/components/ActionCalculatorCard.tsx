import { AttackPredictionCard } from "@/components/AttackPredictionCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { withDefault } from "@/lib/utils"
import { calculateCharacterCorrection, isIndirectWeapon, type AttackDirection, type ResolvedCharacter, type TerrainStats, type WeaponStats, type WeatherType } from "@/utils/combat"
import { ITEM_BY_KEY } from "@/utils/items"
import { TERRAINS } from "@/utils/terrains"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"
import { useMemo, useState } from "react"
import {
  WiCloudy,
  WiDaySunny,
  WiRain,
  WiSprinkle,
  WiThunderstorm,
} from "react-icons/wi"

interface ActionCalculatorCardProps {
  attacker: ResolvedCharacter
  defender: ResolvedCharacter
}

export default function ActionCalculatorCard({
  attacker,
  defender,
}: ActionCalculatorCardProps) {
  const [direction, setDirection] = useState<AttackDirection>("front")
  const [attackerTerrain, setAttackerTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [defenderTerrain, setDefenderTerrain] = useState<TerrainStats>(
    TERRAINS[0]
  )
  const [weather, setWeather] = useState<WeatherType>("sunny")

  const attackerAttackCorrection = useMemo(
    () =>
      calculateCharacterCorrection(
        attacker,
        attackerTerrain,
        weather,
        true,
        true
      ),
    [attacker, attackerTerrain, weather]
  )
  const attackerDefenseCorrection = useMemo(
    () =>
      calculateCharacterCorrection(
        attacker,
        attackerTerrain,
        weather,
        false,
        true
      ),
    [attacker, attackerTerrain, weather]
  )
  const defenderAttackCorrection = useMemo(
    () =>
      calculateCharacterCorrection(
        defender,
        defenderTerrain,
        weather,
        true,
        true
      ),
    [defender, defenderTerrain, weather]
  )
  const defenderDefenseCorrection = useMemo(
    () =>
      calculateCharacterCorrection(
        defender,
        defenderTerrain,
        weather,
        false,
        true
      ),
    [defender, defenderTerrain, weather]
  )

  const attackerDirectWeapons = useMemo(
    () =>
      withDefault(
        attacker.equippedItems.filter(
          (item): item is WeaponStats =>
            item?.type === "weapon" && !isIndirectWeapon(item.category)
        ),
        ITEM_BY_KEY["punch"]
      ) as WeaponStats[],
    [attacker]
  )

  const attackerIndirectWeapons = useMemo(
    () =>
      withDefault(
        attacker.equippedItems.filter(
          (item): item is WeaponStats =>
            item?.type === "weapon" && isIndirectWeapon(item.category)
        ),
        ITEM_BY_KEY["stone"]
      ) as WeaponStats[],
    [attacker]
  )

  const attackerWeapons = useMemo(
    () => [...attackerDirectWeapons, ...attackerIndirectWeapons],
    [attackerDirectWeapons, attackerIndirectWeapons]
  )

  const defenderDirectWeapons = useMemo(
    () =>
      withDefault(
        defender.equippedItems.filter(
          (item): item is WeaponStats =>
            item?.type === "weapon" && !isIndirectWeapon(item.category)
        ),
        ITEM_BY_KEY["punch"]
      ) as WeaponStats[],
    [defender]
  )

  const defenderIndirectWeapons = useMemo(
    () =>
      withDefault(
        defender.equippedItems.filter(
          (item): item is WeaponStats =>
            item?.type === "weapon" && isIndirectWeapon(item.category)
        ),
        ITEM_BY_KEY["stone"]
      ) as WeaponStats[],
    [defender]
  )

  const defenderWeapons = useMemo(
    () => [...defenderDirectWeapons, ...defenderIndirectWeapons],
    [defenderDirectWeapons, defenderIndirectWeapons]
  )

  return (
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
              onValueChange={(val) => setDirection(val as AttackDirection)}
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
          <div className="col-span-5 flex flex-col gap-4 lg:col-span-12 xl:col-span-5">
            <Field>
              <FieldLabel>Attacker Terrain</FieldLabel>
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
                  {TERRAINS.map((terrain, index) => (
                    <SelectItem
                      key={`attackerTerrain${index}`}
                      value={terrain.name}
                    >
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
                onValueChange={(name) => {
                  console.log(name)
                  setDefenderTerrain(TERRAINS.find((t) => t.name === name)!)
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TERRAINS.map((terrain, index) => (
                    <SelectItem
                      key={`defenderTerrain${index}`}
                      value={terrain.name}
                    >
                      {terrain.name} (+{terrain.defenseModifier}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        <div className="grid max-h-[60vh] scrollbar-thumb-amber-200 grid-cols-2 gap-3 overflow-y-auto border-t py-4 pe-2 lg:grid-cols-1 2xl:grid-cols-2">
          <div className="flex flex-col items-start gap-2">
            {attackerWeapons.map((weapon) => (
              <AttackPredictionCard
                attacker={attacker}
                defender={defender}
                weapon={weapon}
                attackDirection={direction}
                attackerCorrection={attackerAttackCorrection}
                defenderCorrection={defenderDefenseCorrection}
                type="attack"
              />
            ))}
          </div>
          <div className="flex flex-col items-end gap-2">
            {defenderWeapons.map((weapon) => (
              <AttackPredictionCard
                attacker={defender}
                defender={attacker}
                weapon={weapon}
                attackDirection="front"
                attackerCorrection={defenderAttackCorrection}
                defenderCorrection={attackerDefenseCorrection}
                type="counter"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
