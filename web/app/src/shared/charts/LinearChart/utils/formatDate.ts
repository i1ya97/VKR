import dayjs from 'dayjs';

export const formatDate = (date: string, format: string) => dayjs(date).utc().format(format);