import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { TableColumn } from '../../models';
import { styled, useTheme } from '@mui/material/styles';
import { numberWithSpaces } from '../../utils/numberWithSpaces';

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
  index: number;
  column: TableColumn;
  isFixedColumns: boolean;
  item: {
    value: string;
    color?: string;
  };
  row: Record<string, string>;
  onClickRow?: (row: Record<string, string>) => void;
  isGray: (name: string) => number;
  size: number;
  sizeColumn: number;
  x: number;
  y: number;
}

export default function Cell(props: Props) {
  const { index, isFixedColumns, column, item, row, onClickRow, isGray, size, sizeColumn, x, y } = props;

  const theme = useTheme();

  const border = '1px solid ' + theme.palette.text.disabled;

  return (
    <CellStyled
      sx={{
        width: `${sizeColumn}px`,
        height: `${size}px`,
        justifyContent: column.align ?? 'flex-start',
        transform: `translateX(${x}px) translateY(${y}px)`,
        background: isGray(row.name) ? theme.palette.background.default : theme.palette.background.paper,
        borderLeft: !isFixedColumns && index === 0 ? border : 'none',
      }}
    >
      {!isFixedColumns && index === 0 && onClickRow && (
        <IconButton sx={{ fontSize: '20px', marginRight: '10px' }} onClick={() => onClickRow(row)} size="small">
          <MenuOpenIcon />
        </IconButton>
      )}
      <TextStyled sx={{ color: item.color }} title={column.type === 'string' ? item.value : ''}>
        {column.type !== 'string' ? numberWithSpaces(item.value) : item.value}
        {item.value && column.type === 'percent' ? '%' : ''}
      </TextStyled>
    </CellStyled>
  );
}
