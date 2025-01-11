import { useMemo } from 'react';
import Box from '@mui/material/Box';

import { DonutItem } from '../../../models/DonutItem';
import { root, groupe, row, colorDot } from './styles';

interface Props {
  donutItems: DonutItem[];
  textColor: string;
  unit?: string;
  disableValueLegend?: boolean;
  disablePercentagesLegend?: boolean;
  disableNameLegend?: boolean;
  disableColorLegend?: boolean;
}

export const Legend = (props: Props) => {
  const {
    donutItems,
    textColor,
    unit,
    disableValueLegend,
    disablePercentagesLegend,
    disableColorLegend,
    disableNameLegend,
  } = props;

  const summary = useMemo(() => donutItems.reduce((acc, item) => acc + item.value, 0), [donutItems]);

  return (
    <Box sx={root}>
      <Box sx={groupe}>
        {donutItems.map((item) => (
          <Box key={item.name} sx={row}>
            {!disableColorLegend && <Box sx={colorDot} style={{ background: item.color }} />}
            {!disableNameLegend && <span style={{ color: textColor }}>{item.name}</span>}
          </Box>
        ))}
      </Box>
      <Box sx={groupe}>
        {donutItems.map((item) => (
          <Box key={item.name} sx={row} style={{ justifyContent: 'space-between' }}>
            {!disableValueLegend && <span style={{ color: textColor }}>{item.value + (unit ? ` ${unit}` : '')}</span>}
            {!disablePercentagesLegend && (
              <span style={{ color: textColor }}>{`${((item.value / summary) * 100).toFixed(0)}%`}</span>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
