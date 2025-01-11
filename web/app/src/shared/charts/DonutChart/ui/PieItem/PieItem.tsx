import { animated, to, useTransition } from '@react-spring/web';
import { HtmlLabel, Connector, Annotation } from '@visx/annotation';
import { PieArcDatum, ProvidedProps } from '@visx/shape/lib/shapes/Pie';

import { DonutItem } from '../../../models/DonutItem';
import { fromLeaveTransition } from '../../utils/fromLeaveTransition';
import { getContrastColorText } from '../../utils/getContrastColorText';
import { enterUpdateTransition } from '../../utils/enterUpdateTransition';
import { getAnnotationPosition } from '../../utils/getAnnotationPosition';

interface AnimatedStyles {
  startAngle: number;
  endAngle: number;
  opacity: number;
}

export const PieItem = (
  props: ProvidedProps<DonutItem> & {
    unit?: string;
    textColor: string;
    disablePieTitle?: boolean;
    disableUnitTitle?: boolean;
  },
) => {
  const { arcs, path, unit, textColor, disablePieTitle, disableUnitTitle } = props;

  const transitions = useTransition<PieArcDatum<DonutItem>, AnimatedStyles>(arcs, {
    from: fromLeaveTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: fromLeaveTransition,
    keys: (v) => v.data.name ?? v.data.value,
  });

  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);

    const { startAngle, endAngle } = arc;

    const hasSpaceForLabel = endAngle - startAngle >= 0.6;

    const textContrastColor = getContrastColorText(arc.data.color);

    const { labelX, labelY, surfaceX, surfaceY } = getAnnotationPosition({
      arc,
      path: path,
      xMultiplier: 0.1,
      yMultiplier: 0.1,
    });

    return (
      <g key={key}>
        <animated.path
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={arc.data.color}
        />
        {!disablePieTitle &&
          (hasSpaceForLabel ? (
            <animated.g style={{ opacity: props.opacity }}>
              <text fill={textContrastColor} x={centroidX} y={centroidY} dy=".33em" fontSize={16} textAnchor="middle">
                {`${arc.data.value} ${!disableUnitTitle ? unit ?? '' : ''}`}
              </text>
            </animated.g>
          ) : (
            <Annotation x={surfaceX} y={surfaceY} dx={labelX} dy={labelY}>
              <Connector stroke={textColor} type="elbow" />
              <HtmlLabel
                showAnchorLine={false}
                containerStyle={{
                  textWrap: 'nowrap',
                  color: textColor,
                  fontSize: 12,
                }}
              >
                {`${arc.data.value} ${!disableUnitTitle ? unit ?? '' : ''}`}
              </HtmlLabel>
            </Annotation>
          ))}
      </g>
    );
  });
};
