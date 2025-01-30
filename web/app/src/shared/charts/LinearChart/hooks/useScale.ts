import { useCallback, useMemo } from 'react';
import { ContinuousDomain, scaleBand, scaleLinear } from '@visx/scale';
import { scaleBandPadding } from '../constants';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { ChartProps } from '../models/ChartProps';
import { Data } from '../models/Data';
import { Domains } from '../models/Domains';
import { min, max } from 'd3-array';
import { UseScaleOutput } from '../models/UseScaleOutput';

type UseScaleProps = Pick<
  ChartProps,
  | 'startFromZeroCoordinates'
  | 'nice'
  | 'reverseMainAxis'
  | 'reverseSecondaryAxis'
  | 'switchAxises'
  | 'mainAxisType'
  | 'width'
> & {
  data: Data[];
  xMax: number;
  yMax: number;
  maxValuesForEachLine: Domains | null;
  minValuesForEachLine: Domains | null;
  minValueForEntire: number | null;
  maxValueForEntire: number | null;
  dataToReverse: { [lineName: string]: boolean } | null;
};

export const useScale = (props: UseScaleProps): UseScaleOutput => {
  const {
    data,
    xMax,
    yMax,
    width,
    startFromZeroCoordinates,
    maxValuesForEachLine,
    minValuesForEachLine,
    maxValueForEntire,
    minValueForEntire,
    nice = true,
    reverseSecondaryAxis,
    reverseMainAxis,
    switchAxises,
    dataToReverse,
    mainAxisType,
  } = props;

  const xDomain = useMemo<ContinuousDomain | undefined>(() => {
    if (!data.length) return undefined;

    return [
      startFromZeroCoordinates && mainAxisType === 'numeric' ? 0 : min(data.map((d) => Number(d.key))) ?? 0,
      max(data.map((d) => Number(d.key))) ?? 1,
    ];
  }, [startFromZeroCoordinates, data]);

  const yDomain = useCallback<(lineName?: string) => ContinuousDomain | undefined>(
    (lineName?: string) => {
      if (
        (maxValuesForEachLine == null && maxValueForEntire == null) ||
        (minValueForEntire == null && minValuesForEachLine == null)
      ) {
        return undefined;
      }
      if (dataToReverse && lineName && dataToReverse[lineName]) {
        return [
          lineName ? maxValuesForEachLine![lineName] : (maxValueForEntire as number),
          lineName ? minValuesForEachLine![lineName] : (minValueForEntire as number),
        ];
      }
      return [
        lineName ? minValuesForEachLine![lineName] : (minValueForEntire as number),
        lineName ? maxValuesForEachLine![lineName] : (maxValueForEntire as number),
      ];
    },
    [dataToReverse, minValuesForEachLine, minValueForEntire, maxValuesForEachLine, maxValueForEntire],
  );

  const xRange = useMemo<[number, number]>(() => {
    if (switchAxises) {
      return reverseSecondaryAxis ? [xMax, 0] : [0, xMax];
    }
    return reverseMainAxis ? [xMax, 0] : [0, xMax];
  }, [reverseMainAxis, reverseSecondaryAxis, xMax, switchAxises]);

  const xRangeForWidth = useMemo<[number, number]>(() => {
    if (switchAxises) {
      return reverseSecondaryAxis ? [width, 0] : [0, width];
    }
    return reverseMainAxis ? [width, 0] : [0, width];
  }, [reverseMainAxis, reverseSecondaryAxis, width, switchAxises]);

  const yRange = useMemo<[number, number]>(() => {
    if (switchAxises) {
      return reverseMainAxis ? [0, yMax] : [yMax, 0];
    }
    return reverseSecondaryAxis ? [0, yMax] : [yMax, 0];
  }, [reverseMainAxis, reverseSecondaryAxis, yMax, switchAxises]);

  const xScaleBand = useMemo<ScaleBand<string> | null>(() => {
    if (!data.length) return null;

    return scaleBand<string>({
      domain: data.map((d) => d.key as string),
      range: xRange,
      padding: scaleBandPadding,
    });
  }, [data, xRange]);

  const xScaleLinear = useMemo<ScaleLinear<number, number, never> | null>(() => {
    if ((switchAxises && !yRange) || !xRange) return null;

    return scaleLinear<number>({
      domain: xDomain,
      range: switchAxises ? yRange : xRange,
      nice,
    });
  }, [nice, switchAxises, yRange, xRange, xDomain]);

  const xScaleLinearForWidth = useMemo<ScaleLinear<number, number, never> | null>(() => {
    if ((switchAxises && !yRange) || !xRangeForWidth) return null;

    return scaleLinear<number>({
      domain: xDomain,
      range: switchAxises ? yRange : xRangeForWidth,
      nice,
    });
  }, [nice, switchAxises, yRange, xRangeForWidth, xDomain]);

  const yScaleLinear = useMemo<((lineName?: string) => ScaleLinear<number, number, never>) | null>(() => {
    if ((switchAxises && !xRange) || !yRange) return null;

    /*
     * Максимальное значение для всех линий будет использоваться в любом случае,
     * как минимум для отображения оси Y.
     * В свою очередь, флаг accumulate влияет исключительно на то, как будет рассчитываться maxvalueForEntire, а не на то, будет ли.
     * */
    /**
     * При указанном ключа данные будут рассчитываться индивидуально для каждой линии.
     * При расчете общих скейлов (гриды, общие оси и тп.) с активным switchAxises ключ передавать не нужно.
     */
    return (lineName?: string) => {
      return scaleLinear<number>({
        domain: yDomain(lineName),
        range: switchAxises ? xRange : yRange,
        nice,
      });
    };
  }, [nice, switchAxises, yRange, xRange, yDomain]);

  return {
    xScaleBand,
    xScaleLinear,
    yScaleLinear,
    xScaleLinearForWidth,
  };
};
