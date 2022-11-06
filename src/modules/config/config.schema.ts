import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

export type ConfigDocument = Config & Document;

@Schema({
  collection: "_config",
  versionKey: false,
  timestamps: { updatedAt: "updatedAt" },
})
export class Config extends Document {
  @Prop({ required: true })
  key: string;
  @Prop()
  value: mongoose.Schema.Types.Mixed;
  @Prop({ required: true, default: new Date() })
  createdAt: Date;
  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}
export const ConfigSchema = SchemaFactory.createForClass(Config);
