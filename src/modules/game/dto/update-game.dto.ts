import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { CreateGameDto } from "./create-game.dto";

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @ApiProperty({ example: "1", description: "游戏id", required: true })
  readonly id: string;
  // 1 Basic Info
  @ApiProperty({ example: "test", description: "名称", required: false })
  readonly name: string;
  @ApiProperty({ example: "", description: "作者", required: false })
  readonly author: object;
  // 2 Additional Info
  @ApiProperty({ example: "", description: "类型", required: false })
  readonly type: string[];
  @ApiProperty({ example: "", description: "支持平台", required: false })
  readonly platform: string[];
  @ApiProperty({ example: "", description: "预计发行日期", required: false })
  readonly releaseDate: string;
  // 3 Game Intro
  @ApiProperty({ example: "", description: "简介", required: false })
  readonly description: string;
  @ApiProperty({ example: "", description: "详情介绍", required: false })
  readonly about: string;
  // 4 Game Intro Images
  @ApiProperty({ example: "", description: "封面图片", required: false })
  readonly cover: string;
  // 5 Videos
  @ApiProperty({ example: "", description: "介绍视频", required: false })
  readonly videos: object[];
  // 6 Gallery
  @ApiProperty({ example: "", description: "介绍图片", required: false })
  readonly gallery: object[];
  // 7 Downloads
  @ApiProperty({ example: "", description: "下载链接", required: false })
  readonly links: object[];
  // 8 Additional Settings
  @ApiProperty({ example: "", description: "是否公开", required: false })
  readonly visible: string;
}
