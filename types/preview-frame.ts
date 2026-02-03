export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Date
    ? Date | undefined
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K] | undefined;
};

export type DraftConfigMessage<TDraft> = Readonly<{
  type: "DRAFT_CONFIG";
  payload: TDraft;
}>;


