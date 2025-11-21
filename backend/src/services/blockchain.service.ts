import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TonClient, Address, OpenedContract, WalletContractV4, internal, beginCell, toNano } from '@ton/ton';
import { KeyPair, mnemonicToWalletKey } from '@ton/crypto';
import { getTonConfig, createTonClient } from '../config/ton.config';
import { IoTDataRegistry, RecordAirData, RecordGpsData, storeRecordAirData, storeRecordGpsData } from 'build/IoTDataRegistry/IotDataRegistry_IoTDataRegistry';
import { Cell, SendMode, TupleReader, TupleBuilder } from '@ton/core';

interface GpsData {
    id: bigint;
    deviceId: bigint;
    companyId: bigint;
    lat: string;
    lng: string;
    speed: string;
    sats: string;
    timestamp: number;
}

interface AirData {
    id: bigint;
    deviceId: bigint;
    companyId: bigint;
    ppm: string;
    status: string;
    ro: string;
    timestamp: number;
}

@Injectable()
export class BlockchainService implements OnModuleInit {
    private readonly logger = new Logger(BlockchainService.name);
    private useSandbox: boolean;
    private client: TonClient;
    private contract: OpenedContract<IoTDataRegistry>;
    private contractAddress: Address;

    private walletKey: KeyPair;
    private walletContract: OpenedContract<WalletContractV4>;

    async onModuleInit() {
        this.useSandbox = process.env.BLOCKCHAIN_MODE === 'sandbox';

        if (this.useSandbox) {
            this.logger.log('🏖️ Running in SANDBOX mode (no real blockchain)');
            return;
        }

        try {
            this.client = await createTonClient();
            const config = await getTonConfig();

            const mnemonic = process.env.TON_MNEMONIC;
            if (!mnemonic) {
                this.logger.error('❌ TON_MNEMONIC environment variable is not set. Cannot send transactions.');
            } else {
                this.walletKey = await mnemonicToWalletKey(mnemonic.split(' '));
                this.walletContract = this.client.open(
                    WalletContractV4.create({
                        workchain: 0,
                        publicKey: this.walletKey.publicKey,
                    })
                );
                this.logger.log(`🔑 Transaction Wallet loaded: ${this.walletContract.address.toString()}`);
            }

            this.contractAddress = Address.parse(config.contractAddress);

            this.contract = this.client.open(
                IoTDataRegistry.fromAddress(this.contractAddress)
            );

            this.logger.log(`🌐 Connected to TON ${config.isTestnet ? 'TESTNET' : 'MAINNET'}`);
            this.logger.log(`📝 Contract address: ${this.contractAddress.toString()}`);

            const totalGps = await this.contract.getGetTotalGpsRecords();
            const totalAir = await this.contract.getGetTotalAirRecords();
            this.logger.log(`✅ Contract connected! GPS records: ${totalGps}, Air records: ${totalAir}`);
        } catch (error) {
            this.logger.error('❌ Failed to initialize blockchain connection', error);
            throw error;
        }
    }

    private async sendTransaction(messageBody: Cell): Promise<void> {
        const tonConfig = await getTonConfig();

        if (!this.walletContract || !this.walletKey) {
            throw new Error('Wallet not configured. Check TON_MNEMONIC environment variable.');
        }

        try {
            const seqno = await this.walletContract.getSeqno();

            const transaction = await this.walletContract.createTransfer({
                secretKey: this.walletKey.secretKey,
                seqno: seqno,
                messages: [
                    internal({
                        to: this.contractAddress,
                        value: toNano(tonConfig.gasFee),
                        body: messageBody,
                        bounce: true,
                    }),
                ],
                sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS, // Which equals 3
            });

            await this.client.sendExternalMessage(this.walletContract, transaction);

            this.logger.log(`🚀 Transaction sent! Contract: ${this.contractAddress.toString()}, Seqno: ${seqno}`);
        } catch (error) {
            this.logger.error('Failed to send transaction:', error);
            throw new Error(`Transaction failed: ${error.message}`);
        }
    }

    async recordGpsData(
        blockchainDeviceId: number,
        companyId: number,
        lat: string,
        lng: string,
        speed: string,
        sats: string,
    ): Promise<void> {
        if (this.useSandbox) {
            this.logger.debug(
                `[SANDBOX] GPS recorded: Device ${blockchainDeviceId}, ` +
                `Company ${companyId}, Location: ${lat},${lng}`
            );
            return;
        }

        const gpsMsg: RecordGpsData = {
            $$type: 'RecordGpsData',
            deviceId: BigInt(blockchainDeviceId),
            companyId: BigInt(companyId),
            lat: lat,
            lng: lng,
            speed: speed,
            sats: sats,
        };

        const messageBody = beginCell()
            .store(storeRecordGpsData(gpsMsg))  // Use the store function
            .endCell();

        await this.sendTransaction(messageBody);

        this.logger.log(
            `GPS transaction initiated for device ${blockchainDeviceId}`
        );
    }

    async recordAirData(
        blockchainDeviceId: number,
        companyId: number,
        ppm: string,
        status: string,
        ro: string,
    ): Promise<void> {
        if (this.useSandbox) {
            this.logger.debug(
                `[SANDBOX] Air recorded: Device ${blockchainDeviceId}, ` +
                `Company ${companyId}, PPM: ${ppm}, Status: ${status}`
            );
            return;
        }

        const airMsg: RecordAirData = {
            $$type: 'RecordAirData',
            deviceId: BigInt(blockchainDeviceId),
            companyId: BigInt(companyId),
            ppm: ppm,
            status: status,
            ro: ro,
        };

        const messageBody = beginCell()
            .store(storeRecordAirData(airMsg))
            .endCell();

        await this.sendTransaction(messageBody);

        this.logger.log(
            `Air transaction initiated for device ${blockchainDeviceId}`
        );
    }

    async getLatestGps(blockchainDeviceId: number): Promise<GpsData | null> {
        if (this.useSandbox) {
            this.logger.debug(`[SANDBOX] Getting latest GPS for device ${blockchainDeviceId}`);
            return null;
        }

        try {
            const result = await this.contract.getGetLatestGps(BigInt(blockchainDeviceId));

            if (!result) {
                return null;
            }

            return {
                id: result.id,
                deviceId: result.deviceId,
                companyId: result.companyId,
                lat: result.lat,
                lng: result.lng,
                speed: result.speed,
                sats: result.sats,
                timestamp: Number(result.timestamp),
            };
        } catch (error) {
            // Handle deserialization errors when record doesn't exist
            // The contract returns null but it might be serialized in a way that causes deserialization to fail
            if (error instanceof Error && (error.message.includes('Not a number') || error.message.includes('Not a string'))) {
                this.logger.debug(`Latest GPS data for device ${blockchainDeviceId} not found (deserialization error treated as null)`);
                return null;
            }
            this.logger.error(`Failed to get latest GPS for device ${blockchainDeviceId}`, error);
            return null;
        }
    }

    async getLatestAir(blockchainDeviceId: number): Promise<AirData | null> {
        if (this.useSandbox) {
            this.logger.debug(`[SANDBOX] Getting latest Air for device ${blockchainDeviceId}`);
            return null;
        }

        try {
            const result = await this.contract.getGetLatestAir(BigInt(blockchainDeviceId));

            if (!result) {
                return null;
            }

            return {
                id: result.id,
                deviceId: result.deviceId,
                companyId: result.companyId,
                ppm: result.ppm,
                status: result.status,
                ro: result.ro,
                timestamp: Number(result.timestamp),
            };
        } catch (error) {
            // Handle deserialization errors when record doesn't exist
            // The contract returns null but it might be serialized in a way that causes deserialization to fail
            if (error instanceof Error && (error.message.includes('Not a number') || error.message.includes('Not a string'))) {
                this.logger.debug(`Latest Air data for device ${blockchainDeviceId} not found (deserialization error treated as null)`);
                return null;
            }
            this.logger.error(`Failed to get latest Air for device ${blockchainDeviceId}`, error);
            return null;
        }
    }

    async getGpsData(id: number): Promise<GpsData | null> {
        if (this.useSandbox) {
            return null;
        }

        try {
            const result = await this.contract.getGetGpsData(BigInt(id));
            return result ? {
                id: result.id,
                deviceId: result.deviceId,
                companyId: result.companyId,
                lat: result.lat,
                lng: result.lng,
                speed: result.speed,
                sats: result.sats,
                timestamp: Number(result.timestamp),
            } : null;
        } catch (error) {
            // Try manual deserialization if auto-deserialization fails
            if (error instanceof Error && (error.message.includes('Not a number') || error.message.includes('Not a string'))) {
                this.logger.debug(`Auto-deserialization failed for GPS data ${id}, trying manual deserialization...`);
                try {
                    return await this.getGpsDataManual(id);
                } catch (manualError) {
                    this.logger.debug(`Manual deserialization also failed for GPS data ${id}, record likely doesn't exist`);
                    return null;
                }
            }
            this.logger.error(`Failed to get GPS data ${id}`, error);
            return null;
        }
    }

    /**
     * Manual deserialization of GpsData - handles cases where auto-deserialization fails
     * This function tries multiple deserialization strategies to handle different formats
     */
    private async getGpsDataManual(id: number): Promise<GpsData | null> {
        const builder = new TupleBuilder();
        builder.writeNumber(BigInt(id));
        
        try {
            const result = await this.client.provider(this.contractAddress).get('getGpsData', builder.build());
            const stack = result.stack;
            
            // Strategy 1: Try reading as optional tuple (standard Tact format)
            const tupleOpt = stack.readTupleOpt();
            if (!tupleOpt) {
                this.logger.debug(`GPS data ${id}: Contract returned null (no tuple)`);
                return null;
            }

            // Strategy 2: Try reading fields in order
            try {
                const reader = tupleOpt;
                const _id = reader.readBigNumber();
                const _deviceId = reader.readBigNumber();
                const _companyId = reader.readBigNumber();
                const _lat = reader.readString();
                const _lng = reader.readString();
                const _speed = reader.readString();
                const _sats = reader.readString();
                const _timestamp = reader.readBigNumber();

                this.logger.debug(`GPS data ${id}: Successfully deserialized manually`);
                return {
                    id: _id,
                    deviceId: _deviceId,
                    companyId: _companyId,
                    lat: _lat,
                    lng: _lng,
                    speed: _speed,
                    sats: _sats,
                    timestamp: Number(_timestamp),
                };
            } catch (readError) {
                // Strategy 3: Try reading as cell (struct might be serialized as cell)
                this.logger.debug(`GPS data ${id}: Tuple reading failed, trying cell deserialization...`);
                try {
                    // Reset the reader
                    const cellReader = stack.readCellOpt();
                    if (!cellReader) {
                        this.logger.debug(`GPS data ${id}: No cell found either`);
                        return null;
                    }
                    // If it's a cell, we'd need to use loadGpsData from the generated code
                    // For now, log the error and return null
                    this.logger.warn(`GPS data ${id}: Found cell but cell deserialization not implemented in manual method`);
                    return null;
                } catch (cellError) {
                    this.logger.error(`GPS data ${id}: All deserialization strategies failed`, {
                        tupleError: readError,
                        cellError: cellError,
                        stackRemaining: stack.remaining
                    });
                    return null;
                }
            }
        } catch (error) {
            this.logger.error(`GPS data ${id}: Failed to call contract`, error);
            return null;
        }
    }

    async getAirData(id: number): Promise<AirData | null> {
        if (this.useSandbox) {
            return null;
        }

        try {
            const result = await this.contract.getGetAirData(BigInt(id));
            return result ? {
                id: result.id,
                deviceId: result.deviceId,
                companyId: result.companyId,
                ppm: result.ppm,
                status: result.status,
                ro: result.ro,
                timestamp: Number(result.timestamp),
            } : null;
        } catch (error) {
            // Try manual deserialization if auto-deserialization fails
            if (error instanceof Error && (error.message.includes('Not a number') || error.message.includes('Not a string'))) {
                this.logger.debug(`Auto-deserialization failed for Air data ${id}, trying manual deserialization...`);
                try {
                    return await this.getAirDataManual(id);
                } catch (manualError) {
                    this.logger.debug(`Manual deserialization also failed for Air data ${id}, record likely doesn't exist`);
                    return null;
                }
            }
            this.logger.error(`Failed to get Air data ${id}`, error);
            return null;
        }
    }

    /**
     * Manual deserialization of AirData - handles cases where auto-deserialization fails
     * This function tries multiple deserialization strategies to handle different formats
     */
    private async getAirDataManual(id: number): Promise<AirData | null> {
        const builder = new TupleBuilder();
        builder.writeNumber(BigInt(id));
        
        try {
            const result = await this.client.provider(this.contractAddress).get('getAirData', builder.build());
            const stack = result.stack;
            
            // Strategy 1: Try reading as optional tuple (standard Tact format)
            const tupleOpt = stack.readTupleOpt();
            if (!tupleOpt) {
                this.logger.debug(`Air data ${id}: Contract returned null (no tuple)`);
                return null;
            }

            // Strategy 2: Try reading fields in order
            try {
                const reader = tupleOpt;
                const _id = reader.readBigNumber();
                const _deviceId = reader.readBigNumber();
                const _companyId = reader.readBigNumber();
                const _ppm = reader.readString();
                const _status = reader.readString();
                const _ro = reader.readString();
                const _timestamp = reader.readBigNumber();

                this.logger.debug(`Air data ${id}: Successfully deserialized manually`);
                return {
                    id: _id,
                    deviceId: _deviceId,
                    companyId: _companyId,
                    ppm: _ppm,
                    status: _status,
                    ro: _ro,
                    timestamp: Number(_timestamp),
                };
            } catch (readError) {
                // Strategy 3: Try reading as cell (struct might be serialized as cell)
                this.logger.debug(`Air data ${id}: Tuple reading failed, trying cell deserialization...`);
                try {
                    // Reset the reader
                    const cellReader = stack.readCellOpt();
                    if (!cellReader) {
                        this.logger.debug(`Air data ${id}: No cell found either`);
                        return null;
                    }
                    // If it's a cell, we'd need to use loadAirData from the generated code
                    // For now, log the error and return null
                    this.logger.warn(`Air data ${id}: Found cell but cell deserialization not implemented in manual method`);
                    return null;
                } catch (cellError) {
                    this.logger.error(`Air data ${id}: All deserialization strategies failed`, {
                        tupleError: readError,
                        cellError: cellError,
                        stackRemaining: stack.remaining
                    });
                    return null;
                }
            }
        } catch (error) {
            this.logger.error(`Air data ${id}: Failed to call contract`, error);
            return null;
        }
    }

    async getTotalGpsRecords(): Promise<number> {
        if (this.useSandbox) {
            return 0;
        }

        try {
            const total = await this.contract.getGetTotalGpsRecords();
            return Number(total);
        } catch (error) {
            this.logger.error('Failed to get total GPS records', error);
            return 0;
        }
    }

    async getTotalAirRecords(): Promise<number> {
        if (this.useSandbox) {
            return 0;
        }

        try {
            const total = await this.contract.getGetTotalAirRecords();
            return Number(total);
        } catch (error) {
            this.logger.error('Failed to get total Air records', error);
            return 0;
        }
    }

    /**
 * Get all Air data with pagination
 */
    async getAllAirData(offset: number = 0, limit: number = 100): Promise<AirData[]> {
        if (this.useSandbox) {
            this.logger.debug(`[SANDBOX] Getting all air data (offset: ${offset}, limit: ${limit})`);
            return [];
        }

        try {
            const resultMap = await this.contract.getGetAllAirData();

            // Convert Dictionary/Map to array
            const results: AirData[] = [];

            // The result is a map where keys are record IDs
            for (const [id, data] of Object.entries(resultMap || {})) {
                if (data) {
                    results.push({
                        id: BigInt(id),
                        deviceId: data.deviceId,
                        companyId: data.companyId,
                        ppm: data.ppm,
                        status: data.status,
                        ro: data.ro,
                        timestamp: Number(data.timestamp),
                    });
                }
            }

            this.logger.debug(`Retrieved ${results.length} air records from blockchain`);
            return results;
        } catch (error) {
            this.logger.error(`Failed to get all air data (offset: ${offset}, limit: ${limit})`, error);
            return [];
        }
    }

    /**
     * Get all GPS data with pagination
     */
    async getAllGpsData(offset: number = 0, limit: number = 100): Promise<GpsData[]> {
        if (this.useSandbox) {
            this.logger.debug(`[SANDBOX] Getting all GPS data (offset: ${offset}, limit: ${limit})`);
            return [];
        }

        try {
            const resultMap = await this.contract.getGetAllGpsData();

            const results: GpsData[] = [];

            for (const [id, data] of Object.entries(resultMap || {})) {
                if (data) {
                    results.push({
                        id: BigInt(id),
                        deviceId: data.deviceId,
                        companyId: data.companyId,
                        lat: data.lat,
                        lng: data.lng,
                        speed: data.speed,
                        sats: data.sats,
                        timestamp: Number(data.timestamp),
                    });
                }
            }

            this.logger.debug(`Retrieved ${results.length} GPS records from blockchain`);
            return results;
        } catch (error) {
            this.logger.error(`Failed to get all GPS data (offset: ${offset}, limit: ${limit})`, error);
            return [];
        }
    }

    /**
     * Get ALL air data for a specific device (fetches all pages)
     */
    async getDeviceAirData(blockchainDeviceId: number): Promise<AirData[]> {
        if (this.useSandbox) {
            this.logger.debug(`[SANDBOX] Getting all air data for device ${blockchainDeviceId}`);
            return [];
        }

        try {
            const batchSize = 100;
            let offset = 0;
            let allDeviceData: AirData[] = [];
            let hasMore = true;

            this.logger.debug(`Fetching all air data for device ${blockchainDeviceId}...`);

            while (hasMore) {
                const batch = await this.getAllAirData(offset, batchSize);

                if (batch.length === 0) {
                    hasMore = false;
                } else {
                    // Filter for this specific device
                    const deviceBatch = batch.filter(
                        record => Number(record.deviceId) === blockchainDeviceId
                    );

                    allDeviceData.push(...deviceBatch);
                    offset += batchSize;

                    // Stop if we got less than batch size (reached end)
                    if (batch.length < batchSize) {
                        hasMore = false;
                    }

                    this.logger.debug(
                        `Batch ${offset / batchSize}: ${deviceBatch.length} records for device ${blockchainDeviceId}`
                    );
                }
            }

            this.logger.log(
                `Retrieved ${allDeviceData.length} total air records for device ${blockchainDeviceId}`
            );
            return allDeviceData;
        } catch (error) {
            this.logger.error(`Failed to get device air data for ${blockchainDeviceId}`, error);
            return [];
        }
    }

    /**
     * Get ALL GPS data for a specific device (fetches all pages)
     */
    async getDeviceGpsData(blockchainDeviceId: number): Promise<GpsData[]> {
        if (this.useSandbox) {
            this.logger.debug(`[SANDBOX] Getting all GPS data for device ${blockchainDeviceId}`);
            return [];
        }

        try {
            const batchSize = 100;
            let offset = 0;
            let allDeviceData: GpsData[] = [];
            let hasMore = true;

            this.logger.debug(`Fetching all GPS data for device ${blockchainDeviceId}...`);

            while (hasMore) {
                const batch = await this.getAllGpsData(offset, batchSize);

                if (batch.length === 0) {
                    hasMore = false;
                } else {
                    const deviceBatch = batch.filter(
                        record => Number(record.deviceId) === blockchainDeviceId
                    );

                    allDeviceData.push(...deviceBatch);
                    offset += batchSize;

                    if (batch.length < batchSize) {
                        hasMore = false;
                    }

                    this.logger.debug(
                        `Batch ${offset / batchSize}: ${deviceBatch.length} records for device ${blockchainDeviceId}`
                    );
                }
            }

            this.logger.log(
                `Retrieved ${allDeviceData.length} total GPS records for device ${blockchainDeviceId}`
            );
            return allDeviceData;
        } catch (error) {
            this.logger.error(`Failed to get device GPS data for ${blockchainDeviceId}`, error);
            return [];
        }
    }

    async getContractStats() {
        if (this.useSandbox) {
            return {
                totalGps: 0,
                totalAir: 0,
                mode: 'sandbox'
            };
        }

        const totalGps = await this.getTotalGpsRecords();
        const totalAir = await this.getTotalAirRecords();

        return {
            totalGps,
            totalAir,
            mode: 'blockchain',
            contractAddress: this.contractAddress.toString(),
            // Useful for knowing how many pages to fetch
            gpsPages: Math.ceil(totalGps / 100),
            airPages: Math.ceil(totalAir / 100),
        };
    }
}