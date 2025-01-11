import { BarGroupBar } from '@visx/shape/lib/types';

import { BarInfo } from '../../../models/BarInfo';
import { indentToCenterText } from '../../constants/indentToCenterText';

interface Props {
  bar: BarGroupBar<string>;
  barsInfo: BarInfo;
  textColor: string;
  histogramType: 'cardinal' | 'relative';
  orientation: 'horizontal' | 'vertical';
  sum: number;
}

const Bar = (props: Props) => {
  const { bar, barsInfo, textColor, histogramType, sum, orientation } = props;

  return (
    <>
      <rect
        x={bar.x}
        y={bar.y}
        rx={4}
        width={bar.width}
        height={bar.height}
        fill={bar.color}
        mask={barsInfo?.[bar.key].type === 'hatch' ? 'url(#mask-stripe)' : ''}
      />
      <text
        x={orientation === 'vertical' ? bar.x + bar.width / 2 : bar.x + bar.width + indentToCenterText}
        y={orientation === 'vertical' ? bar.y - indentToCenterText : bar.y + bar.height / 2 + indentToCenterText}
        fill={textColor}
        fontSize={14}
        textAnchor={orientation === 'vertical' ? 'middle' : 'start'}
      >
        {histogramType === 'relative' ? `${bar.value.toFixed(0)} %` : bar.value.toFixed(0)}
      </text>
    </>
  );
};

export default Bar;
