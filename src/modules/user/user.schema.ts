import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({
  collection: "_user",
  versionKey: false,
  timestamps: { updatedAt: "updatedAt" },
})
export class User extends Document {
  @Prop({ required: true })
  username: string;
  @Prop()
  password: string;
  @Prop({ default: "" })
  avatar: string;
  @Prop({ required: true, default: new Date() })
  createdAt: Date;
  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
