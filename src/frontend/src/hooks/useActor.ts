/**
 * useActor — wraps the platform's core-infrastructure useActor with our
 * generated createActor function. Returns { actor, isFetching } where actor
 * is the typed backend interface or null while loading.
 *
 * The platform's createActorFunction signature requires uploadFile / downloadFile
 * callbacks for ExternalBlob support. Since we manage blobs as raw Uint8Array
 * directly, we provide identity pass-through handlers.
 */
import { useActor as usePlatformActor } from "@caffeineai/core-infrastructure";
import { ExternalBlob, createActor } from "../backend";
import type { backendInterface } from "../backend.d";

export function useActor(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  return usePlatformActor<backendInterface>(
    (canisterId, _uploadFile, _downloadFile, options) =>
      createActor(
        canisterId,
        async (file: ExternalBlob) => file.getBytes(),
        async (bytes: Uint8Array) =>
          ExternalBlob.fromBytes(bytes as Uint8Array<ArrayBuffer>),
        options,
      ),
  );
}
