import { TableColumn } from "@shared/ui/Table/models";

export const allKeys: {
    key: string,
    type: 'percent' | 'number' | 'string' | 'date' | 'formula' | 'boolean',
}[] = [{
    key: 'fbo',
    type: 'number'
}, {
    key: 'fbs',
    type: 'number'
}, {
    key: 'ordered',
    type: 'number'
}, {
    key: 'returns',
    type: 'number'
}, {
    key: 'revenue',
    type: 'number'
}, {
    key: 'deliveredUnits',
    type: 'number'
}, {
    key: 'positionCategory',
    type: 'number'
}, {
    key: 'name',
    type: 'string'
}, {
    key: 'offer_id',
    type: 'string'
}, {
    key: 'created_at',
    type: 'date'
}, {
    key: 'old_price',
    type: 'number'
}, {
    key: 'min_price',
    type: 'number'
}, {
    key: 'price',
    type: 'number'
}, {
    key: 'marketing_price',
    type: 'number'
}, {
    key: 'currency_code',
    type: 'string'
}, {
    key: 'delivery_amount',
    type: 'number'
}, {
    key: 'return_amount',
    type: 'number'
}, {
    key: 'sale_schema',
    type: 'string'
}, {
    key: 'vat',
    type: 'number'
}, {
    key: 'percent',
    type: 'number'
}, {
    key: 'volume_weight',
    type: 'number'
}, {
    key: 'is_discounted',
    type: 'boolean'
}, {
    key: 'is_kgt',
    type: 'boolean'
}, {
    key: 'count_days',
    type: 'number'
}];

export const columns: TableColumn[] = [{
    id: 'offer_id',
    label: 'Артикул',
    width: 150,
    type: 'string'
}, {
    id: 'name',
    label: 'Название товара',
    width: 200,
    type: 'string'
}, {
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
    id: '6756756',
    label: 'Среднесуточный объем заказов, шт',
    type: 'formula',
    formula: 'ordered / count_days',
    width: 320,
}, {
    id: '789879876',
    label: 'Прогноз оборачиваемости FBO, дн',
    type: 'formula',
    formula: 'fbo / (ordered / count_days)',
    width: 300
}, {
    id: 'returns',
    label: 'Возвраты за период',
    type: 'number',
    width: 220
}];