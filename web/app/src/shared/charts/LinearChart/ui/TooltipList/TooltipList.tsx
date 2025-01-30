import { Bar } from '@visx/shape';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { MouseEvent, TouchEvent, useEffect } from 'react';
import { localPoint } from '@visx/event';
import { TOOLTIP_BACKGROUND } from '../../constants';
import { ChartDataFiltered } from '../../models/ChartDataFiltered';
import { ChartProps } from '../../models/ChartProps';
import { ChartType } from '../../models/ChartType';
import { Data } from '../../models/Data';
import { GraphsStyles } from '../../models/GraphsStyles';
import { UseChartDataOutput } from '../../models/UseChartDataOutput';
import { UseScaleOutput } from '../../models/UseScaleOutput';
import { findNearestData } from '../../utils/findNearestData';
import { getClosestPoint } from '../../utils/getClosestPoint';
import { Param } from './models/Params';
import { LINES_LIST_S, LIST_S } from './styles';
import { formatDate } from '../../utils/formatDate';
import { isValidNumber } from '../../utils/isValidNumber';
import { TooltipLine } from './TooltipLine/TooltipLine';
import { TooltipLineI } from '../../models/TooltipLine';
import { PointXY } from '../../models/PointXY';
import { ToolipPoint } from '../../models/TooltipPoint';
import { NonNullableFields } from '../../models/NonNullableFields';

const TOOLTIP_MARGIN = 12;

type Props = Pick<ChartProps, 'switchAxises' | 'accumulate' | 'switchAxises' | 'mainAxisType'> &
  NonNullableFields<UseScaleOutput> &
  Pick<UseChartDataOutput, 'data'> & {
    chartData: ChartDataFiltered[];
    marginLeft: number;
    marginTop: number;
    xMax: number;
    yMax: number;
    keys: string[];
    chartType: ChartType;
    // TODO при появлении дополнительных стилей вынести в отдельную структуру.
    // Например, tooltipStyles
    tooltipBackground?: string;
    graphStyles: GraphsStyles;
    chartId?: string;
    tooltipPointExternalDomId?: string;
  };

type UseTooltip = {
  key?: string | number;
  params: Param[];
  tooltipLine: TooltipLineI;
};

export const TooltipList = (props: Props) => {
  const {
    yMax,
    xMax,
    marginTop,
    marginLeft,
    keys,
    chartData,
    chartType,
    xScaleLinear,
    yScaleLinear,
    data,
    accumulate,
    switchAxises,
    tooltipBackground = TOOLTIP_BACKGROUND,
    graphStyles,
    mainAxisType,
    chartId,
    tooltipPointExternalDomId,
  } = props;

  const { showTooltip, hideTooltip, tooltipTop, tooltipLeft, tooltipData } = useTooltip<UseTooltip>();

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(({ target }) => {
        if (chartId) {
          let currentValue: Record<string, PointXY> = {};
          const currentValueStr = (target as HTMLDivElement).getAttribute('data-point');
          if (currentValueStr?.startsWith('{')) {
            currentValue = JSON.parse(currentValueStr);
          }

          const extPoint = Object.entries(currentValue)
            .filter(([id]) => id !== chartId)
            .map(([_id, point]) => point)[0];

          if (extPoint) {
            if (chartType === ChartType.bars) {
              // TODO showTooltipForBar
            } else {
              showTooltipForLinear(xScaleLinear, yScaleLinear, switchAxises, extPoint, data);
            }
          }
        }
      });
    });

    if (tooltipPointExternalDomId) {
      const pointDom = document.getElementById(tooltipPointExternalDomId);
      if (pointDom) {
        observer.observe(pointDom, { attributes: true });
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [tooltipPointExternalDomId, xScaleLinear]);

  const handleTooltip = (event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>, data: Data[]) => {
    if (!data?.length) return null;

    const coords = localPoint(event) || { x: 0, y: 0 };

    if (tooltipPointExternalDomId && chartId) {
      const pointDom = document.getElementById(tooltipPointExternalDomId);
      if (pointDom) {
        const currentValue: Record<string, PointXY> = { [chartId]: coords };
        pointDom.setAttribute('data-point', JSON.stringify(currentValue));
      }
    }

    if (chartType === ChartType.bars) {
      // TODO showTooltipForBar
    } else {
      showTooltipForLinear(xScaleLinear, yScaleLinear, switchAxises, coords, data);
    }
  };

  // Очень хотелось сделать чистой функцией и вынести из тела компонента, но достать тип для showTooltip не получилось
  function showTooltipForLinear(
    xScaleLinear: Props['xScaleLinear'],
    yScaleLinear: Props['yScaleLinear'],
    switchAxises: Props['switchAxises'],
    xyPos: { x: number; y: number },
    data: Data[],
  ): void {
    if (!xScaleLinear || (switchAxises && !yScaleLinear) || !getClosestPoint) return;

    const { x, y } = xyPos;
    /**
     * Позиция всегда должна рассчитываться относительно главной оси.
     * */
    const scaledX = xScaleLinear.invert(switchAxises ? y : x);
    const nearestNextIndex = data.findIndex((df) => Number(df.key) >= scaledX);

    const nearestData = findNearestData(data, nearestNextIndex, scaledX);

    if (!nearestData) return;

    const closestValue = getClosestPoint(nearestData, switchAxises ? x : y, keys, accumulate, yScaleLinear);
    const posTop = switchAxises ? xScaleLinear(Number(nearestData.key)) : closestValue;
    const posLeft = switchAxises ? closestValue : xScaleLinear(Number(nearestData.key));
    const pointsCoordinates = keys
      .map((key): ToolipPoint => {
        return {
          x: posLeft,
          // Явное приведение потому что для линеных графиков все данные для основной оси - числа
          y: yScaleLinear(key)(nearestData[key] as number),
          key,
          stroke: graphStyles[key].stroke,
        };
      })
      .filter((p) => isValidNumber(p.y) && isValidNumber(p.x));

    const params = keys
      .map((key, i): Param => {
        const graph = chartData[i];

        // Если ключи перестанут быть соразмерными chartData'е, создайте хэш типа ключ(key)-параиетры
        return {
          name: graph.alias,
          dimention: graph.dimension ?? '',
          stroke: graph.styleSettings?.stroke ?? graph.color ?? 'black',
          strokeWidth: graph.styleSettings?.strokeWidth ?? 1,
          strokeDasharray: graph.styleSettings?.strokeDasharray,
          // Явное приведение потому что для линеных графиков все данные для основной оси - числа
          value: nearestData[key] as number,
          key,
        };
      })
      .filter((p) => isValidNumber(p.value));

    showTooltip({
      tooltipData: {
        key: nearestData.key,
        params,
        tooltipLine: {
          from: {
            x: switchAxises ? 0 : posLeft,
            y: switchAxises ? posTop : 0,
          },
          to: {
            x: switchAxises ? xMax : posLeft,
            y: switchAxises ? posTop : yMax,
          },
          pointsCoordinates,
          nearestPointYToCursor: posTop,
        },
      },
      tooltipTop: posTop + marginTop - TOOLTIP_MARGIN,
      tooltipLeft: posLeft + marginLeft - TOOLTIP_MARGIN,
    });
  }

  return (
    <>
      <svg width={xMax} height={yMax} transform={`translate(${marginLeft}, ${marginTop})`}>
        <Bar
          x={0}
          y={0}
          width={xMax}
          height={yMax}
          fill="transparent"
          rx={0}
          onTouchStart={(event) => handleTooltip(event, data)}
          onTouchMove={(event) => handleTooltip(event, data)}
          onMouseMove={(event) => handleTooltip(event, data)}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && <TooltipLine tooltipLine={tooltipData.tooltipLine} />}
      </svg>
      {tooltipData && tooltipData.params.length > 0 && (
        <TooltipWithBounds
          // Нужет для корректной работы, см доки Visx
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: tooltipBackground,
            color: '#FFFFFFDE',
            border: 'none',
            margin: `${TOOLTIP_MARGIN}px`,
            zIndex: '20',
            maxWidth: '50%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            lineHeight: '16px',
            fontSize: '12px',
          }}
        >
          <p
            style={{
              fontWeight: 'bold',
            }}
          >
            {mainAxisType === 'numeric' ? tooltipData.key : formatDate(tooltipData.key as string, 'DD.MM.YYYY HH:mm')}
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
            }}
          >
            <div style={LINES_LIST_S}>
              {tooltipData.params.map((param) => {
                return (
                  <svg width={32} height={12} key={param.key}>
                    <line
                      x1={0}
                      x2={32}
                      y1={'50%'}
                      y2={'50%'}
                      stroke={param.stroke}
                      strokeWidth={param.strokeWidth}
                      strokeDasharray={param.strokeDasharray}
                    />
                  </svg>
                );
              })}
            </div>
            <p style={LIST_S}>
              {tooltipData.params.map((param) => {
                return <span key={param.key}>{param.name}</span>;
              })}
            </p>
            <p style={LIST_S}>
              {tooltipData.params.map((param) => {
                return (
                  <span key={param.key}>
                    {param.value} {param.dimention}
                  </span>
                );
              })}
            </p>
          </div>
        </TooltipWithBounds>
      )}
    </>
  );
};
