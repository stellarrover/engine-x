import { Injectable, Logger } from '@nestjs/common';
import { AIRequestInfo } from './models/ai-scheduler.model';
import { isUndefined } from 'lodash';

@Injectable()
export class AiSchedulerService {
  constructor(private logger: Logger) {}

  async aiRequest<T>(
    info: AIRequestInfo<T>,
    remainingRetriesNum?: number,
  ): Promise<T> {
    if (isUndefined(remainingRetriesNum)) remainingRetriesNum = 1;

    if (remainingRetriesNum <= 0) throw new Error();

    const startAt = Date.now();
    try {
      const aiResponse = await fetch(info.url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...info.body,
        }),
      });

      return info.transformer(await aiResponse.json());
    } catch (e) {
      this.logger.error(e);

      if (remainingRetriesNum > 0 && Date.now() - startAt <= 10 * 1000) {
        return await this.aiRequest(info, remainingRetriesNum--);
      } else throw new Error();
    }
  }
}
