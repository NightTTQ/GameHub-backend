import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateConfigDto } from "./dto/create-config.dto";
import { UpdateConfigDto } from "./dto/update-config.dto";
import { configNames } from "./types/index";
import { ConfigDocument } from "./config.schema";

@Injectable()
export class ConfigService {
  constructor(
    @InjectModel("Config") private readonly configModel: Model<ConfigDocument>
  ) {}
  // create(createConfigDto: CreateConfigDto) {
  //   return "This action adds a new config";
  // }

  async get(name: configNames) {
    return (await this.configModel.findOne({ key: name }).exec())?.value;
  }

  async set(name: configNames, value: any) {
    return (
      await this.configModel
        .findOneAndUpdate({ key: name }, { value: value }, { new: true })
        .exec()
    ).value;
  }

  // update(id: number, updateConfigDto: UpdateConfigDto) {
  //   return `This action updates a #${id} config`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} config`;
  // }
}
