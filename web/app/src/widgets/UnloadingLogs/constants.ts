import { TableColumn } from "@shared/ui/Table/models";

export const columns: TableColumn[] = [    {
    id: 'dueDate',
    label: 'Дата выполнения',
    width: 200
},{
    id: 'startDate',
    label: 'Данные загружены с',
    width: 200
}, {
    id: 'endDate',
    label: 'Данные загружены по',
    width: 200,
}, {
    id: 'type',
    label: 'Тип данных',
    type: 'string',
    width: 300,
}, {
    id: 'status',
    label: 'Статус',
    type: 'string',
    width: 260,
}, {
    id: 'comment',
    label: 'Комментарий',
    type: 'string',
    width: 260
}];

export const logs: Record<string, string>[] = [
    {
        id: '4',
        name: '4',
        dueDate: '11.01.2025 13:00',
        startDate: '10.10.2024',
        endDate: '11.01.2025',
        type: 'analytics/data',
        status: 'success',
        comment: '',
    },
    {
        id: '3',
        name: '3',
        dueDate: '10.01.2025 13:00',
        startDate: '09.10.2024',
        endDate: '10.01.2025',
        type: 'analytics/data',
        status: 'success',
        comment: '',
    },
    {
        id: '2',
        name: '2',
        dueDate: '09.01.2025 13:00',
        startDate: '09.10.2024',
        endDate: '09.01.2025',
        type: 'analytics/data',
        status: 'success',
        comment: '',
    },
    {
        id: '1',
        name: '1',
        dueDate: '09.01.2025 12:00',
        startDate: '-',
        endDate: '-',
        type: 'product/list',
        status: 'success',
        comment: '',
    },
];