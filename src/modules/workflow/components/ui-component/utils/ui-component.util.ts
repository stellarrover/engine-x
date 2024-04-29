import { ActionRuleSetting, Step } from '@imean/model';
import { ComponentParam } from '@prisma/client';
import { nanoid } from 'nanoid';
import { ComponentParamType } from '../../component-param.model';

export const UiComponentUtil = {
  /**
   * 提取步骤参数
   * @param steps
   * @param workflowId
   * @returns
   */
  extractParamsForSteps(steps: Step[], componentId: string): ComponentParam[] {
    const params: ComponentParam[] = [];

    // 涉及类型: 识别信息(Prompt)、缓存信息(Cache)
    steps.forEach((step) => {
      // 缓存信息(Cache)
      if (step.type === 'cache' && step.actionRuleSetting?.cache?.fieldName) {
        params.push({
          id: nanoid(),
          name: step.actionRuleSetting?.cache?.fieldName,
          type: ComponentParamType.CACHE,
          componentId,
          metadata: { stepId: step.id },
        });
      }

      // 识别信息(Prompt)
      if (step.matchRule && step.matchRuleSetting) {
        const matchTag = (step.matchRuleSetting[step.matchRule] as any)
          ?.matchTag;

        matchTag &&
          params.push({
            id: nanoid(),
            name: matchTag,
            type: ComponentParamType.PROMPT,
            componentId,
            metadata: { stepId: step.id },
          });
      }
      if (step.type && step.actionRuleSetting) {
        const matchTag = (
          (step.actionRuleSetting as any)[
            step.type as ActionRuleSetting['name']
          ] as any
        )?.matchTag;

        matchTag &&
          params.push({
            id: nanoid(),
            name: matchTag,
            type: ComponentParamType.PROMPT,
            componentId,
            metadata: { stepId: step.id },
          });
      }
    });

    return params;
  },

  diffParams(originParams: ComponentParam[], newParams: ComponentParam[]) {
    const paramsNeededCreate: ComponentParam[] = [];
    const paramsNeededUpdate: ComponentParam[] = [];
    const paramsNeededDelete = new Set(originParams);

    newParams.forEach((newParam) => {
      const oldParam = originParams.find(
        (param) =>
          param.metadata['stepId'] === newParam.metadata['stepId'] &&
          param.type === newParam.type,
      );
      if (!oldParam) {
        paramsNeededCreate.push(newParam);
      } else {
        paramsNeededUpdate.push({ ...newParam, id: oldParam.id });
      }
      oldParam && paramsNeededDelete.delete(oldParam);
    });

    return {
      toCreate: paramsNeededCreate,
      toUpdate: paramsNeededUpdate,
      toDelete: [...paramsNeededDelete],
    };
  },
};
