import { getAddress as quaisGetAddress, verifyMessage as quaisVerifyMessage } from 'quais';
import { getAddress as ethersGetAddress, verifyMessage as ethersVerifyMessage } from 'ethers';
import type { Config } from '../config.js';

/**
 * Chain-kind-aware address/signature helpers.
 *
 * quais.getAddress / quais.verifyMessage apply Quai's own zone-aware address rules, which can
 * reject a perfectly valid plain-EVM address or signature from a standard chain (see
 * CHAIN_AUDIT.md §4.4). Under CHAIN_KIND=evm these helpers use the equivalent ethers v6
 * functions instead. Under CHAIN_KIND=quai (the default, including every config object that
 * doesn't set CHAIN_KIND at all) behaviour is byte-for-byte identical to calling quais directly.
 */

/** EIP-55 (or Quai zone-checksum, under CHAIN_KIND=quai) address normalization. Throws on an
 *  invalid address, exactly like quais.getAddress / ethers.getAddress. */
export function normalizeAddress(cfg: Pick<Config, 'CHAIN_KIND'>, address: string): string {
  return cfg.CHAIN_KIND === 'evm' ? ethersGetAddress(address) : quaisGetAddress(address);
}

/** Recovers the signer of a personal-message signature. Throws on malformed input, exactly like
 *  quais.verifyMessage / ethers.verifyMessage. */
export function recoverMessageSigner(
  cfg: Pick<Config, 'CHAIN_KIND'>,
  message: string,
  signature: string,
): string {
  return cfg.CHAIN_KIND === 'evm'
    ? ethersVerifyMessage(message, signature)
    : quaisVerifyMessage(message, signature);
}
