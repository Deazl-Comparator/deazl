"use client";

import { Divider, Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs } from "@heroui/react";
import { Share2Icon } from "lucide-react";
import {} from "react";
import { InviteTab } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShareListModal/InviteTab";
import { LinkTab } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShareListModal/LinkTab";
import { QrCodeTab } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShareListModal/QrCodeTab";
import { SocialTab } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShareListModal/SocialTab";
import { useShareList } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShareListModal/useShareList";

interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
}

export default function ShareListModal({ isOpen, onClose, listId, listName }: ShareListModalProps) {
  const shareLink = `https://deazl.fr/shared-lists/${listId}`;
  const {
    email,
    setEmail,
    activeTab,
    collaborators,
    onCopyShareLink,
    onInvite,
    onRemoveCollaborator,
    openShareWindow,
    setActiveTab,
    inputLinkRef,
    isInviting,
    role,
    searchQuery,
    setIsPublicLink,
    setRole,
    isPublicLink
  } = useShareList(shareLink);

  const encodedListName = encodeURIComponent(listName);
  const whatsappLink = `https://wa.me/?text=Check out my shopping list "${encodedListName}": ${shareLink}`;
  const twitterLink = `https://twitter.com/intent/tweet?text=Check out my shopping list "${encodedListName}"&url=${shareLink}`;
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}&quote=Check out my shopping list "${encodedListName}"`;
  const emailLink = `mailto:?subject=Check out my shopping list "${encodedListName}"&body=I wanted to share my shopping list with you: ${shareLink}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      classNames={{
        base: "p-0",
        header: "p-0",
        body: "p-0"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-3">
          <div className="flex items-center gap-2">
            <Share2Icon className="h-5 w-5 text-primary-600" />
            <span className="text-lg">Share "{listName}"</span>
          </div>

          <Tabs
            selectedKey={activeTab}
            onSelectionChange={setActiveTab as any}
            variant="underlined"
            color="primary"
            className="mt-2"
            aria-label="Share options"
            size="sm"
          >
            <Tab key="invite" title="Invite People" />
            <Tab key="link" title="Share Link" />
            <Tab key="social" title="Social Media" />
            <Tab key="qr" title="QR Code" />
          </Tabs>
        </ModalHeader>

        <Divider />

        <ModalBody className="p-4">
          {activeTab === "invite" && (
            <InviteTab
              collaborators={collaborators}
              onRemoveCollaborator={(id) => onRemoveCollaborator(id)}
              email={email}
              onEmailChange={(email) => setEmail(email)}
              isInviting={isInviting}
              onInvite={onInvite}
              role={role}
              onRoleChange={(role) => setRole(role)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "link" && (
            <LinkTab
              inputLinkRef={inputLinkRef}
              onCopyShareLink={onCopyShareLink}
              onIsPublicLinkChange={(value) => setIsPublicLink(value)}
              isPublicLink={isPublicLink}
              shareLink={shareLink}
              emailLink={emailLink}
              whatsappLink={whatsappLink}
              listName={listName}
            />
          )}

          {activeTab === "social" && (
            <SocialTab
              shareLink={shareLink}
              whatsappLink={whatsappLink}
              twitterLink={twitterLink}
              facebookLink={facebookLink}
              emailLink={emailLink}
              onOpenShareWindow={(url) => openShareWindow(url)}
              inputLinkRef={inputLinkRef}
              onCopyShareLink={onCopyShareLink}
              listName={listName}
            />
          )}

          {activeTab === "qr" && <QrCodeTab onCopyShareLink={onCopyShareLink} shareLink={shareLink} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
