import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

export type GameDocument = Game & Document;

@Schema({
  collection: "game",
  versionKey: false,
  timestamps: { updatedAt: "updatedAt" },
})
export class Game extends Document {
  @Prop({ required: true })
  name: string;
  @Prop()
  platform: string[];
  @Prop({ required: true })
  id: number;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  author: mongoose.Schema.Types.Mixed;
  @Prop()
  cover: string;
  @Prop()
  description: string;
  @Prop()
  files: mongoose.Schema.Types.Array;
  @Prop()
  links: mongoose.Schema.Types.Array;
  @Prop()
  images: mongoose.Schema.Types.Array;
  @Prop()
  about: string;
  @Prop({ required: true })
  user: string;
  @Prop()
  editor: mongoose.Schema.Types.Array;
  @Prop()
  releaseDate: Date;
  @Prop()
  videos: mongoose.Schema.Types.Array;
  @Prop({ required: true, default: false })
  visible: boolean;
  @Prop({ required: true, default: new Date() })
  createdAt: Date;
  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}
export const GameSchema = SchemaFactory.createForClass(Game);
