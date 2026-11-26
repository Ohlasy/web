import { type Book, fetchAllBooks, fetchBookById } from "./data/books.ts";
import {
  createInvoice,
  createInvoicingSubject,
  type NewInvoice,
  type NewInvoicingSubject,
} from "./data/fakturoid.ts";
import { type SavedOrder, saveNewOrder } from "./data/orders.ts";
import type { S3UploadProps } from "./data/s3.ts";
import { uploadFileToS3 } from "./data/s3.ts";
import {
  downloadSlackAttachment,
  sendSlackMessage,
  validateSlackToken,
} from "./slack.ts";

export type Env = {
  Bindings: SideEffects;
};

type SlackEffects = {
  /** Send Slack message to given channel */
  sendSlackMessage(channel: string, text: string): Promise<void>;

  /** Validate given Slack legacy verification token */
  validateSlackToken(token?: string): Promise<boolean>;

  /** Download private Slack attachment */
  downloadSlackAttachment(privateUrl: string): Promise<Uint8Array>;
};

type StoreEffects = {
  /** Get a list of all books sold through our store */
  fetchAllBooks(): Promise<Book[]>;

  /** Get book by database ID */
  fetchBookById(bookId: string): Promise<Book | undefined>;

  /** Create new invoicing subject, returns new subject ID */
  createInvoicingSubject(subject: NewInvoicingSubject): Promise<number>;

  /** Create new invoice, returns public invoice URL */
  createInvoice(invoiceData: NewInvoice): Promise<string>;

  /** Save new order to database */
  saveNewOrder(order: Omit<SavedOrder, "id">): Promise<SavedOrder>;
};

type OtherEffects = {
  /** Upload file to our S3-like storage */
  uploadFileToS3(props: S3UploadProps): Promise<void>;
};

export type SideEffects = SlackEffects & StoreEffects & OtherEffects;

export const liveSideEffects: SideEffects = {
  // Slack
  sendSlackMessage,
  downloadSlackAttachment,
  validateSlackToken,
  // Store
  fetchAllBooks,
  fetchBookById,
  createInvoicingSubject,
  createInvoice,
  saveNewOrder,
  // Others
  uploadFileToS3,
};
