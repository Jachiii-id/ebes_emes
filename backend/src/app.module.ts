import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SerialDeviceController } from './controllers/serial-device.controller';
import { DataController } from './controllers/data.controller';

import { SerialDeviceService } from './services/serial-device.service';
import { AirDataService } from './services/air-data.service';
import { MqttService } from './mqtt/mqtt.service';

import { SerialDevice, SerialDeviceSchema } from './schemas/serial-device.schema';
import { AirData, AirDataSchema } from './schemas/air-data.schema';
import { GpsData, GpsDataSchema } from './schemas/gps-data.schema';
import { CalibrationController } from './controllers/calibration.controller';
import { BlockchainService } from './services/blockchain.service';
import { GpsDataService } from './services/gps-data.service';
import { BlockchainController } from './controllers/blockchain.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config available globally
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/emes-ebes'), // Added fallback
    MongooseModule.forFeature([
      { name: SerialDevice.name, schema: SerialDeviceSchema },
      { name: AirData.name, schema: AirDataSchema },
      { name: GpsData.name, schema: GpsDataSchema },
    ]),
  ],
  controllers: [SerialDeviceController, DataController, CalibrationController, BlockchainController],
  providers: [SerialDeviceService, AirDataService, GpsDataService, MqttService, BlockchainService],
})
export class AppModule {}