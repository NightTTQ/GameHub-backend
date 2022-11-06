import { Controller } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}
}
