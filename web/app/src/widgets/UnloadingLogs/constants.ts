import { TableColumn } from "@shared/ui/Table/models";

export const columns: TableColumn[] = [    {
    id: 'due_date',
    label: 'Дата выполнения',
    width: 200
},{
    id: 'start_date',
    label: 'Данные загружены с',
    width: 200
}, {
    id: 'end_date',
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