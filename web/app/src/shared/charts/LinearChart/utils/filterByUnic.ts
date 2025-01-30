export const filterByUnique =
  <Obj extends object, UniqueKey extends keyof Obj>(uniqueKey: UniqueKey) =>
  (item: Obj, i: number, arr: Obj[]) => {
    return arr.findIndex((a) => a[uniqueKey] === item[uniqueKey]) === i;
  };
