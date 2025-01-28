import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@shared/ui/Table';
import { columns } from './constants';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { fetchUploadLogs, selectUploadLogs, setUploadLogs } from '@features/common';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';

export const UnloadingLogs = () => {

  const dispatch = useAppDispatch();

  const uploadLogs = useAppSelector(selectUploadLogs);

  useEffect(() => {
    dispatch(setUploadLogs({ rows: [], loading: true }));
    dispatch(fetchUploadLogs());
  }, [])

  const getValue = (row: Record<string, string>, key: string) => {
    const value = row[key];
    if (key.includes('date') && value) return { value: dayjs.utc(value).format('DD.MM.YYYY hh:mm') }
    if (key === 'status') return { value, color: value === 'success' ? '#47A76A' : '#DC143C' }
    return { value };
  }

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h4">Журнал выгрузки</Typography>
      <Divider />
      {uploadLogs.loading ? (
        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : !!uploadLogs.rows.length ? (
        <Table
          rows={uploadLogs.rows}
          rowSize={50}
          columns={columns}
          getValue={getValue}
        />
      ) : (
        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h5'>Нет данных</Typography>
        </Box>
      )}
    </Box>
  );
};
