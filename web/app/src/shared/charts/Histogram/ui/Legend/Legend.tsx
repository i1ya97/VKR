import Box from '@mui/material/Box';

import { root, row } from './styles';
import { BarInfo } from '../../../models/BarInfo';

interface Props {
  barsInfo: BarInfo;
  keys: string[];
  textColor: string;
  background?: string;
}

const Legend = (props: Props) => {
  const { barsInfo, keys, textColor, background = '#0000001F' } = props;

  const isUseHatch = Object.entries(barsInfo).some(([, info]) => info.type === 'hatch');

  return (
    <Box sx={{ ...root, background: background }}>
      {keys.length > 0 &&
        keys.map((item) => {
          const barInfo = barsInfo[item];

          return (
            <Box key={item} sx={row}>
              <svg height={8} width={isUseHatch ? 24 : 8}>
                <rect
                  x={0}
                  y={0}
                  width={isUseHatch ? 24 : 8}
                  height={8}
                  rx={4}
                  fill={barInfo?.color}
                  mask={barInfo.type === 'hatch' ? 'url(#mask-stripe)' : ''}
                />
              </svg>
              <span style={{ color: textColor, fontSize: '12px' }}>{barInfo?.alias}</span>
            </Box>
          );
        })}
    </Box>
  );
};

export default Legend;
