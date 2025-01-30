export interface Product { id: string, name: string, color: string };
export interface Curve { key: string, name: string, color: string };

export interface ForecastChart {
  id: string,
  name: string,
  products: Product[],
  curves: Curve[]
}