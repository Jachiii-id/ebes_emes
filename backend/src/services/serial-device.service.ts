import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SerialDevice } from '../schemas/serial-device.schema';
import { CreateSerialDeviceDto } from '../dto/create-serial-device.dto';
import { UpdateSerialDeviceDto } from 'src/dto/update-serial-device.dto';

@Injectable()
export class SerialDeviceService {
    private readonly logger = new Logger(SerialDeviceService.name);

    constructor(
        @InjectModel(SerialDevice.name) private readonly serialDeviceModel: Model<SerialDevice>,
    ) { }

    async create(createSerialDeviceDto: CreateSerialDeviceDto): Promise<SerialDevice> {
        const blockchainDeviceId = await this.getNextBlockchainDeviceId();

        const createdDevice = await this.serialDeviceModel.create({
            ...createSerialDeviceDto,
            blockchain_device_id: blockchainDeviceId,
            company_id: createSerialDeviceDto.company_id || 1,
        });

        return createdDevice;
    }

    private async getNextBlockchainDeviceId(): Promise<number> {
        const lastDevice = await this.serialDeviceModel
            .findOne()
            .sort({ blockchain_device_id: -1 })
            .exec();

        return lastDevice ? lastDevice.blockchain_device_id + 1 : 1;
    }

    async findAll(): Promise<SerialDevice[]> {
        return this.serialDeviceModel.find().exec();
    }

    async findOne(device_id: string): Promise<SerialDevice | null> {
        return this.serialDeviceModel.findOne({ device_id }).exec();
    }

    async getBlockchainDeviceId(device_id: string): Promise<number> {
        const device = await this.findOne(device_id);
        if (!device) {
            throw new NotFoundException(`Device ${device_id} not found`);
        }
        return device.blockchain_device_id;
    }

    async update(device_id: string, updateData: UpdateSerialDeviceDto): Promise<SerialDevice | null> {
        const device = await this.serialDeviceModel.findOneAndUpdate(
            { device_id },
            updateData,
            { new: true, runValidators: true }
        ).exec();

        if (!device) {
            throw new NotFoundException(`Device with ID ${device_id} not found`);
        }

        return device;
    }

    async delete(device_id: string): Promise<any> {
        return this.serialDeviceModel.deleteOne({ device_id }).exec();
    }

    async ensureDeviceExists(device_id: string, deviceName?: string): Promise<SerialDevice> {
        let device = await this.findOne(device_id);

        if (!device) {
            const name = deviceName || `esp_${device_id.substring(0, 5)}`;
            const createDto: CreateSerialDeviceDto = {
                device_id,
                name: name.length < 8 ? `esp_${device_id}${'_'.repeat(8 - name.length)}` : name
            };

            device = await this.create(createDto);
            this.logger.log(`Auto-created device: ${device_id} with name: ${createDto.name}`);
        }

        return device;
    }
}