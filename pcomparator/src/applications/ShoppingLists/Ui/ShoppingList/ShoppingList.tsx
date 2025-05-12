import type { ShoppingList as ShoppingListT } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListCard } from "~/applications/ShoppingLists/Ui/ShoppingList/ShoppingListCard";
import { ShoppingListEmpty } from "~/applications/ShoppingLists/Ui/ShoppingList/ShoppingListEmpty";

interface ShoppingListProps {
  lists: ShoppingListT[];
}

export const ShoppingList = ({ lists }: ShoppingListProps) => {
  if (lists.length === 0) return <ShoppingListEmpty />;

  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lists.map((list) => {
          const itemCount = list.items?.length || 0;
          const completedCount = list.items?.filter((item) => item.isCompleted).length || 0;
          const progress = itemCount > 0 ? Math.round((completedCount / itemCount) * 100) : 0;

          return (
            <ShoppingListCard
              shoppingListId={list.id}
              name={list.name}
              createdAt={list.createdAt}
              description={list.description}
              items={list.items.map((item) => ({
                id: item.id,
                customName: item.customName,
                isCompleted: item.isCompleted
              }))}
              progress={progress}
              itemCount={itemCount}
              key={list.id}
            />
          );
        })}
      </div>
    </div>
  );
};
