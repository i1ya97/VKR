import { Box, Typography } from '@mui/material';
import { legendItem } from '../../styles';
import { CheckedLegend } from '../../../../models/CheckedLegend';

type Props = {
  legendData: CheckedLegend;
  color: string;
};

export const LegendItem = (props: Props) => {
  const { legendData, color } = props;

  return (
    <Box sx={legendItem} key={`${legendData.name}${legendData.additionalName}`}>
      <svg width={24} height={24}>
        {legendData.dotsType && legendData.dotsType !== 'hide' && (
          <>
            {legendData.styleSettings?.markerCustomProps ? (
              <polygon
                transform={
                  `translate(${12 - (legendData.styleSettings.strokeWidth ?? 1) / 2}, ${
                    12 - (legendData.styleSettings.strokeWidth ?? 1) / 2
                  })` + ` scale(${legendData.styleSettings.strokeWidth})`
                }
                {...legendData.styleSettings.markerCustomProps}
                fill={color}
              />
            ) : (
              <circle r={legendData.styleSettings?.strokeWidth ?? 6} cx={12} cy={12} fill={color} />
            )}
          </>
        )}
        {(!legendData.dotsType || legendData.dotsType !== 'only') && (
          <line
            x1={0}
            y1={12}
            x2={24}
            y2={12}
            stroke={color}
            strokeWidth={legendData.styleSettings?.strokeWidth ?? 2}
            strokeDasharray={legendData.dasharray || legendData.styleSettings?.strokeDasharray}
          />
        )}
      </svg>
      <Typography fontSize={12}>
        {legendData.alias}
        {legendData.dimension && `, ${legendData.dimension}`}
      </Typography>
    </Box>
  );
};
