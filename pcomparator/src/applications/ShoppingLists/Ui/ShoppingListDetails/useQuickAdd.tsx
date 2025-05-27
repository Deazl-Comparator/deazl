import { addToast } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { type KeyboardEvent, useRef, useState } from "react";
import { addItemToList } from "~/ShoppingLists/Api/addItemToList.api";
import { UnitType } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";

export const useQuickAdd = (listId: string, onItemAdded?: (item: any) => void) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseInput = (input: string) => {
    // Regex améliorée pour supporter plus de formats
    const regex = /^([\d.,]+)\s*([a-zA-Z]{1,2})?\s+(.+?)(?:\s+([\d.,]+)(?:€|\$|£)?)?$/;
    const match = input.match(regex);

    if (match) {
      const quantity = Number.parseFloat(match[1].replace(",", "."));
      let unit = match[2]?.toLowerCase() || "unit";
      const name = match[3].trim();
      const price = match[4] ? Number.parseFloat(match[4].replace(",", ".")) : undefined;

      // Mapping d'unités plus complet
      const unitMapping: Record<string, string> = {
        g: "g",
        gr: "g",
        kg: "kg",
        kilo: "kg",
        l: "l",
        litre: "l",
        ml: "ml",
        u: "unit",
        un: "unit",
        pc: "unit",
        pcs: "unit",
        pièce: "unit",
        pièces: "unit"
      };

      if (unit in unitMapping) unit = unitMapping[unit];

      const validUnit = Object.values(UnitType).includes(unit as any) ? unit : "unit";

      return {
        quantity: Number.isNaN(quantity) ? 1 : quantity,
        unit: validUnit,
        name,
        price: price && !Number.isNaN(price) ? price : undefined
      };
    }

    // Si pas de match, c'est probablement juste un nom de produit
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
    if (!inputValue.trim() || isSubmitting) return;

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

      const newItem = await addItemToList(listId, itemData);

      if (onItemAdded && newItem) onItemAdded(newItem);

      // Message de succès plus informatif
      let successMessage = `${parsedInput.name}`;
      if (parsedInput.quantity !== 1 || parsedInput.unit !== "unit") {
        successMessage += ` (${parsedInput.quantity} ${parsedInput.unit})`;
      }
      if (parsedInput.price) {
        successMessage += ` - ${parsedInput.price.toFixed(2)}€`;
      }

      addToast({
        title: <Trans>Item added successfully</Trans>,
        description: successMessage,
        variant: "solid",
        color: "success"
      });
      // }

      setInputValue("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error adding item to list:", error);

      // Message d'erreur plus spécifique
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

      addToast({
        title: <Trans>Failed to add item</Trans>,
        description: errorMessage,
        variant: "solid",
        color: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    inputValue,
    setInputValue,
    handleKeyDown,
    handleAddItem,
    inputRef,
    isSubmitting
  };
};
