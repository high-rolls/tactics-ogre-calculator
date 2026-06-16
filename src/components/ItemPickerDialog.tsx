import type { EquippableItem, ItemKey, ItemSlotType } from "@/utils/combat"
import { InventoryItem } from "./InventoryItem"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { ItemGroup } from "./ui/item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface ItemPickerDialogProps {
  item: EquippableItem | null
  searchTerm: string
  onSearchTermChange: (search: string) => void
  searchedItems: EquippableItem[]
  onItemSelected?: (item: ItemKey) => void
  onItemRemoved?: () => void
}

export function ItemPickerDialog({
  item,
  searchTerm,
  onSearchTermChange,
  searchedItems,
  onItemSelected,
  onItemRemoved,
}: ItemPickerDialogProps) {
  const itemSlotTabs: ItemSlotType[] = ["hands", "head", "body", "feet", "bag"]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <InventoryItem
          item={item}
          isRemoveButtonShown={true}
          onRemove={onItemRemoved}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm md:max-w-2xl lg:max-w-4xl">
        <DialogHeader className="gap-3">
          <DialogTitle>Select an item...</DialogTitle>
        </DialogHeader>
        <Input
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          type="text"
          placeholder="Search item..."
        ></Input>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hands">Hands</TabsTrigger>
            <TabsTrigger value="head">Head</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="feet">Feet</TabsTrigger>
            <TabsTrigger value="bag">Bag</TabsTrigger>
          </TabsList>
          <TabsContent
            value="all"
            className="-mx-4 max-h-[70vh] scrollbar-thumb-amber-100 overflow-y-auto px-4"
          >
            <ItemGroup className="gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
              {searchedItems.map((item) => (
                <DialogClose key={item.key}>
                  <InventoryItem
                    item={item}
                    onClick={() => onItemSelected?.(item.key)}
                  />
                </DialogClose>
              ))}
            </ItemGroup>
            {searchedItems.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No item found.
              </p>
            )}
          </TabsContent>
          {itemSlotTabs.map((itemSlot: ItemSlotType) => (
            <TabsContent
              key={itemSlot}
              value={itemSlot}
              className="-mx-4 max-h-[70vh] scrollbar-thumb-amber-100 overflow-y-auto px-4"
            >
              <ItemGroup className="gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
                {searchedItems
                  .filter((item) => item.slot === itemSlot)
                  .map((item) => (
                    <DialogClose key={item.key}>
                      <InventoryItem
                        item={item}
                        onClick={() => onItemSelected?.(item.key)}
                      />
                    </DialogClose>
                  ))}
              </ItemGroup>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
