"use client";

import {
  Avatar,
  Button,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  addToast
} from "@heroui/react";
import { Trans } from "@lingui/macro";
import {
  CopyIcon,
  FacebookIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
  SendIcon,
  Share2Icon,
  TwitterIcon,
  UserIcon,
  XIcon
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react"; // Note: Requires installation of qrcode.react package
import { useRef, useState } from "react";

interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
}

type CollaboratorType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
};

export default function ShareListModal({ isOpen, onClose, listId, listName }: ShareListModalProps) {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("invite");
  const [isPublicLink, setIsPublicLink] = useState(false);
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const inputLinkRef = useRef<HTMLInputElement>(null);

  // Créer un lien de partage
  const shareLink = `https://pcomparator.com/shared-lists/${listId}`;
  const encodedListName = encodeURIComponent(listName);
  const whatsappLink = `https://wa.me/?text=Check out my shopping list "${encodedListName}": ${shareLink}`;
  const twitterLink = `https://twitter.com/intent/tweet?text=Check out my shopping list "${encodedListName}"&url=${shareLink}`;
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}&quote=Check out my shopping list "${encodedListName}"`;
  const emailLink = `mailto:?subject=Check out my shopping list "${encodedListName}"&body=I wanted to share my shopping list with you: ${shareLink}`;

  // Exemple de liste de collaborateurs (à remplacer par des données réelles)
  const [collaborators, setCollaborators] = useState<CollaboratorType[]>([
    {
      id: "1",
      name: "You",
      email: "your.email@example.com",
      avatar: "",
      role: "owner"
    }
  ]);

  // Simuler un chargement pendant l'envoi de l'invitation
  const handleInvite = async () => {
    if (!email) return;

    try {
      setIsInviting(true);

      // Simuler un appel API pour inviter un utilisateur
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Ajouter l'utilisateur à la liste des collaborateurs (simulation)
      setCollaborators([
        ...collaborators,
        {
          id: Date.now().toString(),
          name: email.split("@")[0],
          email,
          role
        }
      ]);

      // Réinitialiser le champ email
      setEmail("");

      // Afficher un toast de succès
      addToast({
        title: <Trans>Invitation sent</Trans>,
        description: <Trans>An invitation has been sent to {email}</Trans>,
        variant: "solid",
        color: "success",
        // @ts-ignore
        duration: 3000
      });
    } catch (error) {
      console.error("Error inviting user:", error);
      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to send invitation</Trans>,
        variant: "solid",
        color: "danger"
      });
    } finally {
      setIsInviting(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);

    // Effet visuel sur l'input
    if (inputLinkRef.current) {
      inputLinkRef.current.select();
    }

    addToast({
      title: <Trans>Link copied</Trans>,
      description: <Trans>Share link copied to clipboard</Trans>,
      variant: "solid",
      color: "success",
      // @ts-ignore
      duration: 2000
    });
  };

  const handleRemoveCollaborator = (id: string) => {
    // Ne pas permettre de supprimer le propriétaire
    if (collaborators.find((c) => c.id === id)?.role === "owner") return;

    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

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
            <div className="space-y-6">
              {/* Section d'invitation */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Invite people to collaborate</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      startContent={<MailIcon className="h-4 w-4 text-gray-400" />}
                      className="flex-1"
                      size="sm"
                    />
                    <Select
                      selectedKeys={[role]}
                      onChange={(e) => setRole(e.target.value as "editor" | "viewer")}
                      className="w-32"
                      size="sm"
                    >
                      {/* @ts-ignore */}
                      <SelectItem key="editor" value="editor">
                        Can edit
                      </SelectItem>
                      {/* @ts-ignore */}
                      <SelectItem key="viewer" value="viewer">
                        Can view
                      </SelectItem>
                    </Select>
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    isLoading={isInviting}
                    isDisabled={!email.trim() || isInviting}
                    onPress={handleInvite}
                    startContent={<SendIcon size={16} />}
                    className="w-full"
                  >
                    Send Invitation
                  </Button>
                </div>
              </div>

              {/* Liste des collaborateurs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-700">People with access</h3>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table aria-label="Collaborators" removeWrapper isStriped>
                    <TableHeader>
                      <TableColumn>NAME</TableColumn>
                      <TableColumn>ACCESS</TableColumn>
                      {/* @ts-ignore */}
                      <TableColumn width={80} />
                    </TableHeader>
                    <TableBody emptyContent="No collaborators found">
                      {collaborators
                        .filter(
                          (c) =>
                            !searchQuery ||
                            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.email.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((collaborator) => (
                          <TableRow key={collaborator.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar
                                  name={collaborator.name}
                                  src={collaborator.avatar}
                                  size="sm"
                                  className="bg-primary-100 text-primary-600"
                                  icon={<UserIcon size={16} />}
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {collaborator.name} {collaborator.role === "owner" && "(you)"}
                                  </span>
                                  <span className="text-xs text-gray-500">{collaborator.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Chip
                                color={
                                  collaborator.role === "owner"
                                    ? "primary"
                                    : collaborator.role === "editor"
                                      ? "primary"
                                      : "default"
                                }
                                variant="flat"
                                size="sm"
                              >
                                {collaborator.role === "owner"
                                  ? "Owner"
                                  : collaborator.role === "editor"
                                    ? "Can edit"
                                    : "Can view"}
                              </Chip>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                disabled={collaborator.role === "owner"}
                                onPress={() => handleRemoveCollaborator(collaborator.id)}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "link" && (
            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Share link</h3>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <Input
                      ref={inputLinkRef}
                      value={shareLink}
                      startContent={<LinkIcon className="h-4 w-4 text-gray-400" />}
                      className="w-full"
                      readOnly
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>
                  <Button
                    color="primary"
                    onPress={copyShareLink}
                    startContent={<CopyIcon className="h-4 w-4" />}
                  >
                    Copy
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      isSelected={isPublicLink}
                      onValueChange={setIsPublicLink}
                      color="primary"
                      size="sm"
                    />
                    <span className="text-sm">Anyone with the link can view</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Share via email or message</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    color="default"
                    variant="flat"
                    startContent={<MailIcon className="h-4 w-4" />}
                    className="justify-start"
                    onPress={() => window.open(emailLink, "_blank")}
                  >
                    Email
                  </Button>
                  <Button
                    color="default"
                    variant="flat"
                    className="justify-start"
                    startContent={
                      <span className="flex items-center justify-center w-4 h-4 bg-green-500 text-white rounded-full">
                        <PhoneIcon className="h-3 w-3" />
                      </span>
                    }
                    onPress={() => window.open(whatsappLink, "_blank")}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    color="default"
                    variant="flat"
                    className="justify-start"
                    startContent={<SendIcon className="h-4 w-4 rotate-45 text-blue-500" />}
                    onPress={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Shopping List: ${listName}`,
                          text: `Check out my shopping list "${listName}"`,
                          url: shareLink
                        });
                      } else {
                        copyShareLink();
                      }
                    }}
                  >
                    Message
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-700">Share on social media</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Button
                  color="default"
                  variant="flat"
                  className="h-20 flex-col"
                  onPress={() => openShareWindow(whatsappLink)}
                >
                  <span className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full mb-1">
                    <PhoneIcon className="h-6 w-6" />
                  </span>
                  <span className="text-sm">WhatsApp</span>
                </Button>

                <Button
                  color="default"
                  variant="flat"
                  className="h-20 flex-col"
                  onPress={() => openShareWindow(facebookLink)}
                >
                  <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full mb-1">
                    <FacebookIcon className="h-6 w-6" />
                  </span>
                  <span className="text-sm">Facebook</span>
                </Button>

                <Button
                  color="default"
                  variant="flat"
                  className="h-20 flex-col"
                  onPress={() => openShareWindow(twitterLink)}
                >
                  <span className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full mb-1">
                    <TwitterIcon className="h-6 w-6" />
                  </span>
                  <span className="text-sm">Twitter</span>
                </Button>

                <Button
                  color="default"
                  variant="flat"
                  className="h-20 flex-col"
                  onPress={() => window.open(emailLink, "_blank")}
                >
                  <span className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full mb-1">
                    <MailIcon className="h-6 w-6" />
                  </span>
                  <span className="text-sm">Email</span>
                </Button>

                <Button
                  color="default"
                  variant="flat"
                  className="h-20 flex-col"
                  onPress={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Shopping List: ${listName}`,
                        text: `Check out my shopping list "${listName}"`,
                        url: shareLink
                      });
                    } else {
                      copyShareLink();
                    }
                  }}
                >
                  <span className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full mb-1">
                    <Share2Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm">More</span>
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <p className="text-sm">Copy link to share anywhere</p>
                  <Button
                    size="sm"
                    color="primary"
                    onPress={copyShareLink}
                    startContent={<CopyIcon className="h-4 w-4" />}
                  >
                    Copy
                  </Button>
                </div>

                <Input
                  ref={inputLinkRef}
                  value={shareLink}
                  startContent={<LinkIcon className="h-4 w-4 text-gray-400" />}
                  className="w-full"
                  readOnly
                  size="sm"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
            </div>
          )}

          {activeTab === "qr" && (
            <div className="space-y-5 text-center">
              <h3 className="text-sm font-semibold text-gray-700">QR Code for this shopping list</h3>
              <div className="flex justify-center py-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                  <QRCodeCanvas value={shareLink} size={200} level="H" includeMargin />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Scan this QR code with a smartphone camera to open the shopping list
              </p>
              <div className="flex justify-center pt-2">
                <Button
                  color="primary"
                  size="sm"
                  startContent={<CopyIcon className="h-4 w-4" />}
                  onPress={() => {
                    // Note: En réalité, il faudrait implémenter un téléchargement du QR Code en image
                    copyShareLink();
                    addToast({
                      title: <Trans>QR Code copied</Trans>,
                      description: <Trans>The link has been copied to clipboard</Trans>,
                      variant: "solid",
                      color: "success",
                      // @ts-ignore
                      duration: 2000
                    });
                  }}
                >
                  Download QR Code
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
