import { fetchApiCredentionsEpic } from './fetchApiCredentions';
import { fetchUserOptionsEpic } from './fetchUserOptions';

export const commonEpics = [ fetchUserOptionsEpic, fetchApiCredentionsEpic];
