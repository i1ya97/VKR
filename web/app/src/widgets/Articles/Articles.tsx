import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@shared/ui/Table';
import { columns, fixedColumns, products } from './constants';
import { Button } from '@mui/material';

export const Articles = () => {

  const getValue = (row: Record<string, string>, key: string) => {
    const value = row[key];
    if (value === 'true') return { value: 'Да' };
    if (value === 'false') return { value: 'Нет' };
    return { value };
  }

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Артикулы</Typography>
        <Button variant='contained' size='small'>Обновить информацию</Button>
      </Box>
      <Divider />
      <Table
        rows={products}
        rowSize={50}
        columns={columns}
        fixedColumns={fixedColumns}
        getValue={getValue}
      />
    </Box>
  );
};
