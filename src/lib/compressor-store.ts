import { kvGet, kvSet, kvDelete } from "./idb";

const KEY = "compressor";

export type CompressorStatus = "idle" | "ready" | "compressing" | "done" | "error";

export type PresetId = "compact" | "balanced" | "quality";

export interface SavedCompressorState {
  status: CompressorStatus;
  file: File | null;
  level: number;
  presetId: PresetId | null;
  showAdvanced: boolean;
  result: { blob: Blob; size: number; pages: number } | null;
  error: string | null;
}

export async function saveCompressorState(
  state: SavedCompressorState,
): Promise<void> {
  await kvSet(KEY, state);
}

export async function loadCompressorState(): Promise<SavedCompressorState | null> {
  return (await kvGet<SavedCompressorState>(KEY)) ?? null;
}

export async function clearCompressorState(): Promise<void> {
  await kvDelete(KEY);
}