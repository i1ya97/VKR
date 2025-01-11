import { useMemo } from 'react';
import { Group } from '@visx/group';
import { Box } from '@mui/material';
import Pie from '@visx/shape/lib/shapes/Pie';
import { ParentSize } from '@visx/responsive';

import { Legend } from './ui/Legend/Legend';
import { PieItem } from './ui/PieItem/PieItem';
import { SummaryInfo } from './ui/SummaryInfo/SummaryInfo';

import { root } from './styles';
import { DonutChartProps } from '../models/DonutChartProps';
import { DonutItem } from '../models/DonutItem';
import { sortingDirection } from './utils/sortingDirection';
import { defaultPadding, defaultTextColor } from './constants';

export const DonutChart = (props: DonutChartProps) => {
  const {
    donutItems,
    textColor = defaultTextColor,
    title,
    subTitle,
    unit,
    disableLegend,
    disableColorLegend,
    disableUnitTitle,
    disableNameLegend,
    disableValueLegend,
    disablePercentagesLegend,
    disablePieTitle,
    useSorting,
    padding = defaultPadding,
  } = props;

  if (!donutItems) return null;

  const legendDonutItems = useMemo(() => donutItems?.sort((a, b) => sortingDirection(a, b, useSorting)), [donutItems]);
  const chartDonutItems = useMemo(() => donutItems?.filter((item) => item.value) ?? [], [donutItems]);

  return (
    <ParentSize>
      {({ width, height }) => {
        const radius = Math.min(width / 2, height / 2);

        const donutWidth = radius / 2;

        return (
          <Box
            sx={root}
            style={{
              gridTemplateColumns: width > height ? 'auto max-content' : 'auto',
              gridTemplateRows: width < height ? 'auto max-content' : 'auto',
            }}
          >
            {!!chartDonutItems.length && (
              <svg width={radius * 2} height={radius * 2} style={{ overflow: 'visible' }}>
                <Group top={radius} left={radius}>
                  <Pie
                    data={chartDonutItems}
                    pieValue={(d: DonutItem) => d.value}
                    outerRadius={radius - padding}
                    innerRadius={radius - donutWidth - padding}
                    padAngle={0.005}
                    pieSort={(a, b) => sortingDirection(a, b, useSorting)}
                  >
                    {(pie) => (
                      <PieItem
                        {...pie}
                        unit={unit}
                        textColor={textColor}
                        disablePieTitle={disablePieTitle}
                        disableUnitTitle={disableUnitTitle}
                      />
                    )}
                  </Pie>
                </Group>
                <SummaryInfo textColor={textColor} title={title} subTitle={subTitle} radius={radius} />
              </svg>
            )}
            {!disableLegend && !!legendDonutItems.length && (
              <Legend
                donutItems={legendDonutItems}
                unit={unit}
                textColor={textColor}
                disablePercentagesLegend={disablePercentagesLegend}
                disableValueLegend={disableValueLegend}
                disableColorLegend={disableColorLegend}
                disableNameLegend={disableNameLegend}
              />
            )}
          </Box>
        );
      }}
    </ParentSize>
  );
};
