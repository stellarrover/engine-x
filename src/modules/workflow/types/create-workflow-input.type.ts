import { User, Workflow } from '@prisma/client';
import { OmitType } from 'src/common/types/omit.type';
import { XMuLinList } from '../models/workflow-mulinlist.model';

export type CreateWorkflowInput = Omit<Workflow, OmitType> & {
  title: string;
  description: string;

  // 以下为关联字段
  user: User; // TODO - 上下文中获取
  muLinList?: XMuLinList;
  aliases?: string[];
};
