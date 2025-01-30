// Так же используется для расчета выхода из нижнего предела.
import { Data } from '../models/Data';
import { ScaleLinear } from 'd3-scale';
import { Range } from '../models/Range';

const getXOutOfTopRange = (x1: { x: number; y: number }, x2: { x: number; y: number }, rangeLine: number) => {
  /**
   * 10
   *             x2
   *            /|
   *           / |
   *       l1 /  | l2
   *      ---/---|---
   *        /|   |
   *       / |   |
   *      /  |   |
   *     /_ _|_ _|
   *   x1   l3   y1
   * 0                 10
   * */
  const x2y1 = x2.y - x1.y;
  const l2y1 = rangeLine - x1.y;
  const coefficient = l2y1 / x2y1;
  const x1y1 = x2.x - x1.x;
  const x1l3 = x1y1 * coefficient;
  return x1.x + x1l3;
};

// Так же используется для расчета выхода из верхнего предела.
const getXOutOfBottomRange = (x1: { x: number; y: number }, x2: { x: number; y: number }, rangeLine: number) => {
  /**
   * 10
   *      x1
   *      |\
   *      | \
   *   l1 |  \ l2
   *   ---|---\---
   *      |   |\
   *      |   | \
   *      |   |  \
   *      |_ _|_ _\
   *     y1   l3   x2
   * 0                 10
   * */
  const x1y1 = x1.y - x2.y;
  const l1y1 = rangeLine - x2.y;
  const coefficient = l1y1 / x1y1;
  const y1x2 = x2.x - x1.x;
  const l3x2 = y1x2 * coefficient;
  return x2.x - l3x2;
};

export const generateOutOfRangeZones = (
  data: Data[],
  range: Range,
  xScaleLinear: ScaleLinear<number, number, never>,
  yScaleLinear: (lineName?: string) => ScaleLinear<number, number, never>,
  minValueForEntire: number,
  maxValueForEntire: number,
) => {
  const zones: [number, number][][] = [];
  const sortedReference = range.values.sort((a, b) => b - a);

  let creatingZone = false;
  let zonesCount = -1;

  data.forEach((points, index) => {
    const values = (Object.entries(points) as [string, number][]).filter(([lineName]) => !(lineName === 'key'));

    const outOfTopRange = values.find((value) => value[1] > sortedReference[0]);
    const outOfBottomRange = values.find((value) => value[1] < sortedReference[1]);

    if (outOfTopRange || outOfBottomRange) {
      if (!creatingZone) {
        zonesCount += 1;
        zones.push([]);
        creatingZone = true;

        const prevPoints = data[index - 1];

        if (!prevPoints) {
          zones[zonesCount].push(
            [xScaleLinear.range()[0], yScaleLinear()(maxValueForEntire)],
            [xScaleLinear.range()[0], yScaleLinear()(minValueForEntire)],
          );
          return;
        }

        const intersectX = outOfTopRange
          ? getXOutOfTopRange(
              { x: (prevPoints?.key as number) ?? 0, y: prevPoints?.[outOfTopRange[0]] as number },
              { x: points.key as number, y: outOfTopRange[1] },
              sortedReference[0],
            )
          : getXOutOfBottomRange(
              { x: (prevPoints?.key as number) ?? 0, y: prevPoints?.[outOfBottomRange![0]] as number },
              { x: points.key as number, y: outOfBottomRange![1] },
              sortedReference[1],
            );

        zones[zonesCount].push(
          [xScaleLinear(intersectX), yScaleLinear()(maxValueForEntire)],
          [xScaleLinear(intersectX), yScaleLinear()(minValueForEntire)],
        );
      }
      if (creatingZone && index === data.length - 1) {
        zones[zonesCount].push(
          [xScaleLinear.range()[1], yScaleLinear()(minValueForEntire)],
          [xScaleLinear.range()[1], yScaleLinear()(maxValueForEntire)],
        );
      }
    } else {
      if (creatingZone) {
        creatingZone = false;

        /**
         * Лучше 1 или несколько раз перерассчитать предыдущие координаты, чем делать это на каждой итерации.
         * */
        const prevPoints = data[index - 1];
        const prevValues = (Object.entries(prevPoints) as [string, number][]).filter(
          ([lineName]) => !(lineName === 'key'),
        );

        const prevOutOfTopRange = prevValues.find((value) => value[1] > sortedReference[0]) as [string, number];
        const prevOutOfBottomRange = prevValues.find((value) => value[1] < sortedReference[1]) as [string, number];

        const prevIntersectX = prevOutOfTopRange
          ? getXOutOfBottomRange(
              { x: (prevPoints?.key as number) ?? 0, y: prevOutOfTopRange[1] },
              { x: points.key as number, y: points[prevOutOfTopRange[0]] as number },
              sortedReference[0],
            )
          : getXOutOfTopRange(
              { x: (prevPoints?.key as number) ?? 0, y: prevOutOfBottomRange![1] as unknown as number },
              { x: points.key as number, y: points[prevOutOfBottomRange![0]] as number },
              sortedReference[1],
            );

        zones[zonesCount].push(
          [xScaleLinear(prevIntersectX), yScaleLinear()(minValueForEntire)],
          [xScaleLinear(prevIntersectX), yScaleLinear()(maxValueForEntire)],
        );
      }
    }
  });

  return zones;
};
