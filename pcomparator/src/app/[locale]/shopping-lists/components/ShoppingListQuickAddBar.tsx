"use client";

import { Input } from "@heroui/react";
import { addToast } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { PlusIcon } from "lucide-react";
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

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-gray-500 mb-1">
        <span className="font-medium">Quick Add Format: </span>
        <span>quantity unit product price (e.g. "500g potatoes 2.99€")</span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          ref={inputRef}
          className="flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add item (e.g. 500g potatoes 2.99€, 2 apples...)"
          size="lg"
          startContent={
            <div className="text-sm text-gray-400 pointer-events-none">
              <PlusIcon size={18} />
            </div>
          }
          autoFocus
        />
        {/* <Button
          color="primary"
          isLoading={isSubmitting}
          isDisabled={!inputValue.trim() || isSubmitting}
          onClick={handleAddItem}
        >
          Add
        </Button> */}
      </div>
    </div>
  );
}
