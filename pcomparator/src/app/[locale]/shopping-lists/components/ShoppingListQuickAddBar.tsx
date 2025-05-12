"use client";

import { Input, Tooltip, addToast } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { HelpCircleIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { type KeyboardEvent, useRef, useState } from "react";
import { addItemToList } from "~/applications/ShoppingLists/Actions/shoppingListActions";
import { UnitSchema } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";

export default function ShoppingListQuickAddBar({
  listId,
  onItemAdded
}: {
  listId: string;
  onItemAdded: (item: any) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Regex pour extraire aussi le prix avec format 500g patates 2.99€
  const parseInput = (input: string) => {
    const regex = /^([\d.,]+)\s*([a-zA-Z]{1,2})?\s+(.+?)(?:\s+([\d.,]+)(?:€|\$|£)?)?$/;
    const match = input.match(regex);

    if (match) {
      const quantity = Number.parseFloat(match[1].replace(",", "."));
      let unit = match[2]?.toLowerCase() || "unit";
      const name = match[3].trim();

      // Extraire le prix si présent
      const price = match[4] ? Number.parseFloat(match[4].replace(",", ".")) : undefined;

      // Mapping des unités courtes vers les unités complètes
      const unitMapping: Record<string, string> = {
        g: "g",
        kg: "kg",
        l: "l",
        ml: "ml",
        u: "unit"
      };

      // Vérifier si l'unité est reconnue
      if (unit in unitMapping) {
        unit = unitMapping[unit];
      }

      // Vérifier si l'unité est valide selon l'enum
      const validUnit = Object.values(UnitSchema.Values).includes(unit as any) ? unit : "unit";

      return {
        quantity: Number.isNaN(quantity) ? 1 : quantity,
        unit: validUnit,
        name,
        price
      };
    }

    // Si le format n'est pas reconnu, considérer tout comme le nom
    return {
      quantity: 1,
      unit: "unit",
      name: input.trim(),
      price: undefined
    };
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleAddItem = async () => {
    if (!inputValue.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedInput = parseInput(inputValue);

      const itemData = {
        customName: parsedInput.name,
        quantity: parsedInput.quantity,
        unit: parsedInput.unit,
        isCompleted: false,
        price: parsedInput.price
      };

      // Appel à l'API pour ajouter l'item à la liste
      // @ts-ignore
      const newItem = await addItemToList(listId, itemData);

      // Mise à jour UI locale
      if (onItemAdded && newItem) {
        onItemAdded(newItem);
        let successMessage = `${parsedInput.name} (${parsedInput.quantity} ${parsedInput.unit})`;
        if (parsedInput.price) {
          successMessage += ` - ${parsedInput.price.toFixed(2)}€`;
        }

        addToast({
          title: <Trans>Item added</Trans>,
          description: successMessage,
          variant: "solid",
          color: "success",
          // @ts-ignore
          duration: 2000
        });
      }

      // Réinitialiser le champ mais garder le focus
      setInputValue("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error adding item:", error);
      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to add item</Trans>,
        variant: "solid",
        color: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const examples = ["2 apples", "500g rice", "1.5l milk 2.49€"];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <SparklesIcon size={16} className="text-primary-500" />
        <span className="text-sm text-gray-600 font-medium">Quick Add</span>
        <Tooltip
          content={
            <div className="p-2 max-w-xs">
              <p className="font-medium mb-1">Format: quantity unit product price</p>
              <p className="mb-2">Examples:</p>
              <ul className="space-y-1 text-sm">
                <li>• 2 apples</li>
                <li>• 500g rice</li>
                <li>• 1.5l milk 2.49€</li>
              </ul>
            </div>
          }
        >
          <span>
            <HelpCircleIcon size={14} className="text-gray-400 cursor-help" />
          </span>
        </Tooltip>
      </div>

      <div className="flex gap-2 items-center">
        <Input
          ref={inputRef}
          className="flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add item (e.g. 500g potatoes 2.99€)"
          size="lg"
          startContent={
            <div className="text-sm text-primary-500 pointer-events-none">
              <PlusIcon size={18} />
            </div>
          }
          // endContent={
          //   <Button
          //     isIconOnly
          //     color="primary"
          //     size="sm"
          //     className="mr-1"
          //     isLoading={isSubmitting}
          //     isDisabled={!inputValue.trim() || isSubmitting}
          //     onClick={handleAddItem}
          //   >
          //     <PlusIcon size={16} />
          //   </Button>
          // }
          autoFocus
        />
      </div>

      {/* <div className="flex flex-wrap gap-2 mt-1">
        {examples.map((example, index) => (
          <Chip
            key={index}
            variant="flat"
            color="primary"
            className="cursor-pointer hover:bg-primary-100 transition-colors"
            onClick={() => setInputValue(example)}
            startContent={<PlusIcon size={12} />}
            animation="pulse"
          >
            {example}
          </Chip>
        ))}
      </div>

      <div className="flex justify-end mt-1">
        <Button
          size="sm"
          variant="light"
          color="primary"
          className="text-xs"
          onClick={() => {
            // Générer des suggestions aléatoires plus complexes
            const suggestions = [
              "2kg rice 3.99€",
              "6 eggs 2.50€",
              "1.5l orange juice 1.99€",
              "500g pasta 0.89€",
              "250g cheese 4.29€"
            ];

            // Sélectionner une suggestion aléatoire
            const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            setInputValue(randomSuggestion);
          }}
        >
          <SparklesIcon size={12} className="mr-1" />
          Suggest item
        </Button>
      </div> */}
    </div>
  );
}
