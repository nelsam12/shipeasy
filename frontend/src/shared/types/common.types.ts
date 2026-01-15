export type Nullable<T> = T | null;

export interface SelectOption {
  label: string;
  value: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
