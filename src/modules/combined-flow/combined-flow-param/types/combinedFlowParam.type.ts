/**
 * @description 数据流转入参, 用于tagging中的strongMatch
 */
export type WorkflowInput = {
  id: string;
  paramId: string;
  usingPromptLabel?: string | null;
};

/**
 * @description 数据流转出参, 用于runTimeCache的存储
 */
export type WorkflowOutput = {
  id: string;
  paramId: string;
  originName: string;
  value: string[];
};
