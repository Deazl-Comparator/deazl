"use server";

import { pcomparatorAuthenticatedApiClient } from "@deazl/system";
import { HTTPError } from "ky";
import { z } from "zod";
import { auth } from "~/libraries/nextauth/authConfig";

const ParamsSchema = z.object({
  image: z.instanceof(File)
});

const PayloadSchema = z.object({
  image: z.string()
});

export type UpdateAvatarParams = z.infer<typeof ParamsSchema>;
export type UpdateAvatarPayload = z.infer<typeof PayloadSchema>;

/**
 * Updates the authenticated user's avatar.
 *
 * @async
 * @function updateAvatar
 * @param {z.infer<typeof ParamsSchema>} params - The parameters containing the image file to upload as the user's new avatar.
 * @throws {Error} Throws an error if the user is not authenticated.
 * @throws {Error} Throws an error with the message "404 NOT FOUND" if the user is not found on the server.
 * @throws {HTTPError} Re-throws any other HTTP errors encountered during the request.
 * @returns {Promise<UpdateAvatarPayload>} Resolves to an object containing the updated avatar image URL upon successful update.
 */
export const updateAvatar = async (params: z.infer<typeof ParamsSchema>): Promise<UpdateAvatarPayload> => {
  const paramsPayload = ParamsSchema.parse(params);
  const session = await auth();

  if (!session?.user?.id) throw new Error("User not authenticated");

  try {
    const updatedUser = (
      await pcomparatorAuthenticatedApiClient.patch("/v1/user/{id}/profile/avatar", {
        body: paramsPayload.image,
        noSerializing: true,
        params: {
          query: {
            filename: paramsPayload.image.name
          },
          path: {
            id: session.user.id
          }
        }
      })
    ).data;

    const updatedUserPayload = PayloadSchema.parse(updatedUser);

    return {
      image: updatedUserPayload.image
    };
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
