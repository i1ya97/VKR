import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { TableColumn } from '@shared/ui/Table/models';
import Box from '@mui/material/Box';
import { Divider, FormControl, IconButton, InputLabel, MenuItem, Select, styled, TextField, Typography } from '@mui/material';
import { allKeys } from '@widgets/ResidueControl/constants';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '@shared/hooks';
import { selectPluginsConfig } from '@features/common';
import { v4 as uuidv4 } from 'uuid';

const ScrollStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '8px',
  overflow: 'auto',
  paddingRight: '8px',

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

interface Props {
  editColumns: TableColumn[] | null;
  setEditColumns: (open: TableColumn[] | null) => void;
  saveChange: (editColumns: TableColumn[]) => void;
}

export const SettingDialog = (props: Props) => {
  const { editColumns, setEditColumns, saveChange } = props;

  const [columns, setColumns] = useState<TableColumn[]>([]);

  const pluginsConfig = useAppSelector(selectPluginsConfig);

  useEffect(() => {
    setColumns(editColumns ?? [])
  }, [editColumns])

  const handleClose = () => {
    setEditColumns(null);
  };

  const handleSaveChange = () => {
    saveChange(columns);
  }

  const getTypeAlias = (type: string) => {
    if (type === 'date') return 'Дата';
    if (type === 'percent') return 'Проценты';
    if (type === 'number') return 'Число';
    if (type === 'string') return 'Строка';
    if (type === 'boolean') return 'Флаг';
    if (type === 'formula') return 'Формула';
    return '-';
  }

  const addColumn = () => {
    setColumns([...columns, {
      id: uuidv4(),
      label: '',
      width: 150,
      type: 'formula'
    }])
  }

  const changeColumn = (index: number, key: keyof TableColumn, value: string | number) => {
    columns[index] = { ...columns[index], [key]: value };
    setColumns([...columns]);
  }

  const changeTypeColumn = (index: number, value: string) => {
    if (value === 'formula') {
      columns[index] = { ...columns[index], type: value, id: uuidv4() };
    } else {
      const type = allKeys.find((k) => k.key === value)?.type;
      if(type) {
        columns[index] = { ...columns[index], id: value, type };
      } else {
        const plugins = pluginsConfig.pluginsTimeSeries.find((p) => value.startsWith(p.key));
        const item = plugins?.items.find((i) => value.endsWith(i.key));
        if(item?.type) columns[index] = { ...columns[index], id: value, type: item.type as any };
      }
    }
    setColumns([...columns]);
  }

  const removeColumn = (key: number) => {
    setColumns(columns.filter((_, index) => index !== key));
  }

  const keys = pluginsConfig.plugins.flatMap((p) => p.items.map((i) => ({
    key: p.key + '.' + i.key,
    type: i.type
  })));

  return (
    <Dialog
      maxWidth={'md'}
      fullWidth
      open={!!editColumns}
      onClose={handleClose}
    >
      <DialogTitle>Настройки таблицы</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ScrollStyled sx={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '8px' }}>
          {columns.map((c, index) => (
            <Box key={c.id} sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Divider>
                <Typography color='primary'>Столбец {index + 1}</Typography>
              </Divider>
              <Box sx={{ display: 'flex', gap: '16px' }}>
                <TextField
                  size='small'
                  fullWidth
                  value={c.label}
                  onChange={(e) => changeColumn(index, 'label', e.target.value)}
                  label="Название"
                  variant="outlined"
                />
                <TextField
                  size='small'
                  fullWidth
                  value={c.width}
                  onChange={(e) => changeColumn(index, 'width', e.target.value)}
                  label="Ширина"
                  variant="outlined"
                  type='number'
                />
                <FormControl fullWidth>
                  <InputLabel>Ключ</InputLabel>
                  <Select
                    size='small'
                    value={c.type === 'formula' ? 'formula' : c.id}
                    onChange={(e) => changeTypeColumn(index, e.target.value)}
                    label="Ключ"
                  >
                    <MenuItem value={'formula'}>Формула</MenuItem>
                    {allKeys.map((item) => (
                      <MenuItem key={item.key} value={item.key}>{`${item.key} (${getTypeAlias(item.type)})`}</MenuItem>
                    ))}
                    {keys.map((item) => (
                      <MenuItem key={item.key} value={item.key}>{`${item.key} (${getTypeAlias(item.type)})`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton onClick={() => removeColumn(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              {c.type === 'formula' && (
                <TextField
                  size='small'
                  fullWidth
                  placeholder='Напишите формулу используя ключи'
                  value={c.formula}
                  onChange={(e) => changeColumn(index, 'formula', e.target.value)}
                  label="Формула"
                  variant="outlined"
                />
              )}
              {(c.type === 'formula' || c.type === 'number') && (
                <Box sx={{ display: 'flex', gap: '16px' }}>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    value={c.min ?? null}
                    onChange={(e) => changeColumn(index, 'min', e.target.value)}
                    label="Нижняя граница (будет выделено красным)"
                    variant="outlined"
                  />
                  <TextField
                    size="small"
                    type="number"
                    value={c.max ?? null}
                    onChange={(e) => changeColumn(index, 'max', e.target.value)}
                    fullWidth
                    label="Верхняя граница (будет выделено зеленым)"
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
          ))}
          <Button variant='outlined' onClick={addColumn} fullWidth>Добавить столбец</Button>
        </ScrollStyled>
      </DialogContent>
      <DialogActions >
        <Button onClick={handleSaveChange}>Сохранить</Button>
        <Button onClick={handleClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}