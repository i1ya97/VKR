import InsightsIcon from '@mui/icons-material/Insights';
import BookIcon from '@mui/icons-material/Book';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import TableChartIcon from '@mui/icons-material/TableChart';
import ExtensionIcon from '@mui/icons-material/Extension';

export const sideBarItems = [{
  name: 'Дашборд',
  path: '/',
  icon: <DashboardIcon />,
}, {
  name: 'Артикулы',
  path: '/articles',
  icon: <ArticleIcon />,
}, {
  name: 'Анализ данных',
  path: '/data-analysis',
  icon: <TableChartIcon />,
}, {
  name: 'Работа с прогнозом',
  path: '/forecasting',
  icon: <InsightsIcon />,
}, {
  name: 'Плагины',
  path: '/plugins',
  icon: <ExtensionIcon />,
}, {
  name: 'Журнал выгрузки',
  path: '/unloading-logs',
  icon: <BookIcon />,
}]