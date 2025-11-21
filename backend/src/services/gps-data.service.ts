import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GpsData } from '../schemas/gps-data.schema';
import { CreateGpsDataDto } from '../dto/create-gps-data.dto';
import { SerialDevice } from 'src/schemas/serial-device.schema';
import { BlockchainService } from './blockchain.service';

@Injectable()
export class GpsDataService {
    private readonly logger = new Logger(GpsDataService.name);

    constructor(
        @InjectModel(GpsData.name) private readonly gpsDataModel: Model<GpsData>,
        @InjectModel(SerialDevice.name)
        private readonly deviceModel: Model<SerialDevice>,
        private readonly blockchainService: BlockchainService,
    ) { }

    async create(createGpsDataDto: CreateGpsDataDto): Promise<GpsData> {
        const device = await this.deviceModel.findOne({
            device_id: createGpsDataDto.device_id
        });

        if (!device) {
            throw new NotFoundException(
                `Device ${createGpsDataDto.device_id} not found`
            );
        }

        const gpsData = await this.gpsDataModel.create({
            ...createGpsDataDto,
            blockchain_synced: false
        });
        this.logger.log(`GPS data saved to MongoDB for device ${device.device_id}`);

        this.saveToBlockchain(device, gpsData)
            .catch(error => {
                this.logger.error(
                    `Failed to save GPS to blockchain: ${error.message}`,
                    error.stack
                );
            });

        return gpsData;
    }

    private async saveToBlockchain(
        device: SerialDevice,
        data: GpsData,
    ): Promise<void> {
        try {
            const totalRecords = await this.blockchainService.getTotalAirRecords();
            const expectedRecordId = totalRecords + 1;

            await this.blockchainService.recordGpsData(
                device.blockchain_device_id,
                device.company_id,
                data.lat,
                data.lng,
                data.speed,
                data.sats,
            );

            await this.gpsDataModel.findByIdAndUpdate(data._id, {
                blockchain_record_id: expectedRecordId,
                blockchain_synced: true,
                blockchain_synced_at: new Date()
            });

            this.logger.log(
                `GPS data saved to blockchain for device ${device.device_id} ` +
                `(blockchain ID: ${device.blockchain_device_id})`
            );
        } catch (error) {
            throw error;
        }
    }

    async all(): Promise<GpsData[]> {
        return this.gpsDataModel.find().sort({ createdAt: -1 }).exec();
    }

    async findByDevice(device_id: string): Promise<GpsData[]> {
        return this.gpsDataModel.find({ device_id }).sort({ createdAt: -1 }).exec();
    }

    async findLatestByDevice(device_id: string): Promise<GpsData | null> {
        return this.gpsDataModel.findOne({ device_id }).sort({ createdAt: -1 }).exec();
    }

    async verifyLatest(device_id: string): Promise<{
        verified: boolean;
        mongoData: GpsData | null;
        blockchainData: any;
        details?: {
            latMatch: boolean;
            lngMatch: boolean;
            speedMatch: boolean;
        }
    }> {
        const device = await this.deviceModel.findOne({ device_id });
        if (!device) {
            throw new NotFoundException(`Device ${device_id} not found`);
        }

        const mongoData = await this.findLatestByDevice(device_id);
        const blockchainData = await this.blockchainService.getLatestGps(
            device.blockchain_device_id
        );

        if (!mongoData || !blockchainData) {
            return {
                verified: false,
                mongoData,
                blockchainData,
                details: undefined
            };
        }

        const latMatch = mongoData.lat === blockchainData.lat;
        const lngMatch = mongoData.lng === blockchainData.lng;
        const speedMatch = mongoData.speed === blockchainData.speed;

        const verified = latMatch && lngMatch && speedMatch;

        return {
            verified,
            mongoData,
            blockchainData,
            details: {
                latMatch,
                lngMatch,
                speedMatch
            }
        };
    }

    async getBlockchainStats() {
        return this.blockchainService.getContractStats();
    }

    async getFromBlockchain(recordId: number): Promise<any | null> {
        return this.blockchainService.getGpsData(recordId);
    }

    // Get all GPS data for a device from blockchain
    async getAllFromBlockchain(device_id: string): Promise<any[]> {
        const device = await this.deviceModel.findOne({ device_id });
        if (!device) {
            throw new NotFoundException(`Device ${device_id} not found`);
        }

        return this.blockchainService.getDeviceGpsData(device.blockchain_device_id);
    }

    // Get ALL GPS data (no device filter)
    async getAllFromBlockchainPaginated(offset: number = 0, limit: number = 100): Promise<any[]> {
        return this.blockchainService.getAllGpsData(offset, limit);
    }

    // Verify all MongoDB records against blockchain
    async verifyAllRecords(device_id: string): Promise<{
        total: number;
        verified: number;
        mismatches: any[];
    }> {
        const device = await this.deviceModel.findOne({ device_id });
        if (!device) {
            throw new NotFoundException(`Device ${device_id} not found`);
        }

        const mongoRecords = await this.findByDevice(device_id);
        const blockchainRecords = await this.blockchainService.getDeviceGpsData(
            device.blockchain_device_id
        );

        let verified = 0;
        const mismatches: any = [];

        for (const mongoData of mongoRecords) {
            const blockchainData = blockchainRecords.find(
                r => Number(r.id) === mongoData.blockchain_record_id
            );

            if (blockchainData) {
                const match = mongoData.lat === blockchainData.lat &&
                    mongoData.lng === blockchainData.lng;
                if (match) {
                    verified++;
                } else {
                    mismatches.push({ mongoData, blockchainData });
                }
            }
        }

        return { total: mongoRecords.length, verified, mismatches };
    }
}