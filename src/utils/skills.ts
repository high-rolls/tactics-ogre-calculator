import type { Skill } from "./combat"

export const SKILL_CATALOG: Skill[] = [
  {
    name: "Stun",
    type: "ailment",
    element: "fire",
    alignment: "neutral",
    mpCost: 22,
    skillSets: ["witch", "warlock"],
  },
]
