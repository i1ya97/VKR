import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@shared/ui/Table';
import { columns, fixedColumns } from './constants';
import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { useEffect } from 'react';
import { fetchArticles, selectArticles } from '@features/common';
import { ApiMethods, request } from '@shared/api';
import { from } from 'rxjs';
import dayjs from 'dayjs';

export const Articles = () => {

  const dispatch = useAppDispatch();

  const articles = useAppSelector(selectArticles);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [])

  const getValue = (row: Record<string, string | boolean>, key: string) => {
    const value = row[key];
    if (value == true) return { value: 'Да' };
    if (value == false) return { value: 'Нет' };
        if(key === 'created_at' && value) return {value: dayjs.utc(value).format('DD.MM.YYYY hh:mm')}
    return { value };
  }

  const updateArticles = () => {
    from(request<Record<string, string>[]>(ApiMethods.POST, `/api`, `/Products/add-products`)).subscribe(() => {
      dispatch(fetchArticles());
    })
  }

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Артикулы</Typography>
        <Button variant='contained' size='small' onClick={updateArticles}>Обновить информацию</Button>
      </Box>
      <Divider />
      <Table
        rows={articles}
        rowSize={50}
        columns={columns}
        fixedColumns={fixedColumns}
        getValue={getValue}
      />
    </Box>
  );
};
