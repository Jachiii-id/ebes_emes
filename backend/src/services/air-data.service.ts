import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AirData } from '../schemas/air-data.schema';
import { CreateAirDataDto } from '../dto/create-air-data.dto';
import { SerialDevice } from 'src/schemas/serial-device.schema';
import { BlockchainService } from './blockchain.service';

@Injectable()
export class AirDataService {
    private readonly logger = new Logger(AirDataService.name);

    constructor(
        @InjectModel(AirData.name) private readonly airDataModel: Model<AirData>,
        @InjectModel(SerialDevice.name)
        private readonly deviceModel: Model<SerialDevice>,
        private readonly blockchainService: BlockchainService,
    ) { }

    async create(createAirDataDto: CreateAirDataDto): Promise<AirData> {
        const device = await this.deviceModel.findOne({
            device_id: createAirDataDto.device_id
        });

        if (!device) {
            throw new NotFoundException(
                `Device ${createAirDataDto.device_id} not found`
            );
        }

        const airData = await this.airDataModel.create({
            ...createAirDataDto,
            blockchain_synced: false
        });

        this.saveToBlockchain(device, airData)
            .catch(error => {
                this.logger.error(
                    `Failed to save Air to blockchain: ${error.message}`,
                    error.stack
                );
            });

        return airData;
    }

    private async saveToBlockchain(
        device: SerialDevice,
        airData: AirData,
    ): Promise<void> {
        try {
            const totalRecords = await this.blockchainService.getTotalAirRecords();
            const expectedRecordId = totalRecords + 1;

            await this.blockchainService.recordAirData(
                device.blockchain_device_id,
                device.company_id,
                airData.ppm,
                airData.status,
                airData.ro,
            );

            await this.airDataModel.findByIdAndUpdate(airData._id, {
                blockchain_record_id: expectedRecordId,
                blockchain_synced: true,
                blockchain_synced_at: new Date()
            });

            this.logger.log(
                `Air data saved to blockchain for device ${device.device_id} ` +
                `(blockchain ID: ${device.blockchain_device_id}, ` +
                `record ID: ${expectedRecordId})`
            );
        } catch (error) {
            throw error;
        }
    }

    async findByDevice(device_id: string): Promise<AirData[]> {
        return this.airDataModel.find({ device_id }).sort({ createdAt: -1 }).exec();
    }

    async all(): Promise<AirData[]> {
        const airDataList = await this.airDataModel.find().sort({ createdAt: -1 }).exec();

        const results = await Promise.all(
            airDataList.map(async (airData) => {
                const device = await this.deviceModel.findOne({ device_id: airData.device_id }).exec();
                if (!device) return null;

                const isVerified = await this.verifyLatest(device, airData);
                if (isVerified) {
                    return airData;
                }

                return null;
            })
        );

        return results.filter((result) => result !== null);
    }

    async findLatestByDevice(device_id: string): Promise<AirData | null> {
        return this.airDataModel.findOne({ device_id }).sort({ createdAt: -1 }).exec();
    }

    async verifyLatest(device: SerialDevice, airData: AirData): Promise<Boolean> {
        const blockchainData = await this.blockchainService.getLatestAir(device.blockchain_device_id);

        if (!blockchainData) {
            return false;
        }

        const ppmMatch = airData.ppm === blockchainData.ppm;
        const statusMatch = airData.status === blockchainData.status;

        const verified = ppmMatch && statusMatch;

        return verified;
    }

    async getBlockchainStats() {
        return this.blockchainService.getContractStats();
    }

    async getFromBlockchain(recordId: number): Promise<AirData | null> {
        return this.blockchainService.getAirData(recordId) as Promise<AirData | null>;
    }

    async getAllFromBlockchain(device_id: string): Promise<any[]> {
        const device = await this.deviceModel.findOne({ device_id });
        if (!device) {
            throw new NotFoundException(`Device ${device_id} not found`);
        }

        return this.blockchainService.getDeviceAirData(device.blockchain_device_id);
    }

    async getAllFromBlockchainPaginated(offset: number = 0, limit: number = 100): Promise<any[]> {
        return this.blockchainService.getAllAirData(offset, limit);
    }

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
        const blockchainRecords = await this.blockchainService.getDeviceAirData(
            device.blockchain_device_id
        );

        let verified = 0;
        const mismatches: any = [];

        for (const mongoData of mongoRecords) {
            const blockchainData = blockchainRecords.find(
                r => Number(r.id) === mongoData.blockchain_record_id
            );

            if (blockchainData) {
                const match = mongoData.ppm === blockchainData.ppm &&
                    mongoData.status === blockchainData.status;
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