// Core Packages
import { Module } from "@nestjs/common";

// NPM Packages
import { MongooseModule } from "@nestjs/mongoose";

// Custom Packages
import { ConfigService } from "./config.service";
import { ConfigController } from "./config.controller";
import { ConfigSchema } from "./config.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Config", schema: ConfigSchema }]),
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
