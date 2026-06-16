const iconModules = import.meta.glob("../assets/items/*.gif", {
  eager: true,
})

export const ITEM_ICON_KEYS = new Set(
  Object.keys(iconModules).map((path) =>
    path.split("/").pop()!.replace(".gif", "")
  )
)

export function hasItemIcon(key: string): boolean {
  return ITEM_ICON_KEYS.has(key)
}
