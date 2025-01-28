import { fetchApiCredentionsEpic } from './fetchApiCredentions';
import { fetchArticlesEpic } from './fetchArticlesEpic';
import { fetchResiduesEpic } from './fetchResiduesEpic';
import { fetchUploadLogsEpic } from './fetchUploadLogsEpic';
import { fetchUserOptionsEpic } from './fetchUserOptions';

export const commonEpics = [
    fetchUserOptionsEpic,
    fetchApiCredentionsEpic,
    fetchUploadLogsEpic,
    fetchArticlesEpic,
    fetchResiduesEpic
];
