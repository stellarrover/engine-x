const OmitArr = [
  'id',
  'createdAt',
  'updatedAt',
  'deleted',
  'deletedAt',
  'creatorId',
  'lastEditorId',
  'version',
] as const;
export type OmitType = (typeof OmitArr)[number];
