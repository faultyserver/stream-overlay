export const ActionTypes = {};

export type Action = { type: "@@INIT" };

export type ActionFor<T extends keyof typeof ActionTypes> = Extract<
  Action,
  {
    type: T;
  }
>;
