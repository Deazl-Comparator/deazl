"use client";

import { Avatar, Button, Card, CardBody, Chip, Input, Spinner, Tooltip } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import {
  HelpCircleIcon,
  PlusIcon,
  SearchIcon,
  StoreIcon,
  TagIcon,
  TrendingUpIcon,
  ZapIcon
} from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProductSearchResult } from "~/ShoppingLists/Api/searchProducts.api";
import {
  type SmartSuggestion,
  useSmartProductSearch
} from "~/ShoppingLists/Ui/ShoppingListDetails/useSmartProductSearch";

interface SmartItemInputProps {
  listId: string;
  className?: string;
  onItemAdded?: (item: any) => void;
  onProductSelected?: (product: ProductSearchResult, quantity: number, unit: string, price?: number) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SmartItemInput = forwardRef<HTMLInputElement, SmartItemInputProps>(
  (
    {
      listId,
      className = "",
      onItemAdded,
      onProductSelected,
      placeholder = "Rechercher ou ajouter un produit (ex: 2kg pommes, lait, 500g riz 2.99€)",
      autoFocus = false
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const {
      inputValue,
      suggestions,
      isLoading,
      isOpen,
      parsedInput,
      handleInputChange,
      handleSuggestionSelect: originalHandleSuggestionSelect,
      handleInputBlur,
      handleInputFocus,
      clearInput
    } = useSmartProductSearch({
      onProductSelected: (product, parsedItem) => {
        onProductSelected?.(product, parsedItem.quantity, parsedItem.unit, parsedItem.price);
        clearInput();
      }
    });

    // Wrapper pour gérer les suggestions quick-add
    const handleSuggestionSelect = useCallback(
      (suggestion: SmartSuggestion) => {
        if (suggestion.type === "quick-add") {
          console.log("SmartItemInput: Adding custom item via quick-add:", suggestion.parsedItem);
          onItemAdded?.({
            customName: suggestion.parsedItem.productName,
            quantity: suggestion.parsedItem.quantity,
            unit: suggestion.parsedItem.unit,
            price: suggestion.parsedItem.price,
            isCompleted: false
          });
          clearInput();
        } else {
          originalHandleSuggestionSelect(suggestion);
        }
      },
      [originalHandleSuggestionSelect, onItemAdded, clearInput]
    );

    // Calculer la position du dropdown pour éviter le clipping
    useEffect(() => {
      if (isOpen && containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownMaxHeight = 320; // max-h-80 = 20rem = 320px

        // Vérifier s'il y a assez d'espace en bas
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow >= dropdownMaxHeight) {
          // Afficher en bas
          setDropdownStyle({
            position: "fixed",
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
            maxHeight: Math.min(dropdownMaxHeight, spaceBelow - 8)
          });
        } else if (spaceAbove >= dropdownMaxHeight) {
          // Afficher en haut
          setDropdownStyle({
            position: "fixed",
            bottom: viewportHeight - rect.top + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
            maxHeight: Math.min(dropdownMaxHeight, spaceAbove - 8)
          });
        } else {
          // Utiliser l'espace disponible le plus grand
          if (spaceBelow > spaceAbove) {
            setDropdownStyle({
              position: "fixed",
              top: rect.bottom + 4,
              left: rect.left,
              width: rect.width,
              zIndex: 9999,
              maxHeight: spaceBelow - 8
            });
          } else {
            setDropdownStyle({
              position: "fixed",
              bottom: viewportHeight - rect.top + 4,
              left: rect.left,
              width: rect.width,
              zIndex: 9999,
              maxHeight: spaceAbove - 8
            });
          }
        }
      }
    }, [isOpen, suggestions.length]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && inputValue.trim()) {
        // Si des suggestions sont ouvertes, on laisse la sélection normale se faire
        // Sinon, on ajoute comme item custom
        if (!isOpen && parsedInput) {
          console.log("SmartItemInput: Adding custom item (no suggestions):", parsedInput);
          onItemAdded?.({
            customName: parsedInput.productName,
            quantity: parsedInput.quantity,
            unit: parsedInput.unit,
            price: parsedInput.price,
            isCompleted: false
          });
          clearInput();
        } else if (isOpen && parsedInput) {
          // Vérifier s'il y a une suggestion "quick-add" ou si toutes les suggestions ont une faible confiance
          const hasHighConfidenceSuggestion = suggestions.some(
            (s) => s.type === "product" && s.confidence >= 0.8
          );

          if (!hasHighConfidenceSuggestion) {
            console.log("SmartItemInput: Adding custom item (low confidence suggestions):", parsedInput);
            onItemAdded?.({
              customName: parsedInput.productName,
              quantity: parsedInput.quantity,
              unit: parsedInput.unit,
              price: parsedInput.price,
              isCompleted: false
            });
            clearInput();
          }
        }
      } else if (e.key === "Escape") {
        clearInput();
      }
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 0.8) return "success";
      if (confidence >= 0.6) return "warning";
      return "default";
    };

    const getConfidenceIcon = (confidence: number) => {
      if (confidence >= 0.8) return <ZapIcon size={14} />;
      if (confidence >= 0.6) return <TrendingUpIcon size={14} />;
      return <SearchIcon size={14} />;
    };

    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {/* Card Container pour un design uniforme */}
        <Card className="shadow-sm border border-gray-100 hover:border-primary-200 transition-colors">
          <CardBody className="p-3">
            {/* Header compact avec informations */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary-50 border border-primary-100">
                  <ZapIcon size={14} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    <Trans>Smart Add</Trans>
                  </h3>
                </div>
              </div>

              <Tooltip
                content={
                  <div className="p-2 max-w-xs">
                    <p className="font-medium mb-1 text-xs">
                      <Trans>Comment utiliser</Trans>
                    </p>
                    <ul className="space-y-0.5 text-xs">
                      <li>
                        • <Trans>Recherche automatique</Trans>
                      </li>
                      <li>
                        • <Trans>Ex: 2kg pommes 2.49€</Trans>
                      </li>
                    </ul>
                  </div>
                }
              >
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600 w-6 h-6"
                >
                  <HelpCircleIcon size={12} />
                </Button>
              </Tooltip>
            </div>

            {/* Indicateur de parsing intelligent - plus compact */}
            {parsedInput && inputValue.length > 2 && (
              <div className="mb-2 p-2 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-md">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-medium text-gray-600">Parsed:</span>
                  <Chip
                    size="sm"
                    color={getConfidenceColor(parsedInput.confidence)}
                    variant="flat"
                    startContent={getConfidenceIcon(parsedInput.confidence)}
                    className="text-xs h-5"
                  >
                    {parsedInput.quantity} {parsedInput.unit}
                  </Chip>
                  {parsedInput.price && (
                    <Chip size="sm" color="success" variant="flat" className="text-xs h-5">
                      {parsedInput.price.toFixed(2)}€
                    </Chip>
                  )}
                  <span className="text-xs text-gray-500 truncate">• {parsedInput.productName}</span>
                </div>
              </div>
            )}

            {/* Input principal avec design amélioré */}
            <div className="relative">
              <Input
                ref={ref}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                placeholder={placeholder}
                size="md"
                classNames={{
                  inputWrapper:
                    "bg-gray-50 border border-gray-200 hover:border-primary-300 focus-within:border-primary-500 shadow-none transition-colors h-10",
                  input: "text-sm placeholder:text-gray-400"
                }}
                startContent={
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <Spinner size="sm" color="primary" />
                    ) : (
                      <SearchIcon size={16} className="text-primary-500" />
                    )}
                  </div>
                }
                endContent={
                  inputValue && (
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={clearInput}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      ×
                    </Button>
                  )
                }
                autoFocus={autoFocus}
              />

              {/* Dropdown de suggestions avec portail pour éviter le clipping */}
              {isOpen &&
                suggestions.length > 0 &&
                typeof window !== "undefined" &&
                createPortal(
                  <div
                    className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto"
                    style={dropdownStyle}
                  >
                    <div className="p-1">
                      <div className="space-y-0.5">
                        {suggestions.map((suggestion, index) => (
                          <SuggestionItem
                            key={`${suggestion.type}-${index}`}
                            suggestion={suggestion}
                            onSelect={() => handleSuggestionSelect(suggestion)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
            </div>

            {/* Raccourcis clavier - plus discrets */}
            {!isOpen && !inputValue && (
              <div className="mt-2 flex items-center justify-center">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">↵</kbd>
                    <span>add</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd>
                    <span>clear</span>
                  </span>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
);

SmartItemInput.displayName = "SmartItemInput";

// Composant pour afficher une suggestion
interface SuggestionItemProps {
  suggestion: SmartSuggestion;
  onSelect: () => void;
}

const SuggestionItem = ({ suggestion, onSelect }: SuggestionItemProps) => {
  const getTypeIcon = () => {
    switch (suggestion.type) {
      case "product":
        return <TagIcon size={12} className="text-primary-500" />;
      case "quick-add":
        return <PlusIcon size={12} className="text-gray-500" />;
      default:
        return <SearchIcon size={12} className="text-gray-400" />;
    }
  };

  const getConfidenceIndicator = () => {
    if (suggestion.confidence >= 0.8) {
      return <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />;
    }
    if (suggestion.confidence >= 0.6) {
      return <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />;
    }
    return <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />;
  };

  return (
    <button
      type="button"
      className="w-full p-2 text-left hover:bg-primary-50 border border-transparent hover:border-primary-100 rounded-md transition-all duration-150 group"
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 w-full">
        {/* Badge avec icône du type - plus petit */}
        <div className="p-1 rounded bg-gray-100 border border-gray-200 flex-shrink-0">{getTypeIcon()}</div>

        {/* Avatar pour les produits avec image - plus petit */}
        {suggestion.type === "product" && suggestion.product?.brand && (
          <Avatar
            size="sm"
            name={suggestion.product.brand.name}
            className="w-6 h-6 text-xs border border-gray-200 flex-shrink-0"
          />
        )}

        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-medium text-sm text-gray-900 truncate">{suggestion.displayText}</span>
            {getConfidenceIndicator()}
          </div>

          {suggestion.subtitle && (
            <div className="text-xs text-gray-500 truncate mb-0.5">{suggestion.subtitle}</div>
          )}

          {/* Informations spécifiques aux produits - plus compactes */}
          {suggestion.type === "product" && suggestion.product && (
            <div className="flex items-center gap-2 text-xs">
              {suggestion.product.category && (
                <span className="inline-flex items-center bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600 text-xs">
                  {suggestion.product.category.name}
                </span>
              )}

              {suggestion.product.bestPrice && (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full text-xs">
                  <StoreIcon size={8} />
                  <span className="font-medium">{suggestion.product.bestPrice.store}</span>
                  {suggestion.product.bestPrice.location && (
                    <span className="text-green-500 truncate max-w-20">
                      • {suggestion.product.bestPrice.location}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Prix à droite - plus compact */}
        {suggestion.type === "product" && suggestion.product?.averagePrice && (
          <div className="text-right bg-primary-50 px-1.5 py-1 rounded border border-primary-100 flex-shrink-0">
            <div className="text-xs font-bold text-primary-700">
              {suggestion.product.averagePrice.toFixed(2)}€
            </div>
            <div className="text-xs text-primary-500">moy.</div>
          </div>
        )}
      </div>
    </button>
  );
};
