export interface TableColumn {
  id: string;
  label: string;
  width?: number;
  align?: string;
  options?: { name: string; key: string }[];
  type?: 'percent' | 'number' | 'string' | 'date' | 'formula' | 'boolean';
  children?: TableColumn[];
  formula?: string;
  min?: number;
  max?: number;
}

export interface TableRow {
  [key: string]: string;
}

export interface SelectAnchor {
  anchor: HTMLElement;
  column: TableColumn;
}
