"use client";
import { addToast } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { addItemToList } from "~/applications/ShoppingLists/Actions/shoppingListActions";
import { UnitSchema } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";
import useForm from "~/components/Form/useForm";
import { Input } from "~/components/Inputs/Input/Input";

export default function ShoppingListAddItemForm({
  listId,
  onItemAdded
}: {
  listId: string;
  onItemAdded: (item: any) => void;
}) {
  const form = useForm<{ name: string; quantity: string }>(undefined);
  const [unit, setUnit] = useState("unit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({
    name,
    quantity
  }: {
    name: string;
    quantity: string;
  }) => {
    console.log("Form submitted with data:", { name, quantity, unit });
    if (!name.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const itemData = {
        name: name,
        quantity: Number.parseFloat(quantity),
        unit,
        isCompleted: false
      };

      // Appel à l'API pour ajouter l'item à la liste
      // @ts-ignore
      const newItem = await addItemToList(listId, { ...itemData, customName: itemData.name });

      // Mise à jour UI locale
      if (onItemAdded && newItem) {
        onItemAdded(newItem);
      }

      // Réinitialiser le formulaire
      setUnit("unit");

      // Focus sur le champ de nom pour faciliter l'ajout rapide d'items si pas dans modale
      const nameInput = document.getElementById("name");
      if (nameInput) {
        (nameInput as HTMLInputElement).focus();
      }
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour gérer correctement le changement d'unité
  const handleUnitChange = (e: any) => {
    if (e?.target?.value) {
      setUnit(e.target.value);
    } else if (e && typeof e.value === "string") {
      setUnit(e.value);
    } else if (typeof e === "string") {
      setUnit(e);
    } else {
      setUnit(String(e));
    }
  };

  return (
    <form.Form
      methods={form.methods}
      actions={{
        nextProps: {
          title: "Add Item",
          fullWidth: true
        }
      }}
      onSubmit={async (data) => {
        console.log("Form submitted with data:", data);
        handleSubmit(data);
        addToast({
          title: <Trans>Item added successfully!</Trans>,
          description: <Trans>Item has been successfully added to your shopping list.</Trans>,
          variant: "solid",
          color: "success"
        });
      }}
    >
      <div className="space-y-4">
        <Input labelPlacement="outside" placeholder=" " name="tmp" className="hidden" hidden />
        <div className="space-y-2">
          <label htmlFor="name">
            Item Name
            <Input id="name" name="name" placeholder="e.g., Milk, Bread, etc." isRequired autoFocus />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="quantity">
              Quantity
              <Input
                placeholder="1"
                size="lg"
                id="quantity"
                type="number"
                name="quantity"
                lang="fr-FR"
                isRequired
              />
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="unit">Unit</label>
            <Select className="w-full" label="Unit" selectedKeys={[unit]} onChange={handleUnitChange}>
              {Object.values(UnitSchema.Values).map((unitValue) => (
                <SelectItem key={unitValue} value={unitValue}>
                  {unitValue}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </form.Form>
  );
}
