import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { readFileSync } from 'fs';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Location')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('json')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async jsonReader(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'application/octet-stream' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.appService.findByJson(file.buffer.toString());

    res.setHeader('Content-Type', 'application/jsonl');
    res.setHeader('Content-Disposition', 'attachment; filename=output.jsonl');

    const newFile = readFileSync(result, 'utf-8');

    res.send(newFile);
  }

  @Post('csv')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async csvReader(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'text/csv' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.appService.findByCsv(file.buffer.toString());
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=output.csv');

    const newFile = readFileSync(result, 'utf-8');

    res.send(newFile);
  }
}
