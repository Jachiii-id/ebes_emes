import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class GpsData extends Document {
    @Prop({ required: true })
    device_id: string;

    @Prop({ required: true })
    lat: string;

    @Prop({ required: true })
    lng: string;

    @Prop({ required: true })
    speed: string;

    @Prop({ required: true })
    sats: string;

    @Prop()
    blockchain_record_id?: number;

    @Prop({ default: false })
    blockchain_synced: boolean;

    @Prop()
    blockchain_synced_at?: Date;
}

export const GpsDataSchema = SchemaFactory.createForClass(GpsData);