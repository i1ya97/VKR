import { useCallback, useEffect, useMemo, useState } from 'react';
import { AxisesWidth } from '../models/AxisesWidth';
import { ChartProps } from '../models/ChartProps';
import { Domains } from '../models/Domains';
import { CUSTOM_Y_AXIS_WIDTH, LETTER_WIDTH } from '../constants';
import { SecondaryAxis } from '../models/SecondaryAxis';
import { UseMarginOutput } from '../models/UseMarginOutput';
import { getMaxTickLenght } from '../utils/getMaxTickLenght';
import { marginLeftCombiner } from '../utils/marginLeftCombiner';
import { HorizontalMargins } from '../models/HorizontalMargins';

type Params = Pick<ChartProps, 'customSecondaryAxis' | 'chartId' | 'maxMarginsExternalDomId'> & {
  margin: NonNullable<ChartProps['margin']>;
  minValuesForEachLine: Domains | null;
  maxValuesForEachLine: Domains | null;
  keys: string[];
  secondaryAxises: SecondaryAxis[] | null;
};

export const useMargin = (params: Params): UseMarginOutput => {
  const {
    chartId,
    maxValuesForEachLine,
    minValuesForEachLine,
    keys,
    margin,
    customSecondaryAxis,
    secondaryAxises,
    maxMarginsExternalDomId,
  } = params;

  const getTickLenght = useCallback(
    (lineName: string) => {
      return getMaxTickLenght([minValuesForEachLine?.[lineName] ?? 0, maxValuesForEachLine?.[lineName] ?? 0]);
    },
    [minValuesForEachLine, maxValuesForEachLine],
  );

  const leftAxisesWidths = useMemo<AxisesWidth | null>(() => {
    const leftKeys = keys.filter((k) =>
      secondaryAxises
        ?.filter((sa) => !sa.oppositeSide)
        .map((sa) => sa.key)
        .includes(k),
    );
    if (!leftKeys.length || customSecondaryAxis) return null;

    const combineMargin = marginLeftCombiner(0);

    return leftKeys.reduce((collection, leftKey) => {
      const maxTickWidth = getTickLenght(leftKey);

      collection[leftKey] = {
        width: combineMargin(maxTickWidth),
        tickWidth: (maxTickWidth + 1) * LETTER_WIDTH,
      };

      return collection;
    }, {} as AxisesWidth);
  }, [keys, secondaryAxises, getTickLenght, customSecondaryAxis]);

  const marginLeftInternal = useMemo(() => {
    const axisesLength = secondaryAxises?.filter((sa) => !sa.oppositeSide).length;
    if (customSecondaryAxis && axisesLength) {
      return CUSTOM_Y_AXIS_WIDTH * (axisesLength - 1);
    }

    if (!leftAxisesWidths) return 0;

    return Object.values(leftAxisesWidths).pop()?.width ?? 0;
  }, [leftAxisesWidths, customSecondaryAxis, secondaryAxises?.length]);

  const rightAxisesWidths = useMemo<AxisesWidth | null>(() => {
    const rightKeys = keys.filter((k) =>
      secondaryAxises
        ?.filter((sa) => sa.oppositeSide)
        .map((sa) => sa.key)
        .includes(k),
    );
    if (!rightKeys.length || customSecondaryAxis) return null;

    const combineMargin = marginLeftCombiner(0);

    return rightKeys.reduce((collection, rightKey) => {
      const maxTickWidth = getTickLenght(rightKey);

      collection[rightKey] = {
        width: combineMargin(maxTickWidth),
        tickWidth: (maxTickWidth + 1) * LETTER_WIDTH,
      };

      return collection;
    }, {} as AxisesWidth);
  }, [keys, secondaryAxises, getTickLenght, customSecondaryAxis]);

  const marginRightInternal = useMemo(() => {
    const axisesLength = secondaryAxises?.filter((sa) => sa.oppositeSide).length;
    if (customSecondaryAxis && axisesLength) {
      return CUSTOM_Y_AXIS_WIDTH * (axisesLength - 1);
    }

    if (!rightAxisesWidths) return 0;

    return Object.values(rightAxisesWidths).pop()?.width ?? 0;
  }, [rightAxisesWidths, customSecondaryAxis, secondaryAxises?.length]);

  const [localMargin, setLocalMargin] = useState(margin);

  const marginLeftExternal = useMemo(() => localMargin.left, [localMargin]);

  const marginRightExternal = useMemo(() => localMargin.right, [localMargin]);

  useEffect(() => {
    if (maxMarginsExternalDomId && chartId) {
      const maxMarginsDom = document.getElementById(maxMarginsExternalDomId);
      if (maxMarginsDom) {
        let allMarginsValue: Record<string, HorizontalMargins> = {};
        const allMarginsValueStr = maxMarginsDom.getAttribute('data-all-margins');
        if (allMarginsValueStr?.startsWith('{')) {
          allMarginsValue = JSON.parse(allMarginsValueStr);
        }
        allMarginsValue[chartId] = {
          externalLeft: margin.left,
          externalRight: margin.right,
          internalLeft: marginLeftInternal,
          internalRight: marginRightInternal,
        };

        const maxMarginsValue: HorizontalMargins = {
          externalLeft: Math.max(...Object.values(allMarginsValue).map((value) => value.externalLeft), 0),
          externalRight: Math.max(...Object.values(allMarginsValue).map((value) => value.externalRight), 0),
          internalLeft: Math.max(...Object.values(allMarginsValue).map((value) => value.internalLeft), 0),
          internalRight: Math.max(...Object.values(allMarginsValue).map((value) => value.internalRight), 0),
        };

        maxMarginsDom.setAttribute('data-all-margins', JSON.stringify(allMarginsValue));
        maxMarginsDom.setAttribute('data-max-margins', JSON.stringify(maxMarginsValue));
      }
    }
  }, [marginLeftInternal, marginRightInternal, margin]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(({ target }) => {
        if (chartId) {
          let allMarginsValue: Record<string, HorizontalMargins> = {};
          const allMarginsValueStr = (target as HTMLDivElement).getAttribute('data-all-margins');
          if (allMarginsValueStr?.startsWith('{')) {
            allMarginsValue = JSON.parse(allMarginsValueStr);
          }
          const currentMargins = allMarginsValue[chartId];

          let maxMarginsValue: HorizontalMargins = {
            externalLeft: 0,
            externalRight: 0,
            internalLeft: 0,
            internalRight: 0,
          };
          const maxMarginsValueStr = (target as HTMLDivElement).getAttribute('data-max-margins');
          if (maxMarginsValueStr?.startsWith('{')) {
            maxMarginsValue = JSON.parse(maxMarginsValueStr);
          }

          setLocalMargin((prev) => ({
            ...prev,
            left:
              maxMarginsValue.externalLeft -
              currentMargins.externalLeft +
              (maxMarginsValue.internalLeft - currentMargins.internalLeft),
            right:
              maxMarginsValue.externalRight -
              currentMargins.externalRight +
              (maxMarginsValue.internalRight - currentMargins.internalRight),
          }));
        }
      });
    });

    if (maxMarginsExternalDomId) {
      const maxMarginsDom = document.getElementById(maxMarginsExternalDomId);
      if (maxMarginsDom) {
        observer.observe(maxMarginsDom, { attributes: true });
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [maxMarginsExternalDomId]);

  return {
    marginLeftExternal,
    marginLeftInternal,
    marginRightExternal,
    marginRightInternal,
    leftAxisesWidths,
    rightAxisesWidths,
  };
};
