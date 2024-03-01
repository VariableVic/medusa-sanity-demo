import { SanityDocumentStub } from "@sanity/client";

export type ProductDocumentCreateDTO = SanityDocumentStub & {
  _id: string;
  title: string;
  description?: string;
};

export type ProductEvent = {
  id: string;
  no_notification: boolean;
};
