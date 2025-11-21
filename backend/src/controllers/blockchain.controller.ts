import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain.service';

@Controller('blockchain')
export class BlockchainController {
    constructor(private readonly blockchainService: BlockchainService) { }

    @Get('stats')
    async getStats() {
        return this.blockchainService.getContractStats();
    }

    @Get('gps/:id')
    async getGpsData(@Param('id', ParseIntPipe) id: number): Promise<any | null> {
        return this.blockchainService.getGpsData(id);
    }

    @Get('air/:id')
    async getAirData(@Param('id', ParseIntPipe) id: number): Promise<any | null> {
        return this.blockchainService.getAirData(id);
    }

    @Get('gps/device/:deviceId/latest')
    async getLatestGps(@Param('deviceId', ParseIntPipe) deviceId: number): Promise<any | null> {
        return this.blockchainService.getLatestGps(deviceId);
    }

    @Get('air/device/:deviceId/latest')
    async getLatestAir(@Param('deviceId', ParseIntPipe) deviceId: number): Promise<any | null> {
        return this.blockchainService.getLatestAir(deviceId);
    }
}