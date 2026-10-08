import { useCallback, useEffect, useMemo, useRef } from "react";
import type { LoanDraftStorageKey } from "../constants/loanDraftKeys";
import {
  createLoanDraftStorage,
  type LoanDraftStorage,
  type StoredLoanDraft,
} from "../services/loanDraftStorage";

export interface UseLoanDraftOptions<TDraft extends object> {
  /** One of `LOAN_DRAFT_STORAGE_KEYS`; new keys must be added there deliberately. */
  storageKey: LoanDraftStorageKey;
  /** Receives a saved draft from `restoreDraft` (or on mount when `restoreOnMount` is set). */
  onRestore?: (draft: StoredLoanDraft<TDraft>) => void;
  /** Restore once when the screen mounts. Defaults to false. */
  restoreOnMount?: boolean;
}

export interface LoanDraft<TDraft extends object> extends LoanDraftStorage<TDraft> {
  /** Loads the saved draft and hands it to `onRestore`. Resolves `true` when a draft was found. */
  restoreDraft: () => Promise<boolean>;
}

/**
 * Typed access to a per-device loan draft. Storage key and saved format are
 * unchanged from the existing loan draft services; leave-screen prompts stay
 * with `useUniversalDraftGuard`.
 */
export function useLoanDraft<TDraft extends object>({
  storageKey,
  onRestore,
  restoreOnMount = false,
}: UseLoanDraftOptions<TDraft>): LoanDraft<TDraft> {
  const storage = useMemo(() => createLoanDraftStorage<TDraft>(storageKey), [storageKey]);

  const onRestoreRef = useRef(onRestore);
  useEffect(() => {
    onRestoreRef.current = onRestore;
  }, [onRestore]);

  const restoreDraft = useCallback(async (): Promise<boolean> => {
    const draft = await storage.loadDraft();
    if (!draft) return false;
    onRestoreRef.current?.(draft);
    return true;
  }, [storage]);

  useEffect(() => {
    if (restoreOnMount) {
      restoreDraft();
    }
  }, [restoreOnMount, restoreDraft]);

  return { ...storage, restoreDraft };
}

export default useLoanDraft;
