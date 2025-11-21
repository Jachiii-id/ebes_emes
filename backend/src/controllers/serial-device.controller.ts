import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SerialDeviceService } from '../services/serial-device.service';
import { CreateSerialDeviceDto } from '../dto/create-serial-device.dto';
import { UpdateSerialDeviceDto } from 'src/dto/update-serial-device.dto';

@Controller('devices')
export class SerialDeviceController {
    constructor(private readonly serialDeviceService: SerialDeviceService) { }

    @Post()
    async create(@Body() createSerialDeviceDto: CreateSerialDeviceDto) {
        return this.serialDeviceService.create(createSerialDeviceDto);
    }

    @Get()
    async findAll() {
        return this.serialDeviceService.findAll();
    }

    @Get(':device_id')
    async findOne(@Param('device_id') device_id: string) {
        return this.serialDeviceService.findOne(device_id);
    }

    @Put(':device_id')
    async update(
        @Param('device_id') device_id: string,
        @Body() updateData: UpdateSerialDeviceDto,
    ) {
        return this.serialDeviceService.update(device_id, updateData);
    }

    @Delete(':device_id')
    async delete(@Param('device_id') device_id: string) {
        return this.serialDeviceService.delete(device_id);
    }
}