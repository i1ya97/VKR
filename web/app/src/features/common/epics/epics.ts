import { fetchApiCredentionsEpic } from './fetchApiCredentions';
import { fetchArticlesEpic } from './fetchArticlesEpic';
import { fetchDashboardEpic } from './fetchDashboardEpic';
import { fetchPluginsEpic } from './fetchPluginsEpic';
import { fetchResiduesEpic } from './fetchResiduesEpic';
import { fetchUploadLogsEpic } from './fetchUploadLogsEpic';
import { fetchUserOptionsEpic } from './fetchUserOptions';

export const commonEpics = [
    fetchUserOptionsEpic,
    fetchApiCredentionsEpic,
    fetchUploadLogsEpic,
    fetchArticlesEpic,
    fetchResiduesEpic,
    fetchDashboardEpic,
    fetchPluginsEpic
];
