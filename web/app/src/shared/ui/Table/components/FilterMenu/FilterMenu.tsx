import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import SortIcon from '@mui/icons-material/Sort';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { SelectAnchor } from '../../models';
import { conditions, FilterOption } from '../../utils';
import { styled } from '@mui/material/styles';

const Scrollbar = styled('div')(({ theme }) => ({

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
  anchorOrderMenu: SelectAnchor | null;
  handleClose: () => void;
  filterOption: Record<string, FilterOption>;
  setFilterOption: Dispatch<SetStateAction<Record<string, FilterOption>>>;
  handleClickOrder: (key: string, order: 'ASC' | 'DESK') => void;
  orderOption: Record<string, 'ASC' | 'DESK' | null>;
}

const FilterMenu = (props: Props) => {
  const { anchorOrderMenu, handleClose, filterOption, setFilterOption, handleClickOrder, orderOption } = props;

  const [searchValueOption, setSearchValueOption] = useState<string>('');

  const key = anchorOrderMenu?.column.id ?? '';
  const isActiveFilter = !!filterOption?.[key]?.options?.length;

  useEffect(() => {
    const column = anchorOrderMenu?.column;
    if (column?.id) {
      if (column?.type !== 'string' && !filterOption[column.id]) {
        setFilterOption((prev) => ({
          ...prev,
          [column.id]: { numberOption: { condition: column?.type === 'date' ? '' : 'more', max: '', min: '' } },
        }));
      }
    }
  }, [anchorOrderMenu?.column]);

  const onSelectedItem = (itemKey: string) => {
    const values = filterOption?.[key] ?? [];
    if (values?.options?.includes(itemKey)) {
      setFilterOption((prev) => ({ ...prev, [key]: { options: values?.options?.filter((v) => v !== itemKey) } }));
    } else {
      setFilterOption((prev) => ({ ...prev, [key]: { options: [...(values?.options ?? []), itemKey] } }));
    }
  };

  const onCancel = () => {
    if (isActiveFilter) {
      setFilterOption((prev) => ({ ...prev, [key]: { options: [] } }));
    } else {
      setFilterOption((prev) => ({
        ...prev,
        [key]: { options: anchorOrderMenu?.column?.options?.map((o) => o.key) ?? [] },
      }));
    }
  };

  const handleChangeFilterData = (value: string) => {
    setFilterOption((prev) => ({ ...prev, [key]: { numberOption: { condition: value, max: '', min: '' } } }));
  };

  const handleChangeValue = (value: string | number, type: 'min' | 'max') => {
    const numberOption = filterOption?.[key]?.numberOption;
    if (numberOption) {
      setFilterOption(() => ({
        ...filterOption,
        [key]: { numberOption: { ...numberOption, [type]: value } },
      }));
    }
  };

  const handleCleanInput = () => {
    const condition =
      anchorOrderMenu?.column?.type === 'date' ? '' : filterOption[key]?.numberOption?.condition ?? 'more';
    setFilterOption(() => ({
      ...filterOption,
      [key]: { numberOption: { condition, max: '', min: '' } },
    }));
  };

  return (
    <Menu
      anchorEl={anchorOrderMenu?.anchor}
      open={!!anchorOrderMenu}
      sx={{
        '& .MuiPopover-paper': {
          marginTop: '5px',
          marginLeft: '-8px',
        },
        '& .MuiMenu-list': {
          padding: '4px 0px',
        },
      }}
      onClose={() => {
        handleClose();
        setSearchValueOption('');
      }}
    >
      <Box>
        {anchorOrderMenu?.column.type === 'string' ? (
          <>
            <TextField
              value={searchValueOption}
              onChange={(e) => setSearchValueOption(e.target.value)}
              placeholder="Поиск..."
              size="small"
              sx={{ margin: '16px', width: 'calc(100% - 32px)' }}
            />
            <ListItemButton dense onClick={() => onCancel()}>
              <ListItemText
                primary={isActiveFilter ? 'Выбрать все' : 'Отменить все'}
              />
            </ListItemButton>
            <Scrollbar
              sx={{
                maxHeight: '300px',
                overflow: 'auto',
              }}
            >
              {anchorOrderMenu?.column?.options
                ?.filter((s) => s.name?.includes(searchValueOption))
                .map((s) => (
                  <ListItemButton key={s.key} dense onClick={() => onSelectedItem(s.key)}>
                    <ListItemIcon>
                      <Checkbox
                        size="small"
                        checked={!filterOption?.[anchorOrderMenu.column.id ?? '']?.options?.includes(s.key)}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={s.name} />
                  </ListItemButton>
                ))}
            </Scrollbar>
          </>
        ) : (
          <Box display="flex" margin="16px" alignItems="center" gap="16px">
            <Select
              size="small"
              value={filterOption[key]?.numberOption?.condition ?? ''}
              onChange={(e) => handleChangeFilterData(e.target.value)}
              sx={{
                width: '113px',
              }}
            >
              {conditions.map(({ value, name }) => (
                <MenuItem key={value} value={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            <Box gap="8px" display="flex" alignItems="center">
              <TextField
                size="small"
                type="number"
                onChange={(e) => handleChangeValue(e.target.value, 'min')}
                value={filterOption[key]?.numberOption?.min ?? ''}
                variant="outlined"
                disabled={!filterOption[key]?.numberOption?.condition}
                sx={{ width: '120px' }}
              />
              {filterOption[key]?.numberOption?.condition === 'fromTo' && (
                <>
                  —
                  <TextField
                    size="small"
                    type="number"
                    onChange={(e) => handleChangeValue(e.target.value, 'max')}
                    value={filterOption[key]?.numberOption?.max ?? ''}
                    variant="outlined"
                    sx={{ width: '120px' }}
                  />
                </>
              )}
              <IconButton
                disabled={!filterOption[key]?.numberOption}
                sx={{ fontSize: '24px' }}
                size="small"
                onClick={() => handleCleanInput()}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
        )}
        <Box sx={{ margin: '0px 16px', paddingTop: '8px' }}>
          <Typography
          >
            Сортировка
          </Typography>
          <Divider variant="fullWidth"></Divider>
        </Box>
        <Box padding={'8px 0px'}>
          <MenuItem
            selected={orderOption?.[key] === 'ASC'}
            onClick={() => handleClickOrder(key, 'ASC')}
          >
            <ListItemIcon>
              <SortIcon />
            </ListItemIcon>
            <ListItemText>{anchorOrderMenu?.column?.type === 'string' ? 'А—Я' : 'По возрастанию'}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={orderOption?.[key] === 'DESK'}
            onClick={() => handleClickOrder(key, 'DESK')}
          >
            <ListItemIcon>
              <SortIcon sx={{ transform: 'scale(1, -1)' }} />
            </ListItemIcon>
            <ListItemText>{anchorOrderMenu?.column?.type === 'string' ? 'Я—А' : 'По убыванию'}</ListItemText>
          </MenuItem>
        </Box>
      </Box>
    </Menu>
  );
};

export default FilterMenu;
