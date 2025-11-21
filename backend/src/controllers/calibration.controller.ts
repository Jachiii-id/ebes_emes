import { Controller, Post, Param, Logger } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';

@Controller('calibrate')
export class CalibrationController {
    private readonly logger = new Logger(CalibrationController.name);

    constructor(private readonly mqttService: MqttService) { }

    @Post(':deviceId')
    async calibrateSensor(@Param('deviceId') deviceId: string) {
        try {
            this.mqttService.calibrateSensor(deviceId);

            return {
                success: true,
                message: `Calibration command sent to device ${deviceId}`,
                topic: `sensors/calibrate/${deviceId}`,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            this.logger.error(`Failed to send calibration to ${deviceId}:`, error);
            return {
                success: false,
                message: `Failed to send calibration command: ${error.message}`,
            };
        }
    }
}