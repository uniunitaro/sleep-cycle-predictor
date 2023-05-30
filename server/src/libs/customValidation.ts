import {
  ValidateBy,
  ValidationOptions,
  buildMessage,
  ValidationArguments,
} from 'class-validator'

export const IsAfter = (
  property: string,
  options?: ValidationOptions,
): PropertyDecorator =>
  ValidateBy(
    {
      name: 'IsAfter',
      constraints: [property],
      validator: {
        validate: (value: string, args: ValidationArguments): boolean => {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ] as string

          const isDate = (v: string) => !isNaN(new Date(v).getTime())

          if (!isDate(value) || !isDate(relatedValue)) {
            return false
          }

          return (
            new Date(value).toISOString() > new Date(relatedValue).toISOString()
          )
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            each + '$property must be after $constraint1',
          options,
        ),
      },
    },
    options,
  )
