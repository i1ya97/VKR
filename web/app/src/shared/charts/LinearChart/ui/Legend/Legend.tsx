import { Box, Typography } from '@mui/material';

import { Pick } from '@react-spring/web';
import { LegendItem } from './ui/LegendItem';
import { legendItem } from './styles';
import { CheckedLegend } from '../../models/CheckedLegend';
import { ChartProps } from '../../models/ChartProps';
import { Range } from '../../models/Range';
import { LegendContainer, Scroll } from '../../styles';

type LegendProps = Pick<
  ChartProps,
  'additionalLines' | 'legendHeight'
> & {
  legendState: CheckedLegend[];
  range?: Range;
  legendItemColor?: string;
};

const Legend = (props: LegendProps) => {
  const {
    legendHeight,
    legendState,
    additionalLines,
    range,
    legendItemColor,
  } = props;

  const color = (cd: CheckedLegend): string => (cd.color || cd.styleSettings?.stroke) as string;

  return (
    <Scroll style={{ height: legendHeight}}>
      <LegendContainer>
        {range && (
          <Box sx={legendItem}>
            <svg width={24} height={24}>
              <line x1={0} y1={12} x2={24} y2={12} stroke={range.color} strokeWidth={2} />
            </svg>
            <Typography fontSize={12}>{range.alias}</Typography>
          </Box>
        )}
        {additionalLines?.map((al) => (
          <Box sx={legendItem} key={`additionalLine-${al.name}`}>
            <svg width={24} height={24}>
              <line x1={0} y1={12} x2={24} y2={12} stroke={al.color} strokeWidth={2} strokeDasharray={'4'} />
            </svg>
            <Typography fontSize={12}>{al.alias}</Typography>
          </Box>
        ))}
        {legendState.map((cd) => {
          return <LegendItem key={cd.key} legendData={cd} color={legendItemColor ?? color(cd)} />;
        })}
      </LegendContainer>
    </Scroll>
  );
};

export default Legend;
