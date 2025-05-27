"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { InfoIcon, KeyboardIcon, SearchIcon, ShoppingCartIcon } from "lucide-react";

interface SmartInputHelpProps {
  className?: string;
}

export const SmartInputHelp = ({ className = "" }: SmartInputHelpProps) => {
  const examples = [
    { input: "apples", description: "Search for products", icon: SearchIcon },
    { input: "2 kg apples", description: "Quick add with quantity", icon: ShoppingCartIcon },
    { input: "1 bottle milk 2.50€", description: "Add with price", icon: KeyboardIcon }
  ];

  return (
    <Card className={`bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 ${className}`}>
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-3">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              <Trans>Smart Input Examples</Trans>
            </h4>
            <div className="grid gap-2">
              {examples.map((example, index) => {
                const IconComponent = example.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <Chip size="sm" variant="flat" className="font-mono text-xs bg-white dark:bg-gray-800">
                      {example.input}
                    </Chip>
                    <span className="text-sm text-blue-700 dark:text-blue-300">→ {example.description}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <Trans>Press Enter to execute • Products show prices from multiple stores</Trans>
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
