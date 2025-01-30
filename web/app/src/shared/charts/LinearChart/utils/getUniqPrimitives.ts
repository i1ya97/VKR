export function getUniqPrimitives<ArrayItem extends object, Key extends keyof ArrayItem>(
  collection: ArrayItem[],
  key: Key,
) {
  return Array.from(
    new Set(collection.filter((object) => object[key]).map((object) => object[key] as NonNullable<ArrayItem[Key]>)),
  );
}
