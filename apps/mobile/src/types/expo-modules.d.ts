declare module 'expo-print' {
  export interface PrintOptions {
    html?: string;
    uri?: string;
    width?: number;
    height?: number;
    printerUrl?: string;
    margins?: {
      left?: number;
      top?: number;
      right?: number;
      bottom?: number;
    };
    base64?: boolean;
  }

  export interface FilePrintResult {
    uri: string;
    numberOfPages: number;
    base64?: string;
  }

  export function printAsync(options: PrintOptions): Promise<void>;
  export function printToFileAsync(options: PrintOptions): Promise<FilePrintResult>;
}

declare module 'expo-sharing' {
  export interface SharingOptions {
    mimeType?: string;
    dialogTitle?: string;
    UTI?: string;
  }

  export function isAvailableAsync(): Promise<boolean>;
  export function shareAsync(url: string, options?: SharingOptions): Promise<void>;
}

declare module 'expo-file-system' {
  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;

  export enum EncodingType {
    UTF8 = 'utf8',
    Base64 = 'base64',
  }

  export interface WritingOptions {
    encoding?: EncodingType | 'utf8' | 'base64';
  }

  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: WritingOptions
  ): Promise<void>;

  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: EncodingType | 'utf8' | 'base64' }
  ): Promise<string>;

  export function copyAsync(options: { from: string; to: string }): Promise<void>;
  export function deleteAsync(fileUri: string, options?: { idempotent?: boolean }): Promise<void>;
}

declare module 'expo-file-system/legacy' {
  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;

  export enum EncodingType {
    UTF8 = 'utf8',
    Base64 = 'base64',
  }

  export interface WritingOptions {
    encoding?: EncodingType | 'utf8' | 'base64';
  }

  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: WritingOptions
  ): Promise<void>;

  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: EncodingType | 'utf8' | 'base64' }
  ): Promise<string>;

  export function copyAsync(options: { from: string; to: string }): Promise<void>;
  export function deleteAsync(fileUri: string, options?: { idempotent?: boolean }): Promise<void>;
}
