import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AirData extends Document {
    @Prop({ required: true })
    device_id: string;

    @Prop({ required: true })
    ppm: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    ro: string;

    @Prop()
    blockchain_record_id?: number;

    @Prop({ default: false })
    blockchain_synced: boolean;

    @Prop()
    blockchain_synced_at?: Date;
}

export const AirDataSchema = SchemaFactory.createForClass(AirData);