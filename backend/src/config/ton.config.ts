// src/config/ton.config.ts
import { TonClient } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';

export interface TonConfig {
    endpoint: string;
    contractAddress: string;
    isTestnet: boolean;
    gasFee: string;
}

export const getTonConfig = async (): Promise<TonConfig> => {
    const isTestnet = process.env.TON_NETWORK !== 'mainnet';
    
    const endpoint = await getHttpEndpoint({
        network: isTestnet ? 'testnet' : 'mainnet',
    });

    if (!process.env.TON_CONTRACT_ADDRESS) {
        throw new Error('TON_CONTRACT_ADDRESS environment variable is required.');
    }
    
    const defaultGasFee = isTestnet ? '0.01' : '0.05'; 
    const gasFee = process.env.TON_GAS_FEE || defaultGasFee;

    return {
        endpoint,
        contractAddress: process.env.TON_CONTRACT_ADDRESS,
        isTestnet,
        gasFee, 
    };
};

export const createTonClient = async (): Promise<TonClient> => {
    const config = await getTonConfig();
    return new TonClient({
        endpoint: config.endpoint,
    });
};