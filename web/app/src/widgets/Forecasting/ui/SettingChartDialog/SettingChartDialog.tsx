import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from 'react';
import { Divider, IconButton, MenuItem, Select, Typography } from '@mui/material';
import ColorPicker from '@shared/ui/ColorPicker';
import { allCurves } from './constants';
import { useAppSelector } from '@shared/hooks';
import { selectArticles, selectPluginsConfig } from '@features/common';
import { Curve, ForecastChart, Product } from '@widgets/Forecasting/models';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  forecastChart: ForecastChart | null;
  setForecastChart: (open: ForecastChart | null) => void;
  saveChange: (curves: Curve[], products: Product[]) => void;
}

export const SettingChartDialog = (props: Props) => {
  const { forecastChart, setForecastChart, saveChange } = props;

  const articles = useAppSelector(selectArticles);
  const pluginsConfig = useAppSelector(selectPluginsConfig);

  const [curves, setCurves] = useState<Curve[]>([]);
  const [products, setProduct] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const curves = forecastChart?.curves ?? []
    setCurves([...curves]);
    setProduct([...forecastChart?.products ?? []])
    if (curves?.length > 1) {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [forecastChart])

  const handleClose = () => {
    setForecastChart(null);
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChangeParams = (value: string, index: number) => {
    const curve = allCurves.find((c) => c.key === value);
    if (curve) {
      curves[index] = { ...curve };
      setCurves([...curves]);
    } else {
      const plugins = pluginsConfig.pluginsTimeSeries.find((p) => value.startsWith(p.key));
      const item = plugins?.items.find((i) => value.endsWith(i.key));
      if (item) {
        curves[index] = {
          key: plugins?.key + '.' + item.key,
          name: plugins?.name + '.' + item.type,
          color: item.color ?? ''
        };
        setCurves([...curves]);
      }
    }
  };

  const handleChangeProduct = (value: string, index: number) => {
    const product = articles.rows.find((c) => c.id === value);
    if (product) {
      products[index] = { id: product.id, name: product.name, color: '' };
      setProduct([...products]);
    }
  };

  const handleChangeColorParam = (value: string, index: number) => {
    curves[index] = { ...curves[index], color: value };
    setCurves([...curves]);
  };

  const handleChangeColorProduct = (value: string, index: number) => {
    products[index] = { ...products[index], color: value };
    setProduct([...products]);
  };

  const addParam = () => {
    setCurves([...curves, { key: '', name: '', color: '' }]);
  }

  const addProduct = () => {
    setProduct([...products, { id: '', name: '', color: '' }]);
  }

  const removeProduct = (id: string) => {
    setProduct(products.filter((c) => c.id !== id));
  }

  const removeParam = (key: string) => {
    setCurves(curves.filter((c) => c.key !== key));
  }

  const handleSaveChange = () => {
    if (activeTab == 0) {
      saveChange([curves[0]], products.filter((p) => p.id))
    } else {
      saveChange(curves.filter((p) => p.key), [products[0]])
    }
  }

  const keys = pluginsConfig.pluginsTimeSeries.flatMap((p) => p.items.map((i) => ({
    key: p.key + '.' + i.key,
    name: p.name + '.' + i.type
  })));

  const isDisableSave = !products.filter((p) => p.id).length || !curves.filter((p) => p.key).length;

  return (
    <Dialog
      maxWidth={'sm'}
      fullWidth
      open={!!forecastChart}
      onClose={handleClose}
    >
      <DialogTitle>Настройки графика</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Tabs value={activeTab} onChange={handleChangeTab} centered>
          <Tab label="Сравнение товаров" />
          <Tab label="Анализ показателей товара" />
        </Tabs>
        {activeTab == 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography variant='subtitle1'>Товары:</Typography>
            {products.map((p, index) => (
              <Box key={p.id} sx={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                <Select sx={{ width: '300px' }} size='small'
                  value={p.id}
                  onChange={(e) => handleChangeProduct(e.target.value, index)}
                >
                  {articles.rows.map((article) => (
                    <MenuItem
                      key={article.id}
                      value={article.id}
                      disabled={!!products.find((p) => p.id === article.id)}
                    >{article.name}</MenuItem>
                  ))}
                </Select>
                {p.id && (
                  <ColorPicker
                    color={p?.color}
                    setColor={(color) => handleChangeColorProduct(color, index)}
                  />
                )}
                <IconButton onClick={() => removeProduct(p.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button variant='outlined' onClick={addProduct} fullWidth>Добавить товар</Button>
            <Divider />
            <Typography variant='subtitle1'>Показатель:</Typography>
            <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
              <Select
                size='small'
                fullWidth
                value={curves?.[0]?.key ?? ''}
                onChange={(e) => handleChangeParams(e.target.value, 0)}
              >
                {allCurves.map((curve) => (
                  <MenuItem key={curve.key} value={curve.key}>{curve.name}</MenuItem>
                ))}
                {keys.map((i) => (
                  <MenuItem key={i.key} value={i.key}>{i.name}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography variant='subtitle1'>Показатели:</Typography>
            {curves.map((c, index) => (
              <Box key={c.key} sx={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                <Select sx={{ width: '300px' }} size='small'
                  value={c.key}
                  onChange={(e) => handleChangeParams(e.target.value, index)}
                >
                  {allCurves.map((curve) => (
                    <MenuItem
                      disabled={!!curves.find((cur) => cur.key === curve.key)}
                      key={curve.key}
                      value={curve.key}
                    >{curve.name}</MenuItem>
                  ))}
                  {keys.map((i) => (
                    <MenuItem key={i.key} value={i.key}>{i.name}</MenuItem>
                  ))}
                </Select>
                {c.key && (
                  <ColorPicker
                    color={c?.color}
                    setColor={(color) => handleChangeColorParam(color, index)}
                  />
                )}
                <IconButton onClick={() => removeParam(c.key)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button variant='outlined' onClick={addParam} fullWidth>Добавить показатель</Button>
            <Divider />
            <Typography variant='subtitle1'>Товар:</Typography>
            <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
              <Select
                size='small'
                fullWidth
                value={products?.[0]?.id ?? ''}
                onChange={(e) => handleChangeProduct(e.target.value, 0)}
              >
                {articles.rows.map((article) => (
                  <MenuItem key={article.id} value={article.id}>{article.name}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions >
        <Button disabled={isDisableSave} onClick={handleSaveChange}>Сохранить</Button>
        <Button onClick={handleClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}