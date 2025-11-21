import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { AirDataService } from '../services/air-data.service';
import { SerialDeviceService } from '../services/serial-device.service';
import { CreateAirDataDto } from '../dto/create-air-data.dto';
import { CreateGpsDataDto } from '../dto/create-gps-data.dto';
import { CreateSerialDeviceDto } from '../dto/create-serial-device.dto';
import { GpsDataService } from 'src/services/gps-data.service';

@Injectable()
export class MqttService implements OnModuleInit {
    private client: MqttClient;

    constructor(
        private readonly airDataService: AirDataService,
        private readonly gpsDataService: GpsDataService,
        private readonly serialDeviceService: SerialDeviceService,
    ) { }

    onModuleInit() {
        this.connect();
    }

    private connect() {
        const mqttUrl = process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org:1883';
        this.client = connect(mqttUrl);

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');

            this.client.subscribe('device/air-data');
            this.client.subscribe('device/gps-data');
        });

        this.client.on('message', (topic, message) => {
            this.handleMessage(topic, message.toString());
        });

        this.client.on('error', (error) => {
            console.error('MQTT error:', error);
        });
    }

    private handleMessage(topic: string, message: string) {
        try {
            const data = JSON.parse(message);

            switch (topic) {
                case 'device/air-data':
                    this.handleAirData(data);
                    break;
                case 'device/gps-data':
                    this.handleGpsData(data);
                    break;
                default:
                    console.log('Unknown topic:', topic);
            }
        } catch (error) {
            console.error('Error parsing MQTT message:', error);
        }
    }

    private async handleAirData(data: any) {
        // First, ensure device exists
        await this.ensureDeviceExists(data.device_id);

        const airDataDto: CreateAirDataDto = {
            device_id: data.device_id,
            ppm: data.ppm,
            status: data.status,
            ro: data.ro,
        };

        try {
            await this.airDataService.create(airDataDto);
            console.log('Air data saved successfully for device:', data.device_id);
        } catch (error) {
            console.error('Error saving air data:', error);
        }
    }

    private async handleGpsData(data: any) {
        // First, ensure device exists
        await this.ensureDeviceExists(data.device_id);

        const gpsDataDto: CreateGpsDataDto = {
            device_id: data.device_id,
            lat: data.lat,
            lng: data.lng,
            speed: data.speed,
            sats: data.sats,
        };

        try {
            await this.gpsDataService.create(gpsDataDto);
            console.log('GPS data saved successfully for device:', data.device_id);
        } catch (error) {
            console.error('Error saving GPS data:', error);
        }
    }

    private async ensureDeviceExists(device_id: string): Promise<void> {
        try {
            // Check if device already exists
            const existingDevice = await this.serialDeviceService.findOne(device_id);

            if (!existingDevice) {
                // Generate device name using first 5 characters of device_id
                const deviceName = this.generateDeviceName(device_id);

                const deviceDto: CreateSerialDeviceDto = {
                    device_id: device_id,
                    name: deviceName,
                };

                await this.serialDeviceService.create(deviceDto);
                console.log(`Auto-created new device: ${device_id} with name: ${deviceName}`);
            }
        } catch (error) {
            console.error('Error ensuring device exists:', error);
        }
    }

    private generateDeviceName(device_id: string): string {
        // Take first 5 characters of device_id, pad if necessary
        const baseName = device_id.substring(0, 5);

        // If device_id is shorter than 5 characters, pad with underscores
        if (baseName.length < 5) {
            return `esp_${baseName}${'_'.repeat(5 - baseName.length)}`;
        }

        return `esp_${baseName}`;
    }

    public calibrateSensor(deviceId: string): void {
        const topic = `sensors/calibrate/${deviceId}`;
        const message = 'CALIBRATE';

        this.client.publish(topic, message, (error) => {
            if (error) {
                console.error(`Failed to send calibration command to ${deviceId}:`, error);
            } else {
                console.log(`✅ Calibration command sent to ${deviceId} on topic: ${topic}`);
            }
        });
    }

    public publish(topic: string, message: string): void {
        this.client.publish(topic, message);
    }
}