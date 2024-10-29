export const SortDirection = {
  Asc: 'asc',
  Desc: 'desc'
} as const;

export type SortDirectionDto = typeof SortDirection[keyof typeof SortDirection];
