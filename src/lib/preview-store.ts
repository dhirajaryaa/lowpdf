import { kvGet, kvSet, kvDelete } from "./idb";

const KEY = "current";

export interface PreviewData {
  blob: Blob;
  name: string;
}

export async function savePreview(blob: Blob, name: string): Promise<void> {
  await kvSet(KEY, { blob, name } satisfies PreviewData);
}

export async function loadPreview(): Promise<PreviewData | null> {
  return (await kvGet<PreviewData>(KEY)) ?? null;
}

export async function clearPreview(): Promise<void> {
  await kvDelete(KEY);
}