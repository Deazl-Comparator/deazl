/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/v1/user/{id}/account": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * Delete user account.
     * @description This operation permanently deletes the account associated with the specified user ID. This action is irreversible and removes all information linked to this account.
     */
    delete: operations["deleteAccount"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/prices": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create a new price
     * @description Creates a new price entry for a product, allowing users to add price information for a product found in a specific store. The route accepts details such as the product's barcode, name, brand, category, store location, price, and a link to a proof image. This enables the application to update its database with current prices from various stores, helping users compare prices effectively.
     */
    post: operations["createPrice"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/user/{id}/profile": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /**
     * Update User Profile
     * @description This operation updates the profile information of the user identified by the specified user ID. Users can update their profile details such as name, phone, and other relevant information.
     */
    patch: operations["updateUserProfile"];
    trace?: never;
  };
  "/v1/user/{id}/profile/avatar": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /**
     * Update User Avatar
     * @description This operation updates the avatar of the user identified by the specified user ID. Users can upload a new avatar image file to update their profile picture.
     */
    patch: operations[" updateUserAvatar"];
    trace?: never;
  };
  "/v1/user/{id}/prices": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List user prices.
     * @description This operation retrieves a list of prices added by the specified user. The list includes detailed information for each price entry, such as the product name, price, location, and date added. This allows the user to review all their contributed price information in one place.
     */
    get: operations["listPrices"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/user/{id}/prices/{priceId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * Delete a user price.
     * @description This operation allows the specified user to delete a specific price entry they previously added. When executed, the request removes the selected price entry from the database, ensuring it no longer appears in search results or in the user's list of contributed prices. This action is permanent and requires user authentication to confirm their identity. The operation enhances data control by enabling users to manage and curate their submitted pricing information.
     */
    delete: operations["deleteUserPrice"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/prices/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Search for a price
     * @description Creates a new price entry for a product, allowing users to add price information for a product found in a specific store. The route accepts details such as the product's barcode, name, brand, category, store location, price, and a link to a proof image. This enables the application to update its database with current prices from various stores, helping users compare prices effectively.
     */
    get: operations["searchPrices"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/products/{barcode}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create a product
     * @description Creates a new product entry, allowing users to add price information for a product found in a specific store. The route accepts details such as the product's barcode, name, brand, category, store location, price, and a link to a proof image. This enables the application to update its database with current prices from various stores, helping users compare prices effectively.
     */
    post: operations["createProduct"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: never;
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  deleteAccount: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /**
         * @description id of the user
         * @example 1bc0956b-c517-4b91-a3ca-1ebea5c60440
         */
        id: string;
      };
      cookie?: never;
    };
    /** @description No request body is required for this operation. */
    requestBody?: {
      content: {
        "*/*"?: never;
      };
    };
    responses: {
      /** @description The account was deleted successfully. */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The request is malformed or contains invalid parameters. Please check the data provided. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The request is malformed or contains invalid parameters. Please check the data provided. */
            message: string;
            /** @example HTTPError */
            name: string;
            /** @example 400 */
            status: number;
            /** @example error cause */
            cause: string;
          };
        };
      };
      /** @description The requested resource could not be found. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The requested resource could not be found. */
            error: string;
          };
        };
      };
      /** @description A similar entry already exists. */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example A similar entry already exists. */
            error: string;
          };
        };
      };
      /** @description Internal server error. Something went wrong on the server side. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example Internal Server Error. */
            error: string;
          };
        };
      };
    };
  };
  createPrice: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description The price to create. */
    requestBody?: {
      content: {
        "application/json": {
          /**
           * @description Unique identifier for the product in barcode format
           * @example 8690804407383
           */
          barcode: string;
          /**
           * @description Name of the store where the product is sold
           * @example Auchan
           */
          storeName: string;
          /**
           * @description Name of the product
           * @example Nutella
           */
          productName: string;
          /**
           * @description Category of the product
           * @example Pate a tartiner
           */
          categoryName: string;
          /**
           * @description Brand or manufacturer of the product
           * @example Ferrero
           */
          brandName: string;
          /**
           * @description Address of the store where the product was found
           * @example 4 rue du dome, 67000, Strasbourg
           */
          location: string;
          /**
           * @description Price of the product
           * @example 9.99
           */
          amount: number;
          /**
           * @description Link to an image or file providing proof of the price
           * @example https://pcomparator/files
           */
          proof: string;
          /**
           * @description Currency used for the product price
           * @example EUR
           * @enum {string}
           */
          currency: "EUR" | "USD" | "GBP" | "CHF" | "AUD" | "CAD" | "CNY" | "JPY" | "AED";
        };
      };
    };
    responses: {
      /** @description The burger was created successfully. */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /**
             * Format: uuid
             * @example 010f21e3-c5b9-4d91-a5b1-b713d2324b17
             */
            id: string;
            /** @example 8690804407383 */
            barcode: string;
            /** @example Nutella */
            name: string;
            /** @example Nutella is a sweet hazelnut and cocoa spread made by Ferrero. */
            description?: string | null;
            /**
             * Format: uuid
             * @example 77230970-93e1-46ed-9797-85fc96d7eb0b
             */
            categoryId?: string | null;
            /**
             * Format: uuid
             * @example d0ecb566-74ee-4409-aeb3-31f30985a6f4
             */
            brandId?: string | null;
            /** @example  */
            nutritionScore?: null;
            /** @example 2024-11-16T23:04:56.060Z */
            createdAt: string;
            /** @example 2024-11-16T23:04:56.060Z */
            updatedAt: string;
          };
        };
      };
      /** @description The request is malformed or contains invalid parameters. Please check the data provided. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The request is malformed or contains invalid parameters. Please check the data provided. */
            message: string;
            /** @example HTTPError */
            name: string;
            /** @example 400 */
            status: number;
            /** @example error cause */
            cause: string;
          };
        };
      };
      /** @description The requested resource could not be found. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The requested resource could not be found. */
            error: string;
          };
        };
      };
      /** @description A similar entry already exists. */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example A similar entry already exists. */
            error: string;
          };
        };
      };
      /** @description Internal server error. Something went wrong on the server side. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example Internal Server Error. */
            error: string;
          };
        };
      };
    };
  };
  updateUserProfile: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /**
         * @description id of the user
         * @example 1bc0956b-c517-4b91-a3ca-1ebea5c60440
         */
        id: string;
      };
      cookie?: never;
    };
    /** @description The profile data to update. This should include the fields that need to be modified. */
    requestBody?: {
      content: {
        /** @example {
         *       "phone": "+33666666666",
         *       "name": "Clément Muth"
         *     } */
        "application/json": {
          /**
           * @description Phone number of the user
           * @default +33666666666
           * @example +33666666666
           */
          phone?: string;
          name?: string;
          /**
           * @description Name of the user
           * @default Clément Muth
           * @example Clément Muth
           */
          storeName?: string;
        };
      };
    };
    responses: {
      /** @description Profile updated successfully. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /**
             * Format: uuid
             * @example 010f21e3-c5b9-4d91-a5b1-b713d2324b17
             */
            id: string;
            /** @example Clément Muth */
            name: string;
            /** @example +33666666666 */
            phone: string | null;
            /** @example https://pcomparator/images */
            image: string;
          };
        };
      };
      /** @description The request is malformed or contains invalid parameters. Please check the data provided. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The request is malformed or contains invalid parameters. Please check the data provided. */
            message: string;
            /** @example HTTPError */
            name: string;
            /** @example 400 */
            status: number;
            /** @example error cause */
            cause: string;
          };
        };
      };
      /** @description The requested resource could not be found. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The requested resource could not be found. */
            error: string;
          };
        };
      };
      /** @description A similar entry already exists. */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example A similar entry already exists. */
            error: string;
          };
        };
      };
      /** @description Internal server error. Something went wrong on the server side. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example Internal Server Error. */
            error: string;
          };
        };
      };
    };
  };
  " updateUserAvatar": {
    parameters: {
      query: {
        filename: string;
      };
      header?: never;
      path: {
        /** @description id of the user */
        id: string;
      };
      cookie?: never;
    };
    /** @description The avatar image to upload. This should be a file object representing the new avatar. */
    requestBody?: {
      content: {
        "multipart/form-data": unknown;
      };
    };
    responses: {
      /** @description Avatar updated successfully. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /**
             * Format: uri
             * @example https://pcomparator.vercel.app/avatars/new-avatar.png
             */
            image: string;
          };
        };
      };
      /** @description The request is malformed or contains invalid parameters. Please check the data provided. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The request is malformed or contains invalid parameters. Please check the data provided. */
            message: string;
            /** @example HTTPError */
            name: string;
            /** @example 400 */
            status: number;
            /** @example error cause */
            cause: string;
          };
        };
      };
      /** @description The requested resource could not be found. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The requested resource could not be found. */
            error: string;
          };
        };
      };
      /** @description A similar entry already exists. */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example A similar entry already exists. */
            error: string;
          };
        };
      };
      /** @description Internal server error. Something went wrong on the server side. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example Internal Server Error. */
            error: string;
          };
        };
      };
    };
  };
  listPrices: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /**
         * @description id of the user
         * @example 1bc0956b-c517-4b91-a3ca-1ebea5c60440
         */
        id: string;
      };
      cookie?: never;
    };
    /** @description No request body is required for this operation. */
    requestBody?: {
      content: {
        "*/*"?: never;
      };
    };
    responses: {
      /** @description Profile updated successfully. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json":
            | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                productId: string;
                /** Format: uuid */
                storeId: string;
                amount: number;
                /** @enum {string} */
                currency: "EUR" | "USD" | "GBP" | "CHF" | "AUD" | "CAD" | "CNY" | "JPY" | "AED";
                /** Format: uri */
                priceProofImage?: string | null;
                dateRecorded?: string | null;
                /**
                 * @description Amount of the price
                 * @default 2.99
                 * @example 2.99
                 */
                storeName: number;
                product: {
                  /** Format: uuid */
                  id: string;
                  barcode: string;
                  name: string;
                  description?: string | null;
                  /** Format: uuid */
                  categoryId?: string | null;
                  /** Format: uuid */
                  brandId?: string | null;
                  nutritionScore?: null;
                  createdAt: string;
                  updatedAt: string;
                };
                store: {
                  /** Format: uuid */
                  id: string;
                  name: string;
                  location: string;
                  /** Format: uri */
                  websiteUrl?: string | null;
                };
              }[]
            | null;
        };
      };
      /** @description The account was deleted successfully. */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The request is malformed or contains invalid parameters. Please check the data provided. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The request is malformed or contains invalid parameters. Please check the data provided. */
            message: string;
            /** @example HTTPError */
            name: string;
            /** @example 400 */
            status: number;
            /** @example error cause */
            cause: string;
          };
        };
      };
      /** @description The requested resource could not be found. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The requested resource could not be found. */
            error: string;
          };
        };
      };
      /** @description A similar entry already exists. */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example A similar entry already exists. */
            error: string;
          };
        };
      };
      /** @description Internal server error. Something went wrong on the server side. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example Internal Server Error. */
            error: string;
          };
        };
      };
    };
  };
  deleteUserPrice: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /**
         * @description id of the user
         * @example 1bc0956b-c517-4b91-a3ca-1ebea5c60440
         */
        id: string;
        /**
         * @description id of the price to delete
         * @example 390c21e2-5c18-4d85-8f40-9ea3486b2675
         */
        priceId: string;
      };
      cookie?: never;
    };
    /** @description No request body is required for this operation. */
    requestBody?: {
      content: {
        "*/*"?: never;
      };
    };
    responses: {
      /** @description The price was deleted successfully. */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The request is malformed or contains invalid parameters. Please check the data provided. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The request is malformed or contains invalid parameters. Please check the data provided. */
            message: string;
            /** @example HTTPError */
            name: string;
            /** @example 400 */
            status: number;
            /** @example error cause */
            cause: string;
          };
        };
      };
      /** @description The requested resource could not be found. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The requested resource could not be found. */
            error: string;
          };
        };
      };
      /** @description A similar entry already exists. */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example A similar entry already exists. */
            error: string;
          };
        };
      };
      /** @description Internal server error. Something went wrong on the server side. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example Internal Server Error. */
            error: string;
          };
        };
      };
    };
  };
  searchPrices: {
    parameters: {
      query: {
        /**
         * @description Defines the type of activity log entries to retrieve, such as "date" or "id"
         * @example date
         */
        q: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description The price to create. */
    requestBody?: {
      content: {
        "*/*"?: never;
      };
    };
    responses: {
      /** @description The burger was created successfully. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            prices:
              | {
                  /** Format: uuid */
                  id: string;
                  /** Format: uuid */
                  productId: string;
                  /** Format: uuid */
                  storeId: string;
                  amount: number;
                  /** @enum {string} */
                  currency: "EUR" | "USD" | "GBP" | "CHF" | "AUD" | "CAD" | "CNY" | "JPY" | "AED";
                  /** Format: uri */
                  priceProofImage?: string | null;
                  dateRecorded?: string | null;
                  product: {
                    /** Format: uuid */
                    id: string;
                    barcode: string;
                    name: string;
                    description?: string | null;
                    /** Format: uuid */
                    categoryId?: string | null;
                    /** Format: uuid */
                    brandId?: string | null;
                    nutritionScore?: null;
                    createdAt: string;
                    updatedAt: string;
                  } | null;
                  store: {
                    /** Format: uuid */
                    id: string;
                    name: string;
                    location: string;
                    /** Format: uri */
                    websiteUrl?: string | null;
                  };
                }[]
              | null;
            /** @constant */
            reason?: "NO_PRICES";
          };
        };
      };
      /** @description The request is malformed or contains invalid parameters. Please check the data provided. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The request is malformed or contains invalid parameters. Please check the data provided. */
            message: string;
            /** @example HTTPError */
            name: string;
            /** @example 400 */
            status: number;
            /** @example error cause */
            cause: string;
          };
        };
      };
      /** @description The requested resource could not be found. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The requested resource could not be found. */
            error: string;
          };
        };
      };
      /** @description A similar entry already exists. */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example A similar entry already exists. */
            error: string;
          };
        };
      };
      /** @description Internal server error. Something went wrong on the server side. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example Internal Server Error. */
            error: string;
          };
        };
      };
    };
  };
  createProduct: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /**
         * @description barcode of the new product
         * @example 876456789
         */
        barcode: string;
      };
      cookie?: never;
    };
    /** @description The product to create. */
    requestBody?: {
      content: {
        "application/json": {
          productName: string;
          categoryName: string;
          brandName: string;
        };
      };
    };
    responses: {
      /** @description The burger was created successfully. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            productId: string;
            /** Format: uuid */
            storeId: string;
            amount: number;
            /** @enum {string} */
            currency: "EUR" | "USD" | "GBP" | "CHF" | "AUD" | "CAD" | "CNY" | "JPY" | "AED";
            /** Format: uri */
            priceProofImage?: string | null;
            dateRecorded?: string | null;
            product: {
              /** Format: uuid */
              id: string;
              barcode: string;
              name: string;
              description?: string | null;
              /** Format: uuid */
              categoryId?: string | null;
              /** Format: uuid */
              brandId?: string | null;
              nutritionScore?: null;
              createdAt: string;
              updatedAt: string;
            };
            store: {
              /** Format: uuid */
              id: string;
              name: string;
              location: string;
              /** Format: uri */
              websiteUrl?: string | null;
            };
          }[];
        };
      };
      /** @description The request is malformed or contains invalid parameters. Please check the data provided. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The request is malformed or contains invalid parameters. Please check the data provided. */
            message: string;
            /** @example HTTPError */
            name: string;
            /** @example 400 */
            status: number;
            /** @example error cause */
            cause: string;
          };
        };
      };
      /** @description The requested resource could not be found. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example The requested resource could not be found. */
            error: string;
          };
        };
      };
      /** @description A similar entry already exists. */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example A similar entry already exists. */
            error: string;
          };
        };
      };
      /** @description Internal server error. Something went wrong on the server side. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @example Internal Server Error. */
            error: string;
          };
        };
      };
    };
  };
}
