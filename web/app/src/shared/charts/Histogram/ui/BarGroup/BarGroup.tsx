import { useMemo } from 'react';
import { Group } from '@visx/group';
import { scaleBand, scaleOrdinal } from '@visx/scale';
import { ScaleBand, ScaleLinear } from '@visx/vendor/d3-scale';
import { BarGroup as BarGroupVertical, BarGroupHorizontal } from '@visx/shape';

import Bar from '../Bar/Bar';
import { BarInfo } from '../../../models/BarInfo';
import { getGroupKey } from '../../utils/getGroupKey';
import { HistogramData } from '../../../models/HistogramData';

interface Props {
  data: HistogramData[];
  keys: string[];
  barsInfo: BarInfo;
  groupKeyScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number, never>;
  orientation: 'horizontal' | 'vertical';
  histogramType: 'cardinal' | 'relative';
  yMax: number;
  xMax: number;
  yAxisWidth: number;
  paddingBar: number;
  textColor: string;
}

const BarGroup = (props: Props) => {
  const {
    data,
    keys,
    barsInfo,
    groupKeyScale,
    yScale,
    orientation,
    histogramType,
    yMax,
    xMax,
    yAxisWidth,
    paddingBar,
    textColor,
  } = props;

  const colorScale = useMemo(
    () =>
      scaleOrdinal<string, string>({
        domain: Object.entries(barsInfo).map(([key]) => key),
        range: Object.entries(barsInfo).map(([, b]) => b.color),
      }),
    [barsInfo],
  );

  const indicatorsScale = useMemo(
    () =>
      scaleBand<string>({
        domain: keys,
        padding: paddingBar,
      }),
    [keys],
  );

  indicatorsScale?.rangeRound([0, groupKeyScale.bandwidth()]);

  return (
    <Group style={{ transform: `translateX(${yAxisWidth}px)` }}>
      {orientation === 'vertical' ? (
        <BarGroupVertical
          data={data}
          keys={keys}
          left={yAxisWidth}
          height={yMax - 1} // -1 чтобы не перекрывать оси
          x0={getGroupKey}
          x0Scale={groupKeyScale}
          x1Scale={indicatorsScale}
          yScale={yScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => {
              const bars = barGroup.bars.filter((b) => b.height > 0);
              const sum = bars.reduce((acc, curr) => acc + curr.value, 0);

              return (
                <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                  {bars.map((bar) => (
                    <Bar
                      key={`${barGroup.index}-${bar.index}-${bar.key}`}
                      bar={bar}
                      barsInfo={barsInfo}
                      histogramType={histogramType}
                      textColor={textColor}
                      orientation={orientation}
                      sum={sum}
                    />
                  ))}
                </Group>
              );
            })
          }
        </BarGroupVertical>
      ) : (
        <BarGroupHorizontal
          data={data}
          keys={keys}
          width={xMax}
          y0={getGroupKey}
          y0Scale={groupKeyScale}
          y1Scale={indicatorsScale}
          xScale={yScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => {
              const bars = barGroup.bars.filter((b) => b.height > 0);
              const sum = bars.reduce((acc, curr) => acc + curr.value, 0);

              return (
                <Group key={`bar-group-horizontal-${barGroup.index}-${barGroup.y0}`} top={barGroup.y0}>
                  {bars.map((bar) => (
                    <Bar
                      key={`${barGroup.index}-${bar.index}-${bar.key}`}
                      bar={bar}
                      barsInfo={barsInfo}
                      histogramType={histogramType}
                      textColor={textColor}
                      orientation={orientation}
                      sum={sum}
                    />
                  ))}
                </Group>
              );
            })
          }
        </BarGroupHorizontal>
      )}
    </Group>
  );
};

export default BarGroup;
