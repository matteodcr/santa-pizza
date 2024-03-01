import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'exclusiveFields', async: false })
export class ExclusiveFieldsValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [field1, field2] = args.constraints;
    const hasField1 = value && value[field1];
    const hasField2 = value && value[field2];
    return (hasField1 && !hasField2) || (!hasField1 && hasField2);
  }

  defaultMessage(args: ValidationArguments) {
    const [field1, field2] = args.constraints;
    return `${field1} or ${field2} must be present, but not both.`;
  }
}

export function ExclusiveFields(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'exclusiveFields',
      target: object.constructor,
      propertyName: propertyName,
      constraints: fields,
      options: validationOptions,
      validator: ExclusiveFieldsValidator,
    });
  };
}
