import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import _ from 'lodash';

@Scalar('STEP')
export class StepScalar implements CustomScalar<string, any> {
  description = 'STEP custom scalar type';

  parseValue(value: string): any {
    this.validateFormat(value);

    return JSON.parse(value);
  }

  serialize(value: any): string {
    return JSON.stringify(value);
  }

  parseLiteral(ast: ValueNode): any {
    if (ast.kind !== Kind.STRING) {
      throw new Error(`Invalid STEP format: ${ast.kind}`);
    }

    this.validateFormat(ast.value);

    return JSON.parse(ast.value);
  }

  private validateFormat(input: any): void {
    if (_.isNil(input) || input.constructor !== Object) {
      throw new Error(`Invalid STEP format: ${input}`);
    }
  }
}
