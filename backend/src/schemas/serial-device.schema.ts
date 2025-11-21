import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SerialDevice extends Document {
    @Prop({ required: true, unique: true })
    device_id: string;

    @Prop({ required: true, unique: true })
    blockchain_device_id: number;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    company_id: number;
}

export const SerialDeviceSchema = SchemaFactory.createForClass(SerialDevice);