export const sort = (a: string, b: string, order: 'ASC' | 'DESK' | null) => {
  return order === 'ASC'
    ? a?.toLocaleLowerCase()?.localeCompare(b?.toLocaleLowerCase())
    : b?.toLocaleLowerCase()?.localeCompare(a?.toLocaleLowerCase());
};

export const conditions = [
  { value: 'more', name: 'Больше' },
  { value: 'less', name: 'Меньше' },
  { value: 'equal', name: 'Равно' },
  { value: 'fromTo', name: 'От — до' },
];

export interface FilterOption {
  options?: string[];
  numberOption?: { condition: string; max: string; min: string };
}

export const filteringRowsByRules = (
  rows: Record<string, string>[],
  options: Record<string, FilterOption>,
  getValue: (row: Record<string, string>, key: string, noDisplay?: boolean) => { value: string; color?: string },
) => {
  let currentRows = [...rows];
  Object.entries(options).forEach(([key, values]) => {
    if (values.options?.length) {
      currentRows = currentRows.filter((r) => !values?.options?.includes(r?.[key]));
    } else if (values.numberOption) {
      if (values.numberOption.condition === '') {
        const min = +values.numberOption.min;
        const max = +values.numberOption.max;
        if (min) currentRows = currentRows.filter((r) => +getValue(r, key, true).value > min);
        if (max) currentRows = currentRows.filter((r) => +getValue(r, key, true).value < max);
      } else if (values.numberOption?.min) {
        const min = +values.numberOption.min;
        if (values.numberOption.condition === 'more') {
          currentRows = currentRows.filter((r) => +getValue(r, key).value > min);
        } else if (values.numberOption.condition === 'less') {
          currentRows = currentRows.filter((r) => +getValue(r, key).value < min);
        } else if (values.numberOption.condition === 'equal') {
          currentRows = currentRows.filter((r) => +getValue(r, key).value === min);
        } else if (values.numberOption.condition === 'fromTo' && values.numberOption?.max) {
          const min = +values.numberOption.min;
          const max = +values.numberOption.max;
          currentRows = currentRows.filter((r) => +getValue(r, key).value > min && +getValue(r, key).value < max);
        }
      }
    }
  });
  return currentRows;
};
