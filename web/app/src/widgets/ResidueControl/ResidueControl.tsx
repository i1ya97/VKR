import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@shared/ui/Table';
import { columns as initColumns } from './constants';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import {
  fetchResidues, selectDateEnd, selectDateStart,
  selectResidues, selectUser, setDateEnd, setDateStart, setResidues
} from '@features/common';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { TableColumn } from '@shared/ui/Table/models';
import cloneDeep from 'lodash.clonedeep';
import { SettingDialog } from './ui/SettingDialog';
import { AppWriteCollection, createDocument, getDocuments, updateDocument } from '@shared/api';
import { Query } from 'appwrite';
import { map, of, switchMap } from 'rxjs';
import { evaluate } from 'mathjs';
import { isValidNumber } from '@shared/charts/LinearChart/utils/isValidNumber';

export const ResidueControl = () => {

  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const residues = useAppSelector(selectResidues);
  const dateStart = useAppSelector(selectDateStart);
  const dateEnd = useAppSelector(selectDateEnd);

  const [settingId, setSettingId] = useState<string>('');
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [editColumns, setEditColumns] = useState<TableColumn[] | null>(null);

  useEffect(() => {
    dispatch(setResidues({ rows: [], loading: true }));
    dispatch(fetchResidues());
    getDocuments(AppWriteCollection.tableSettings, [Query.equal('userId', [user?.$id ?? ''])]).pipe(
      switchMap((res) => {
        const document = res.documents[0];
        return document
          ? of({ id: document.$id, columns: JSON.parse(document.settings) })
          : createDocument(AppWriteCollection.tableSettings, {
            userId: user?.$id ?? '',
            settings: JSON.stringify(columns),
          }).pipe(map((res) => ({ id: res.$id, columns: initColumns })));
      })).subscribe((res) => {
        setSettingId(res.id);
        setColumns(res.columns);
      })
  }, []);

  const getValue = (row: Record<string, string>, key: string): { value: string; color?: string } => {
    const value = row[key];
    const column = columns.find((c) => c.id === key);
    if (column?.type === 'formula') {
      try {
        const result = evaluate(column?.formula ?? '', row);

        const isRed = column?.min && isValidNumber(+column?.min) && +column?.min > result;
        const isGreen = column?.max && isValidNumber(+column?.max) && +column?.max < result;
        const color = isRed ? 'red' : isGreen ? 'green' : '';

        return {
          value: result?.toFixed(3),
          color: color,
        }
      } catch (error) {
        return { value: "Ошибка в формуле" }
      }
    } else if (column?.type === 'number') {
      const isRed = column?.min && isValidNumber(+column?.min) && +column?.min > +value;
      const isGreen = column?.max && isValidNumber(+column?.max) && +column?.max < +value;
      const color = isRed ? 'red' : isGreen ? 'green' : '';

      return {
        value: value,
        color: color,
      }
    } else if (column?.type === 'boolean') {
      if (value?.toString() == 'true') return { value: 'Да' };
      if (value?.toString() == 'false') return { value: 'Нет' };
    } else if (column?.type === 'date') {
      return { value: dayjs.utc(value).format('DD.MM.YYYY hh:mm') }
    }
    return { value: value };
  }

  const changeDateStart = (value: dayjs.Dayjs | null) => {
    dispatch(setDateStart(value))
  }

  const changeDateEnd = (value: dayjs.Dayjs | null) => {
    dispatch(setDateEnd(value))
  }

  const handleOpenDialog = () => {
    setEditColumns(cloneDeep(columns));
  };

  const updateDB = (editColumns: TableColumn[]) => {
    updateDocument(AppWriteCollection.tableSettings, settingId, {
      userId: user?.$id ?? '',
      settings: JSON.stringify(editColumns),
    }).subscribe();
  }

  const saveChangeSettings = (editColumns: TableColumn[]) => {
    setColumns(editColumns);
    updateDB(editColumns);
    setEditColumns(null);
  }

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 40px)' }}>
      <Typography variant="h4">Анализ данных</Typography>
      <Divider />
      <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Typography>Укажите период:</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
            <DatePicker
              slotProps={{ textField: { size: 'small' } }}
              value={dateStart}
              onChange={changeDateStart}
            />
            —
            <DatePicker
              slotProps={{ textField: { size: 'small' } }}
              value={dateEnd}
              maxDate={dayjs()}
              onChange={changeDateEnd}
            />
          </LocalizationProvider>
        </Box>
        <IconButton onClick={handleOpenDialog}>
          <SettingsIcon />
        </IconButton>
      </Box>
      {residues.loading ? (
        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : !!residues.rows.length ? (
        <Table
          rows={residues.rows}
          rowSize={50}
          columns={columns}
          getValue={getValue}
        />
      ) : (
        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h5'>Нет данных</Typography>
        </Box>
      )}
      <SettingDialog editColumns={editColumns} setEditColumns={setEditColumns} saveChange={saveChangeSettings} />
    </Box>
  );
};
