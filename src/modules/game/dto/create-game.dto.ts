import { ApiProperty } from "@nestjs/swagger";

export class CreateGameDto {
  @ApiProperty({ example: "test", description: "名称", required: false })
  readonly name: string;
  @ApiProperty({ example: "", description: "作者", required: false })
  readonly author: object;
  @ApiProperty({ example: "", description: "类型", required: false })
  readonly type: string[];
  @ApiProperty({ example: "", description: "支持平台", required: false })
  readonly platform: string[];
  @ApiProperty({ example: "", description: "预计发行日期", required: false })
  readonly releaseDate: string;
  @ApiProperty({ example: "", description: "封面图片", required: false })
  readonly cover: string;
}
