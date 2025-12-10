import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class QueryConditionsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value;

    const reservedKeys = ['page', 'limit', 'orderBy', 'sortOrder'];
    const conditions = {};

    Object.keys(value).forEach((key) => {
      if (!reservedKeys.includes(key)) {
        conditions[key] = value[key];
        delete value[key];
      }
    });

    value.conditions = conditions;

    return value;
  }
}
