import dayjs, { ManipulateType } from 'dayjs';


export const createNormalizedInterval = (
  minDate: dayjs.Dayjs,
  maxDate: dayjs.Dayjs,
  timeSiries: { key: string; value: number }[],
  type: ManipulateType,
  defaultValue?: number,
) => {
  const values: { key: string; value: number | null }[] = [];
  const start = minDate;
  const end = maxDate;

  if (timeSiries.length || defaultValue) {
    const obj = timeSiries.reduce(
      (acc, item) => {
        acc[item.key] = item.value;
        return acc;
      },
      {} as { [key: string | number]: number | null },
    );

    for (let i = start; i.isBefore(end.add(1, 'd')); i = i.add(1, type)) {
      const value = obj[i.utc().format('YYYY-MM-DDTHH:mm:ss[Z]')] ?? null;
      values.push({
        key: i.utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        value: value,
      });
    }
  }
  return values;
};
