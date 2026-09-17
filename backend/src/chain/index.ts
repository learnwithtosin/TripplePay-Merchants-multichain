import type { Config } from '../config.js';
import type { ChainClient } from './types.js';
import { QuaiClient } from './client.js';
import { EvmClient } from './evmClient.js';
import { log } from '../logger.js';

const logger = log('chain');

/**
 * Selects the chain client for this process based on CHAIN_KIND (config.ts). One backend
 * deployment serves exactly one chain — there is no per-request or per-merchant chain selection.
 */
export function createChainClient(cfg: Config): ChainClient {
  const client: ChainClient = cfg.CHAIN_KIND === 'evm' ? new EvmClient(cfg) : new QuaiClient(cfg);
  logger.info(
    { chainKind: cfg.CHAIN_KIND, chainId: cfg.CHAIN_ID, contract: client.address },
    'chain client selected',
  );
  return client;
}
