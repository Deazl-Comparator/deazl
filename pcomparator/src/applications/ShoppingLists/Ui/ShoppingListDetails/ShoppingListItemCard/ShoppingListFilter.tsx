import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Tab,
  Tabs
} from "@heroui/react";
import { ChevronDownIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";

interface ShoppingListFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: string;
  setFilter: (filter: any) => void;
  sortBy: string;
  sortDirection: string;
  toggleSortDirection: () => void;
  setSortBy: (sortBy: any) => void;
}

export const ShoppingListFilter = ({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  sortBy,
  sortDirection,
  toggleSortDirection,
  setSortBy
}: ShoppingListFilterProps) => (
  <>
    <div className="flex gap-3 mb-2">
      <Input
        className="max-w-xs"
        placeholder="Search items..."
        startContent={<SearchIcon className="h-4 w-4 text-gray-400" />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        isClearable
        autoFocus={false}
        tabIndex={undefined}
        isDisabled
        onClear={() => setSearchTerm("")}
      />

      <div className="flex gap-2 items-center">
        <Tabs
          selectedKey={filter}
          onSelectionChange={setFilter}
          size="sm"
          color="primary"
          className="hidden sm:flex"
        >
          <Tab key="pending" title="To Buy" />
          <Tab key="completed" title="Completed" />
          <Tab key="all" title="All" />
        </Tabs>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              endContent={<ChevronDownIcon className="h-4 w-4" />}
              startContent={<SlidersHorizontalIcon className="h-4 w-4" />}
            >
              Sort
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Sort options"
            selectedKeys={[sortBy]}
            selectionMode="single"
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as "name" | "price" | "added" | "unit";
              if (selected === sortBy) toggleSortDirection();
              else setSortBy(selected);
            }}
          >
            <DropdownItem key="name">By Name</DropdownItem>
            <DropdownItem key="price">By Price</DropdownItem>
            <DropdownItem key="unit">By Unit</DropdownItem>
            <DropdownItem key="added">By Added Date</DropdownItem>
            <DropdownItem
              key="direction"
              startContent={
                sortDirection === "asc" ? (
                  <span className="text-xs">↑ Ascending</span>
                ) : (
                  <span className="text-xs">↓ Descending</span>
                )
              }
              onClick={toggleSortDirection}
            >
              Toggle Direction
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>

    <div className="flex sm:hidden mb-2">
      <Tabs selectedKey={filter} onSelectionChange={setFilter} size="sm" color="primary" fullWidth>
        <Tab key="pending" title="To Buy" />
        <Tab key="completed" title="Completed" />
        <Tab key="all" title="All" />
      </Tabs>
    </div>
  </>
);
