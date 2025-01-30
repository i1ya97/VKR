import { Group } from '@visx/group';
import { curveBasis, curveCardinal, curveCatmullRom, curveLinear, curveNatural } from '@visx/curve';
import { Line, LinePath } from '@visx/shape';
import { Box, Button, Menu, MenuItem, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Marker } from './ui/Marker';
import { useCallback } from 'react';
import { isValidNumber } from './utils/isValidNumber';
import Legend from './ui/Legend';
import { DefaultSharedData } from './models/DefaultSharedData';
import { LinePathsItem } from './models/LinePathsItem';
import { Scroll } from './styles';
import GridAndAxises from './ui/GridAndAxises';
import { ChartType } from './models/ChartType';
import { useCore } from './hooks/useCore';
import Range from './ui/Range';
import { accessors, chartTextDark, chartTextLight } from './constants';
import Tooltip from './ui/Tooltip';
import { TooltipList } from './ui/TooltipList/TooltipList';

export const LinearChart = (props: DefaultSharedData) => {
  const {
    width,
    height,
    margin,
    mainAxisTicksNumber,
    secondaryAxisTicksNumber,
    disableLegend,
    legendHeight,
    legendPosition,
    linearType,
    enableTooltip,
    additionalLines,
    range,
    mainAxisType,
    styleSettings,
    showPoints,
    switchAxises,
    continueLineData,
    showBorder,
    groupByProperty,
    switchSecondaryAxisPosition,
    tooltipType,
    accumulate,
  } = props;

  const {
    legendState,
    names,
    handleNameSelectorItemClick,
    handleCloseNameSelector,
    handleNameSelectorButtonClick,
    selectedName,
    menuAnchorEl,
    keys,
    data,
    linePaths,
    secondaryAxises,
    xScaleBand,
    xScaleLinear,
    yScaleLinear,
    marginLeftInternal,
    marginLeftExternal,
    marginRightInternal,
    xMax,
    yMax,
    rangeZones,
    graphsStyles,
    leftAxisesWidths,
    rightAxisesWidths,
    filteredChartData,
    marginTop,
  } = useCore(props, ChartType.linear);

  const isDefined = useCallback((d: LinePathsItem) => isValidNumber(d.x) && isValidNumber(d.y), []);

  const theme = useTheme();

  const switchableMarginLeftInternal = !switchSecondaryAxisPosition ? marginLeftInternal : marginRightInternal;

  return (
    <Scroll style={{ height: height, width: width }}>
      {!disableLegend && legendPosition === 'top' && (
        <Legend
          legendHeight={legendHeight}
          legendState={legendState}
          additionalLines={additionalLines}
          range={range}
          legendItemColor={styleSettings?.legendItemColor}
        />
      )}
      {xMax > 0 && yMax > 0 && xScaleLinear && yScaleLinear && xScaleBand && graphsStyles && (
        <Box width={width} height={height - (!disableLegend ? legendHeight : 0)} sx={{ position: 'relative' }}>
          {selectedName && (
            <Box sx={{ position: 'absolute', zIndex: 2, top: 2, left: switchableMarginLeftInternal + 10 }}>
              <Button
                sx={{
                  width: 'auto',
                  height: 32,
                  background:
                    'linear-gradient(0deg, rgba(3, 169, 244, 0.04), rgba(3, 169, 244, 0.04)), #FCFCFF !important',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
                  borderRadius: '4px',
                }}
                disableRipple
                id="nameSelector-button"
                aria-controls={Boolean(menuAnchorEl) ? 'nameSelector-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(menuAnchorEl) ? 'true' : undefined}
                onClick={handleNameSelectorButtonClick}
                startIcon={<KeyboardArrowDownIcon />}
              >
                {selectedName}
              </Button>
              <Menu
                id="nameSelector-menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleCloseNameSelector}
                MenuListProps={{
                  'aria-labelledby': 'nameSelector-button',
                }}
              >
                {names.map((n) => (
                  <MenuItem key={`selectModel-${n}`} disableRipple onClick={() => handleNameSelectorItemClick(n)}>
                    {n}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          <svg width={width} height={height - (!disableLegend ? legendHeight : 0)}>
            <GridAndAxises
              {...props}
              mainAxisTicksNumber={mainAxisTicksNumber}
              secondaryAxisTicksNumber={secondaryAxisTicksNumber}
              styleSettings={styleSettings}
              secondaryAxises={secondaryAxises}
              xMax={xMax}
              yMax={yMax}
              xScale={xScaleLinear}
              yScaleLinear={yScaleLinear}
              marginLeftInternal={switchableMarginLeftInternal}
              marginLeftExternal={marginLeftExternal}
              marginTop={margin.top}
              keys={keys}
              showBorder={showBorder}
              graphsStyles={graphsStyles}
              leftAxisesWidths={leftAxisesWidths}
              rightAxisesWidths={rightAxisesWidths}
              groupeBy={!!groupByProperty}
            >
              <Group top={margin.top} left={switchableMarginLeftInternal + marginLeftExternal}>
                {linePaths
                  .filter((lp) => lp.dotsType !== 'only')
                  .map((lp) => (
                    <LinePath
                      key={`${lp.key}`}
                      data={lp.data}
                      defined={(d) => isDefined(d) || !lp.isDefined}
                      x={accessors.xAccessor}
                      y={accessors.yAccessor}
                      stroke={graphsStyles[lp.key].stroke}
                      strokeWidth={graphsStyles[lp.key].strokeWidth}
                      strokeDasharray={graphsStyles[lp.key].strokeDasharray ?? undefined}
                      curve={
                        linearType === 'basis'
                          ? curveBasis
                          : linearType === 'cardinal'
                            ? curveCardinal
                            : linearType === 'natural'
                              ? curveNatural
                              : linearType === 'catmullRom'
                                ? curveCatmullRom
                                : curveLinear
                      }
                    />
                  ))}
              </Group>
              {showPoints && (
                <Group top={margin.top} left={switchableMarginLeftInternal + marginLeftExternal}>
                  {linePaths
                    .filter((lp) => lp.dotsType !== 'hide')
                    .map((lp) =>
                      lp.data
                        .filter((p) => p.x && p.y)
                        .map((point) => (
                          <Marker
                            key={point.x + point.y}
                            linePath={lp}
                            point={point}
                            graphStyle={graphsStyles[lp.key]}
                            styleSettings={styleSettings}
                          />
                        )),
                    )}
                </Group>
              )}
              <Range
                linePaths={linePaths}
                yScaleLinear={yScaleLinear}
                marginLeft={switchableMarginLeftInternal}
                xMax={xMax}
                rangeZones={rangeZones}
                range={range}
                margin={margin}
              />
              {additionalLines?.map((line) => (
                <Group key={`additional-${line.y}`}>
                  <Line
                    x1={switchableMarginLeftInternal}
                    y1={yScaleLinear()(line.y)}
                    x2={xMax + switchableMarginLeftInternal}
                    y2={yScaleLinear()(line.y)}
                    stroke={line.color}
                    strokeDasharray={'4'}
                  />
                  <text
                    x={xMax}
                    y={yScaleLinear()(line.y) - 5}
                    fill={theme.palette.mode === 'dark' ? chartTextDark : chartTextLight}
                    fontSize={10}
                    textAnchor={'middle'}
                  >
                    {line.y.toFixed(2)}
                  </text>
                </Group>
              ))}
            </GridAndAxises>
          </svg>
          {enableTooltip && (
            <Box sx={{ position: 'absolute', zIndex: 1, top: 0, left: 0 }}>
              {tooltipType === 'DEFAULT' && (
                <Tooltip
                  marginLeft={switchableMarginLeftInternal + marginLeftExternal}
                  marginTop={margin.top}
                  data={data}
                  chartData={filteredChartData}
                  xMax={xMax}
                  keys={keys}
                  xScale={xScaleBand}
                  xScaleLinear={xScaleLinear}
                  yScaleLinear={yScaleLinear}
                  yMax={yMax}
                  chartType={ChartType.linear}
                  mainAxisType={mainAxisType}
                  switchAxises={switchAxises}
                  continueLineData={continueLineData}
                />
              )}
              {tooltipType === 'LIST' && (
                <TooltipList
                  switchAxises={switchAxises}
                  yScaleLinear={yScaleLinear}
                  accumulate={accumulate}
                  xScaleLinear={xScaleLinear}
                  data={data}
                  keys={keys}
                  xMax={xMax}
                  yMax={yMax}
                  chartData={filteredChartData}
                  chartType={ChartType.linear}
                  marginTop={marginTop}
                  marginLeft={switchableMarginLeftInternal + marginLeftExternal}
                  xScaleBand={xScaleBand}
                  graphStyles={graphsStyles}
                  tooltipBackground={styleSettings.tooltipBackground}
                />
              )}
            </Box>
          )}
        </Box>
      )}
      {!disableLegend && legendPosition === 'bottom' && (
        <Legend
          legendHeight={legendHeight}
          legendState={legendState}
          additionalLines={additionalLines}
          range={range}
          legendItemColor={styleSettings?.legendItemColor}
        />
      )}
    </Scroll>
  );
};
