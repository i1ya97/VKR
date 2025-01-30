import { ChartDataFiltered } from "../models/ChartDataFiltered";
import { ChartProps } from "../models/ChartProps";
import { SecondaryAxis } from "../models/SecondaryAxis";


export function createSecondaryAxisFabric(getLabel: ChartProps['secondaryAxisForEachDataLabel']) {
  return function (cd: ChartDataFiltered): SecondaryAxis {
    return {
      key: cd.key,
      name: cd.additionalName || cd.name,
      alias: cd.additionalAlias || cd.alias,
      dimension: cd.dimension ?? '',
      label: getLabel?.(cd) ?? cd.alias,
      oppositeSide: cd.oppositeSecondaryAxisSide,
    };
  };
}
