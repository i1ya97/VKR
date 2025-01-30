import { Card, FormControl, IconButton, InputLabel, MenuItem, Select, styled, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { BorderBox } from '@widgets/Forecasting/ui/BorderBox';
import { Fragment, useEffect, useState } from 'react';
import { allTypeData, exampleJsonTableValue, exampleJsonTimeSeries } from './constants';
import DeleteIcon from '@mui/icons-material/Delete';
import { PluginOption } from '@shared/models/Plugin';
import ColorPicker from '@shared/ui/ColorPicker';
import { selectPluginsConfig, selectUser, setPluginsConfig } from '@features/common';
import { AppWriteCollection, updateDocument } from '@shared/api';

const ScrollStyled = styled('div')(({ theme }) => ({
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

export const Plugins = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const pluginsConfig = useAppSelector(selectPluginsConfig);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [plugins, setPlugins] = useState<PluginOption[]>([]);
  const [pluginsTimeSeries, setPluginsTimeSeries] = useState<PluginOption[]>([]);

  useEffect(() => {
    setPlugins(pluginsConfig.plugins);
    setPluginsTimeSeries(pluginsConfig.pluginsTimeSeries);
  }, [pluginsConfig])

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const addPlugins = () => {
    if (activeTab == 0) {
      setPlugins((prev) => [...prev, {
        id: crypto.randomUUID(),
        key: 'new_plugin',
        url: 'http://example/plugins',
        items: [],
        name: 'Новый плагин',
      }]);
    } else {
      setPluginsTimeSeries((prev) => [...prev, {
        id: crypto.randomUUID(),
        key: 'new_plugin',
        url: 'http://example/plugins',
        items: [],
        name: 'Новый плагин',
      }]);
    }
  }

  const addKey = (index: number) => {
    if (activeTab == 0) {
      plugins[index].items.push({
        id: crypto.randomUUID(),
        key: '',
        type: 'number',
      })
      setPlugins([...plugins]);
    } else {
      pluginsTimeSeries[index].items.push({
        id: crypto.randomUUID(),
        key: '',
        type: '',
      })
      setPluginsTimeSeries([...pluginsTimeSeries]);
    }
  }

  const changePlugin = (index: number, key: string, value: string | number) => {
    if (activeTab == 0) {
      plugins[index] = { ...plugins[index], [key]: value };
      setPlugins([...plugins]);
    } else {
      pluginsTimeSeries[index] = { ...pluginsTimeSeries[index], [key]: value };
      setPluginsTimeSeries([...pluginsTimeSeries]);
    }
  }

  const changeItem = (index: number, itemIndex: number, key: string, value: string | number) => {
    if (activeTab == 0) {
      plugins[index].items[itemIndex] = {
        ...plugins[index].items[itemIndex], [key]: value
      };
      setPlugins([...plugins]);
    } else {
      pluginsTimeSeries[index].items[itemIndex] = {
        ...pluginsTimeSeries[index].items[itemIndex], [key]: value
      };
      setPluginsTimeSeries([...pluginsTimeSeries]);
    }
  }

  const removePlugin = (id: string) => {
    if (activeTab == 0) {
      setPlugins(plugins.filter((p) => p.id !== id));
    } else {
      setPluginsTimeSeries(pluginsTimeSeries.filter((p) => p.id !== id));
    }
  }

  const removeItem = (index: number, id: string) => {
    if (activeTab == 0) {
      plugins[index].items = plugins[index].items.filter((p) => p.id !== id);
      setPlugins([...plugins]);
    } else {
      pluginsTimeSeries[index].items = pluginsTimeSeries[index].items.filter((p) => p.id !== id);
      setPluginsTimeSeries([...pluginsTimeSeries]);
    }
  }

  const handleSave = () => {
    dispatch(setPluginsConfig({ ...pluginsConfig, plugins, pluginsTimeSeries }))
    updateDocument(AppWriteCollection.pluginsConfig, pluginsConfig.id, {
      userId: user?.$id ?? '',
      plugins: JSON.stringify(plugins),
      pluginsTimeSeries: JSON.stringify(pluginsTimeSeries),
    }).subscribe();
  }

  return (
    <Box sx={{
      margin: '24px',
      gap: '16px',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100% - 48px)'
    }}>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4">Плагины</Typography>
      </Box>
      <Divider />
      <Alert variant="outlined" severity="info" >
        Использование непроверенных плагинов может привести к утечке ваших данных.
      </Alert>
      <Tabs value={activeTab} onChange={handleChangeTab}>
        <Tab label="Плагины для табличных значений" />
        <Tab label="Плагины для временных рядов" />
      </Tabs>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 450px',
        gap: '16px',
        height: 'calc(100% - 206px)'
      }}>
        <ScrollStyled>
          {(activeTab === 0 ? plugins : pluginsTimeSeries).map((p, index) => (
            <Card key={p.id} sx={{
              padding: '16px',
              display: 'flex',
              gap: '16px',
              flexDirection: 'column',
              marginBottom: "16px"
            }}>
              <Box sx={{ display: 'flex', gap: '16px' }}>
                <TextField
                  size='small'
                  fullWidth
                  value={p.name}
                  onChange={(e) => changePlugin(index, 'name', e.target.value)}
                  label="Название"
                  variant="outlined"
                />
                <TextField
                  size='small'
                  fullWidth
                  value={p.key}
                  onChange={(e) => changePlugin(index, 'key', e.target.value)}
                  label="Key"
                  variant="outlined"
                />
                <IconButton onClick={() => removePlugin(p.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                size='small'
                fullWidth
                value={p.url}
                onChange={(e) => changePlugin(index, 'url', e.target.value)}
                label="URL"
                variant="outlined"
              />
              <Divider />
              {p.items.map((item, indexItem) => (
                <Fragment key={item.id}>
                  <Box sx={{ display: 'flex', gap: '16px' }}>
                    <TextField
                      size='small'
                      fullWidth
                      value={item.key}
                      onChange={(e) => changeItem(index, indexItem, 'key', e.target.value)}
                      label="Ключ"
                      variant="outlined"
                    />
                    {activeTab === 0 && (
                      <FormControl fullWidth>
                        <InputLabel>Тип данных</InputLabel>
                        <Select
                          size='small'
                          value={item.type}
                          onChange={(e) => changeItem(index, indexItem, 'type', e.target.value)}
                          label="Тип данных"
                        >
                          {allTypeData.map((type) => (
                            <MenuItem key={type.key} value={type.key}>{type.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <IconButton onClick={() => removeItem(index, item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {activeTab === 1 && (
                    <Box sx={{ display: 'flex', gap: '16px' }}>
                      <TextField
                        size='small'
                        fullWidth
                        value={item.type}
                        onChange={(e) => changeItem(index, indexItem, 'type', e.target.value)}
                        label="Название"
                        variant="outlined"
                      />
                      <ColorPicker
                        color={item?.color ?? ''}
                        setColor={(color) => changeItem(index, indexItem, 'color', color)}
                      />
                    </Box>
                  )}
                  <Divider />
                </Fragment>
              ))}
              <Button variant="text" onClick={() => addKey(index)} fullWidth>Добавить ключ</Button>
            </Card>
          ))}
          <BorderBox>
            <Button variant="text" onClick={addPlugins} fullWidth>Добавить плагин</Button>
          </BorderBox>
        </ScrollStyled>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Alert variant="outlined" severity="info" icon={<></>}>
            <Typography>
              Ожидаемая структура данных в ответе на GET-запрос:
            </Typography>
            <pre>
              {activeTab === 0 ? exampleJsonTableValue : exampleJsonTimeSeries}
            </pre>
            <Typography>
              Указываются все нужные ключи.
            </Typography>
          </Alert>
          <Button variant="contained" onClick={handleSave} fullWidth>Сохранить настройки</Button>
        </Box>
      </Box>
    </Box>
  );
};
