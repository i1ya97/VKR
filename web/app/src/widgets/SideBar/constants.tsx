import InsightsIcon from '@mui/icons-material/Insights';
import BookIcon from '@mui/icons-material/Book';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';

export const sideBarItems = [{
  name: 'Дашборд',
  path: '/',
  icon: <DashboardIcon />,
}, {
  name: 'Артикулы',
  path: '/articles',
  icon: <ArticleIcon />,
}, {
  name: 'Контроля остатков',
  path: '/residue-control',
  icon: <InsightsIcon />,
}, {
  name: 'Журнал выгрузки',
  path: '/unloading-logs',
  icon: <BookIcon />,
}]