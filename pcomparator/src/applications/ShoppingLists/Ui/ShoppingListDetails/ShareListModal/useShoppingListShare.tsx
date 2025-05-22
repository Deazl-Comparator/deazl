import { addToast } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { useCallback, useEffect, useState } from "react";
import { addCollaborator, generateShareLink, getCollaborators } from "../../../Api/shareListActions";
import type { ShoppingListCollaborator } from "../../../Domain/Entities/ShoppingListCollaborator.entity";

type Collaborator = {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
};

const transformCollaborator = (dbCollaborator: ShoppingListCollaborator): Collaborator => ({
  // @ts-ignore
  id: dbCollaborator.id,
  userId: dbCollaborator.userId,
  // @ts-ignore
  name: dbCollaborator.user.name || "",
  // @ts-ignore
  email: dbCollaborator.user.email || "",
  // @ts-ignore
  avatar: dbCollaborator.user.image || undefined,
  role: dbCollaborator.role
});

export const useShoppingListShare = (listId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  // Generate share link
  const generateLink = useCallback(async () => {
    try {
      setIsLoading(true);
      const link = await generateShareLink(listId);
      setShareLink(link);
    } catch (error) {
      // addToast({
      //   title: <Trans>Error</Trans>,
      //   description: <Trans>Failed to generate share link</Trans>,
      //   color: "danger"
      // });
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  // Load collaborators
  const loadCollaborators = useCallback(async () => {
    try {
      setIsLoading(true);
      const dbCollaborators = await getCollaborators(listId);
      setCollaborators(dbCollaborators.map(transformCollaborator));
    } catch (error) {
      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to load collaborators</Trans>,
        color: "danger"
      });
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  // Add collaborator
  const inviteCollaborator = useCallback(
    async (email: string, role: "EDITOR" | "VIEWER") => {
      try {
        setIsLoading(true);
        await addCollaborator(listId, email, role);
        addToast({
          title: <Trans>Success</Trans>,
          description: <Trans>Invitation sent successfully</Trans>,
          color: "success"
        });
        // Reload collaborators
        await loadCollaborators();
      } catch (error) {
        addToast({
          title: <Trans>Error</Trans>,
          description: <Trans>Failed to send invitation</Trans>,
          color: "danger"
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [listId, loadCollaborators]
  );

  // Load initial data
  useEffect(() => {
    generateLink();
    loadCollaborators();
  }, [generateLink, loadCollaborators]);

  // Return all needed functionality
  return {
    isLoading,
    shareLink,
    collaborators,
    generateLink,
    inviteCollaborator
  };
};
