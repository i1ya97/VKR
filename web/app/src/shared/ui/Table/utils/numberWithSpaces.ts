export const numberWithSpaces = (x: any) => {
    if (!x) return '';
    const value = +x;
    if (Number.isNaN(value)) return x;
    if (typeof value !== 'number') return x;
    return value?.toLocaleString('ru-RU', { maximumFractionDigits: 6 }).replace(',', '.');
  };