export const getContrastColorText = (bgColor: string) => {
  const rgb = parseInt(bgColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000de' : '#FFFFFFde';
};
