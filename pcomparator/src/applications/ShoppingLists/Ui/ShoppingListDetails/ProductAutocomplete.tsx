"use client";

import { Autocomplete, AutocompleteItem, Avatar, Chip } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { PackageIcon, ShoppingCartIcon, TrendingUpIcon } from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { Currency, getCurrencySymbol } from "~/applications/Prices/Domain/ValueObjects/Currency";
import {
  type ProductSearchResult,
  searchProducts
} from "~/applications/ShoppingLists/Api/searchProducts.api";
import { useDebounce } from "../../../../hooks/useDebounce";

interface ProductAutocompleteProps {
  onProductSelect: (product: ProductSearchResult) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const ProductAutocomplete = ({
  onProductSelect,
  placeholder = "Search for products...",
  className = "",
  isDisabled = false,
  value = "",
  onValueChange,
  onKeyDown
}: ProductAutocompleteProps) => {
  const [searchValue, setSearchValue] = useState(value);
  const [products, setProducts] = useState<ProductSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 300);

  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchProducts(query);
      setProducts(results);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Déclencher la recherche quand la valeur debouncée change
  useMemo(() => {
    handleSearch(debouncedSearchValue);
  }, [debouncedSearchValue, handleSearch]);

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    onValueChange?.(value);
  };

  const handleSelectionChange = (key: React.Key | null) => {
    if (key) {
      const selectedProduct = products.find((p) => p.id === String(key));
      if (selectedProduct) {
        onProductSelect(selectedProduct);
        setSearchValue("");
        setProducts([]);
      }
    }
  };

  // Détecter si l'input ressemble à une saisie manuelle avec quantité/prix
  const isManualInput = (input: string) => {
    const regex = /^([\d.,]+)\s*([a-zA-Z]{1,2})?\s+(.+?)(?:\s+([\d.,]+)(?:€|\$|£)?)?$/;
    return regex.test(input.trim());
  };

  const renderProductItem = (product: ProductSearchResult) => {
    const currencySymbol = getCurrencySymbol((product.prices[0]?.currency as Currency) || Currency.Euro);

    return (
      <div className="flex items-center gap-3 py-1">
        <Avatar
          icon={<PackageIcon className="w-4 h-4" />}
          className="bg-primary-100 text-primary-600"
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{product.name}</p>
          <div className="flex items-center gap-2 mt-1">
            {product.bestPrice && (
              <Chip
                size="sm"
                variant="flat"
                color="success"
                startContent={<TrendingUpIcon className="w-3 h-3" />}
              >
                {currencySymbol}
                {product.bestPrice.amount.toFixed(2)}
              </Chip>
            )}
            {product.prices.length > 1 && (
              <Chip size="sm" variant="flat" color="default">
                <Trans>{product.prices.length} stores</Trans>
              </Chip>
            )}
          </div>
        </div>
        <div className="text-right">
          {product.bestPrice && <p className="text-xs text-gray-500">@ {product.bestPrice.store}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <Autocomplete
        inputValue={searchValue}
        onInputChange={handleInputChange}
        onSelectionChange={handleSelectionChange}
        isLoading={isLoading}
        placeholder={placeholder}
        startContent={<ShoppingCartIcon className="w-4 h-4 text-gray-400" />}
        isDisabled={isDisabled}
        size="lg"
        className="w-full"
        onKeyDown={onKeyDown}
        listboxProps={{
          emptyContent:
            searchValue.length >= 2 ? (
              products.length === 0 && !isLoading ? (
                <div className="text-center py-4">
                  <PackageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    <Trans>No products found</Trans>
                  </p>
                  {isManualInput(searchValue) ? (
                    <p className="text-xs text-green-600 mt-1">
                      <Trans>Press Enter to add this item manually</Trans>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">
                      <Trans>Try adding manually: "2 kg apples" or "1 bottle milk 2.50€"</Trans>
                    </p>
                  )}
                </div>
              ) : null
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  <Trans>Type at least 2 characters to search</Trans>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  <Trans>Or use format: "2 kg apples" for quick add</Trans>
                </p>
              </div>
            )
        }}
        popoverProps={{
          offset: 8,
          className: "w-full"
        }}
      >
        {products.map((product) => (
          <AutocompleteItem key={product.id} textValue={product.name}>
            {renderProductItem(product)}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
