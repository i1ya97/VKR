import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@shared/ui/Table';
import { columns, logs } from './constants';
import { useEffect } from 'react';

export const UnloadingLogs = () => {

  const getValue = (row: Record<string, string>, key: string) => {
    const value = row[key];
    if (key === 'status') return { value, color: value === 'success' ? '#47A76A' : '#DC143C' }
    return { value };
  }

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">Журнал выгрузки</Typography>
      <Divider />
      <Table
        rows={logs}
        rowSize={50}
        columns={columns}
        getValue={getValue}
      />
    </Box>
  );
};
