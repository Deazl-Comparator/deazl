"use server";

import { HTTPError } from "ky";
import { z } from "zod";
import { pcomparatorAuthenticatedApiClient } from "~/clients/PcomparatorApiClient";
import { auth } from "~/libraries/nextauth/authConfig";

const ParamsSchema = z.object({
  phone: z.string().optional()
});

export type UpdatePhoneParams = z.infer<typeof ParamsSchema>;

/**
 * Updates the authenticated user's phone number.
 *
 * @async
 * @function updatePhoneNumber
 * @param {UpdatePhoneParams} params - The parameters containing the new phone number to update in the user profile.
 * @throws {Error} Throws an error if the user is not authenticated.
 * @throws {Error} Throws an error with the message "404 NOT FOUND" if the user is not found on the server.
 * @throws {HTTPError} Re-throws any other HTTP errors encountered during the request.
 * @returns {Promise<UpdatePhonePayload>} Resolves to an object containing the updated phone number upon successful update.
 */
export const updatePhoneNumber = async (params: UpdatePhoneParams): Promise<void> => {
  const paramsPayload = ParamsSchema.parse(params);
  const session = await auth();

  if (!session?.user?.id) throw new Error("User not authenticated");

  try {
    await pcomparatorAuthenticatedApiClient.patch("/v1/user/{id}/profile", {
      params: {
        path: {
          id: session.user.id
        }
      },
      body: {
        phone: paramsPayload.phone
      }
    });
  } catch (err) {
    if (err instanceof HTTPError) {
      switch (err.response.status) {
        case 404: {
          throw new Error("404 NOT FOUND");
        }
      }
    }
    throw err;
  }
};
