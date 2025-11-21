import { Controller, Get, Param, Query } from '@nestjs/common';
import { AirDataService } from '../services/air-data.service';
import { GpsDataService } from 'src/services/gps-data.service';

@Controller('data')
export class DataController {
    constructor(
        private readonly airDataService: AirDataService,
        private readonly gpsDataService: GpsDataService,
    ) { }

    @Get('air/:device_id')
    async getAirData(@Param('device_id') device_id: string) {
        return this.airDataService.findByDevice(device_id);
    }

    @Get('air')
    async getAllAirData() {
        return this.airDataService.all();
    }

    @Get('air/:device_id/latest')
    async getLatestAirData(@Param('device_id') device_id: string) {
        return this.airDataService.findLatestByDevice(device_id);
    }

    @Get('gps')
    async getAllGpsData() {
        return this.gpsDataService.all();
    }

    @Get('gps/:device_id')
    async getGpsData(@Param('device_id') device_id: string) {
        return this.gpsDataService.findByDevice(device_id);
    }

    @Get('gps/:device_id/latest')
    async getLatestGpsData(@Param('device_id') device_id: string) {
        return this.gpsDataService.findLatestByDevice(device_id);
    }

    @Get('gps/blockchain/device/:device_id')
    async getDeviceDataFromBlockchain(@Param('device_id') device_id: string) {
        return this.gpsDataService.getAllFromBlockchain(device_id);
    }

    @Get('gps/blockchain/all')
    async getAllFromBlockchain(
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 100
    ) {
        return this.gpsDataService.getAllFromBlockchainPaginated(offset, limit);
    }

    @Get('gps/blockchain/record/:recordId')
    async getRecordFromBlockchain(@Param('recordId') recordId: string) {
        return this.gpsDataService.getFromBlockchain(Number(recordId));
    }

    @Get('air/verify/:device_id')
    async verifyAllRecords(@Param('device_id') device_id: string) {
        return this.gpsDataService.verifyAllRecords(device_id);
    }

    @Get('air/blockchain/device/:device_id')
    async getAirDeviceDataFromBlockchain(@Param('device_id') device_id: string) {
        return this.airDataService.getAllFromBlockchain(device_id);
    }

    @Get('air/blockchain/all')
    async getAllAirFromBlockchain(
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 100
    ) {
        return this.airDataService.getAllFromBlockchainPaginated(offset, limit);
    }

    @Get('air/blockchain/record/:recordId')
    async getAirRecordFromBlockchain(@Param('recordId') recordId: string) {
        return this.airDataService.getFromBlockchain(Number(recordId));
    }

    @Get('air/verify/:device_id')
    async verifyAllAirRecords(@Param('device_id') device_id: string) {
        return this.airDataService.verifyAllRecords(device_id);
    }
}