import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { sanitize } from 'class-sanitizer';
import { plainToInstance } from 'class-transformer';

/**
 * Sanitization Pipe untuk sanitize input data
 * Menggunakan class-sanitizer untuk remove HTML tags, scripts, dll
 */
@Injectable()
export class SanitizePipe implements PipeTransform<any> {
  transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Transform plain object ke class instance
    const object = plainToInstance(metatype, value);

    // Sanitize object
    sanitize(object);

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

