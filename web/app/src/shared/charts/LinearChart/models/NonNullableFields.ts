export type NonNullableFields<Object extends object> = {
  [Key in keyof Object]: NonNullable<Object[Key]>;
};
