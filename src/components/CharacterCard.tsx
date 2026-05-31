import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/reui/number-field";
import { type CharacterStats } from "@/utils/combat"; // Assuming types are located here

interface CharacterCardProps {
  initialCharacter: CharacterStats;
  onCharacterChange?: (updatedCharacter: CharacterStats) => void;
}

export function CharacterCard({ initialCharacter, onCharacterChange }: CharacterCardProps) {
  const [character, setCharacter] = useState<CharacterStats>(initialCharacter);

  // Helper function to update character attributes dynamically
  const updateAttribute = (key: keyof CharacterStats, value: string | number | null) => {
    const updated = { ...character, [key]: value };
    setCharacter(updated);
    if (onCharacterChange) onCharacterChange(updated);
  };

  // List of attributes to loop through for the grid (excluding non-number fields)
  const numericAttributes: { key: keyof CharacterStats; label: string }[] = [
    { key: "level", label: "Level" },
    { key: "strength", label: "Strength" },
    { key: "vitality", label: "Vitality" },
    { key: "intelligence", label: "Intelligence" },
    { key: "mentality", label: "Mentality" },
    { key: "agility", label: "Agility" },
    { key: "dexterity", label: "Dexterity" },
    { key: "luck", label: "Luck" },
  ];

  return (
    <Card className="w-full max-w-sm mx-auto shadow-md">
      {/* Editable Header */}
      <CardHeader className="space-y-1 border-b pb-4">
        <Label htmlFor="char-name" className="text-xs uppercase tracking-wider text-muted-foreground">
          Character Name
        </Label>
        <Input
          id="char-name"
          value={character.name}
          onChange={(e) => updateAttribute("name", e.target.value)}
          className="text-2xl font-bold bg-transparent border-none p-0 focus-visible:ring-1 focus-visible:ring-ring h-auto shadow-none"
          placeholder="Enter character name..."
        />
      </CardHeader>

      {/* Attributes Grid */}
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {numericAttributes.map(({ key, label }) => (
            <div key={key} className="flex flex-col space-y-1.5">
              <NumberField
                value={character[key] as number}
                onValueChange={(val) => updateAttribute(key, val)}
                min={1}
                max={999}
              >
                <NumberFieldScrubArea label={label} />
                <NumberFieldGroup className="w-full">
                  <NumberFieldDecrement />
                  <NumberFieldInput className="w-full text-center" />
                  <NumberFieldIncrement />
                </NumberFieldGroup>
              </NumberField>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
