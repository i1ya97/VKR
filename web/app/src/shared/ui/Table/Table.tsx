import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import FilterMenu from './components/FilterMenu';
import { useVirtual } from '@tanstack/react-virtual';
import { SelectAnchor, TableColumn } from './models';
import { filteringRowsByRules, FilterOption, sort } from './utils';
import Cell from './components/Cell';
import { styled, useTheme } from '@mui/material/styles';
import { numberWithSpaces } from './utils/numberWithSpaces';

const RootStyled = styled('div')(({ theme }) => ({
  overflow: 'auto',
  maxHeight: '100%',
  maxWidth: '100%',
  width: '100%',
  paddingBottom: 4,

  '&::-webkit-scrollbar': {
    backgroundColor: theme.palette.divider,
    height: 8,
    width: 8,
    borderRadius: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 5,
  },
}));

const CellStyled = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid ' + theme.palette.text.disabled,
  borderRight: '1px solid ' + theme.palette.text.disabled,
  justifyContent: 'center',
  padding: '6px 8px',
  background: theme.palette.background.paper,
}));

const TextStyled = styled('span')(({ theme }) => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  lineHeight: '20px',
  textWrap: 'nowrap',
}));

interface Props {
  rows: Record<string, string>[];
  columns: TableColumn[];
  getValue: (row: Record<string, string>, key: string, noDisplay?: boolean) => { value: string; color?: string };
  rowSize?: number;
  compositeHeader?: boolean;
  fixedColumns?: TableColumn[];
  onClickRow?: (row: Record<string, string>) => void;
}

export default function Table(props: Props) {
  const { fixedColumns, rows, rowSize = 32, columns, getValue, onClickRow, compositeHeader } = props;

  const theme = useTheme();

  const parentRef = useRef<HTMLDivElement>(null);

  const [selectedOption, setSelectedOption] = useState<SelectAnchor | null>(null);
  const [filterOption, setFilterOption] = useState<Record<string, FilterOption>>({});
  const [orderOption, setOrderOption] = useState<Record<string, 'ASC' | 'DESK' | null>>({});

  const estimateSize = (number: number) => useCallback(() => number, []);

  const estimateSizeColumn = useCallback(
    (index: number) =>
      compositeHeader
        ? columns[index].children?.reduce((acc, c) => acc + (c?.width ?? 0), 0) ?? columns[index].width ?? 120
        : columns[index].width ?? 120,
    [columns],
  );

  useEffect(() => {
    columns.forEach((c) => {
      if (c.type === 'string') {
        const names = Array.from(new Set(rows.map((r) => r?.[c.id]))).map((r) => ({ key: r, name: r }));
        c.options = names;
      }
      return c;
    })
    fixedColumns?.forEach((c) => {
      if (c.type === 'string') {
        const names = Array.from(new Set(rows.map((r) => r?.[c.id]))).map((r) => ({ key: r, name: r }));
        c.options = names;
      }
      return c;
    })
  }, [rows, columns, fixedColumns])

  const filterRows = useMemo(() => {
    let currentRows = filteringRowsByRules(rows, filterOption, getValue);
    Object.entries(orderOption)
      .filter(([, value]) => value)
      .forEach(([key, value]) => {
        currentRows = currentRows?.sort((a, b) =>
          sort(getValue(a, key ?? '').value, getValue(b, key ?? '').value, value),
        );
      });
    return currentRows;
  }, [rows, filterOption, orderOption]);

  const rowVirtualizer = useVirtual({
    size: filterRows.length,
    parentRef,
    estimateSize: estimateSize(rowSize),
    overscan: 1,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: columns.length,
    parentRef,
    estimateSize: estimateSizeColumn,
    overscan: 1,
  });

  const uniqRow = useMemo(() => Array.from(new Set(rows.map((r) => r.name))), [rows]);

  const isGray = (name: string) => uniqRow.findIndex((u) => u === name) % 2;

  const getLeftPadding = useCallback(
    (index: number) => fixedColumns?.slice(0, index).reduce((acc, column) => acc + (column.width ?? 120), 0) ?? 0,
    [fixedColumns],
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, column: TableColumn) => {
    if (!column.type) return;
    if (column.id === selectedOption?.column.id) {
      setSelectedOption(null);
    } else {
      setSelectedOption({ anchor: event.currentTarget, column });
    }
  };

  const handleClickOrder = (key: string, order: 'ASC' | 'DESK') => {
    setOrderOption((prev) => ({
      ...prev,
      [key]: orderOption?.[key] === order ? null : order,
    }));
  };

  const handleClose = () => {
    setSelectedOption(null);
  };

  const fixedSize = getLeftPadding(fixedColumns?.length ?? 0) ?? 0;

  const border = '1px solid ' + theme.palette.text.disabled;

  return (
    <>
      <RootStyled ref={parentRef}>
        <Box
          style={{
            height: `${rowVirtualizer.totalSize + (compositeHeader ? rowSize * 2 : rowSize)}px`,
            width: `${columnVirtualizer.totalSize + fixedSize}px`,
            position: 'relative',
          }}
        >
          {fixedColumns?.map((column, index) => (
            <CellStyled
              key={column.id}
              style={{
                cursor: column.type ? 'pointer' : 'auto',
                width: `${column.width}px`,
                height: `${compositeHeader ? rowSize * 2 : rowSize}px`,
                zIndex: 4,
                transform: `translateX(${(parentRef.current?.scrollLeft ?? 0) + getLeftPadding(index)}px) translateY(${parentRef.current?.scrollTop ?? 0
                  }px)`,
                justifyContent: 'space-between',
                background: selectedOption?.column.id === column.id ? theme.palette.background.default : theme.palette.background.paper,
                borderLeft: index === 0 ? border : 'none',
                borderTop: border,
              }}
            >
              <Box display="flex" alignItems="center" onClick={(e) => handleClick(e, column)}>
                <TextStyled>{column.label}</TextStyled>
                {column.type &&
                  (selectedOption?.column.id !== column.id ? (
                    <ArrowDropDownIcon />
                  ) : (
                    <ArrowDropUpIcon />
                  ))}
              </Box>
            </CellStyled>
          ))}
          {columnVirtualizer.virtualItems.map((virtualColumn) => {
            const column = columns[virtualColumn.index];
            return (
              <CellStyled
                key={virtualColumn.index}
                style={{
                  cursor: column.type ? 'pointer' : 'auto',
                  width: `${virtualColumn.size}px`,
                  height: `${compositeHeader ? rowSize * 2 : rowSize}px`,
                  zIndex: 3,
                  transform: `translateX(${virtualColumn.start + fixedSize}px) translateY(${parentRef.current?.scrollTop ?? 0
                    }px)`,
                  borderLeft: !fixedColumns?.length && virtualColumn.index === 0 ? border : 'none',
                  background: !compositeHeader && selectedOption?.column.id === column.id ? theme.palette.background.default : theme.palette.background.paper,
                  borderTop: border,
                  padding: '0px',
                  flexDirection: 'column',
                }}
                onClick={(e) => (!column?.children?.length ? handleClick(e, column) : () => { })}
              >
                <Box display="flex" alignItems="center" sx={{ padding: '6px 8px', height: rowSize - 1 }}>
                  <TextStyled>{column.label}</TextStyled>
                  {column.type &&
                    (selectedOption?.column.id !== column.id ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    ))}
                </Box>
                {compositeHeader && !!column?.children?.length && (
                  <Box sx={{ display: 'flex', borderTop: border }}>
                    {column.children?.map((c, index) => (
                      <Box
                        key={c.id}
                        display="flex"
                        alignItems="center"
                        sx={{
                          cursor: c.type ? 'pointer' : 'auto',
                          padding: '6px 8px',
                          height: rowSize - 2,
                          width: index === 0 ? (c.width ?? 0) - 1 : c.width,
                          background: selectedOption?.column.id === `${column.id}_${c.id}` ? theme.palette.background.default : theme.palette.background.paper,
                          borderLeft: index !== 0 ? border : 'none',
                        }}
                        onClick={(e) => handleClick(e, { ...c, id: `${column.id}_${c.id}` })}
                      >
                        <TextStyled>{c.label}</TextStyled>
                        {c.type &&
                          (selectedOption?.column.id !== `${column.id}_${c.id}` ? (
                            <ArrowDropDownIcon />
                          ) : (
                            <ArrowDropUpIcon />
                          ))}
                      </Box>
                    ))}
                  </Box>
                )}
              </CellStyled>
            );
          })}
          {rowVirtualizer.virtualItems.map(({ size, index, start }) => (
            <Fragment key={index}>
              {fixedColumns?.map((column, i) => {
                const item = getValue(filterRows[index], column.id ?? '');
                return (
                  <CellStyled
                    key={column.id}
                    style={{
                      width: `${column.width}px`,
                      height: `${size}px`,
                      background: isGray(filterRows[index].name) ? theme.palette.background.default : theme.palette.background.paper,
                      justifyContent: column.align ?? 'flex-start',
                      zIndex: 2,
                      transform: `translateX(${(parentRef.current?.scrollLeft ?? 0) + getLeftPadding(i)
                        }px) translateY(${start + (compositeHeader ? rowSize * 2 : rowSize)}px)`,
                      borderLeft: i === 0 ? border : 'none',
                    }}
                  >
                    {index === 0 && onClickRow && (
                      <IconButton
                        sx={{ fontSize: '20px', marginRight: '10px' }}
                        onClick={() => onClickRow(filterRows[index])}
                        size="small"
                      >
                        <MenuOpenIcon />
                      </IconButton>
                    )}
                    <TextStyled sx={{ color: item.color }} title={column.type === 'string' ? item.value : ''}>
                      {column.type !== 'string' ? numberWithSpaces(item.value) : item.value}
                      {item.value && column.type === 'percent' ? '%' : ''}
                    </TextStyled>
                  </CellStyled>
                );
              })}
              {columnVirtualizer.virtualItems.map((virtualColumn) => {
                const column = columns[virtualColumn.index];
                const row = filterRows[index];
                if (compositeHeader && column.children?.length) {
                  let paddingLeft = 0;
                  return column.children.map((c) => {
                    const item = getValue(row, `${column.id}_${c.id}`);
                    const currPaddingLeft = paddingLeft;
                    paddingLeft += c.width ?? 0;
                    return (
                      <Cell
                        key={c.id}
                        index={virtualColumn.index}
                        column={c}
                        isFixedColumns={!!fixedColumns?.length}
                        item={item}
                        row={row}
                        onClickRow={onClickRow}
                        isGray={isGray}
                        size={size}
                        sizeColumn={c.width ?? 0}
                        y={start + (compositeHeader ? rowSize * 2 : rowSize)}
                        x={virtualColumn.start + fixedSize + currPaddingLeft}
                      />
                    );
                  });
                } else {
                  const item = getValue(row, column.id ?? '');
                  return (
                    <Cell
                      key={column.id}
                      index={virtualColumn.index}
                      column={column}
                      isFixedColumns={!!fixedColumns?.length}
                      item={item}
                      row={row}
                      onClickRow={onClickRow}
                      isGray={isGray}
                      size={size}
                      sizeColumn={virtualColumn.size}
                      y={start + (compositeHeader ? rowSize * 2 : rowSize)}
                      x={virtualColumn.start + fixedSize}
                    />
                  );
                }
              })}
            </Fragment>
          ))}
        </Box>
      </RootStyled>
      {selectedOption && (
        <FilterMenu
          anchorOrderMenu={selectedOption}
          handleClose={handleClose}
          setFilterOption={setFilterOption}
          filterOption={filterOption}
          handleClickOrder={handleClickOrder}
          orderOption={orderOption}
        />
      )}
    </>
  );
}
