import { TableColumn } from "@shared/ui/Table/models";

export const columns: TableColumn[] = [{
    id: 'offer_id',
    label: 'Артикул',
    width: 150,
    type: 'string'
},{
    id: 'name',
    label: 'Название товара',
    width: 200,
    type: 'string'
},{
    id: 'fbo',
    label: 'Кол-во FBO',
	type: 'number',
    width: 150
}, {
    id: 'fbs',
    label: 'Кол-во FBS',
	type: 'number',
    width: 150,
}, {
    id: 'ordered',
    label: 'Заказано за период',
    type: 'number',
    width: 220,
}, {
    id: 'averageOrder',
    label: 'Среднесуточный объем заказов, шт',
    type: 'number',
    width: 320,
}, {
    id: 'turnoverForecastFBO',
    label: 'Прогноз оборачиваемости FBO, дн',
    type: 'number',
    width: 300
},{
    id: 'returns',
    label: 'Возвраты за период',
    type: 'number',
    width: 220
}];