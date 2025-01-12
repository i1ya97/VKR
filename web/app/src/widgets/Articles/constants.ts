import { TableColumn } from "@shared/ui/Table/models";

export const fixedColumns: TableColumn[] = [
	{
		id: 'offer_id',
		label: 'Артикул',
		width: 200,
		type: 'string'
	},
	{
		id: 'name',
		label: 'Название товара',
		type: 'string',
		width: 200
	}
]

export const columns: TableColumn[] = [{
	id: 'created_at',
	label: 'Дата создания товара',
	width: 200
}, {
	id: 'old_price',
	label: 'Цена до учёта скидок',
	width: 200,
	type: 'number',
}, {
	id: 'min_price',
	label: 'Мин цена c применения акций',
	type: 'number',
	width: 300,
}, {
	id: 'price',
	label: 'Цена с учётом скидок',
	type: 'number',
	width: 260,
}, {
	id: 'marketing_price',
	label: 'Цена с учётом всех акций',
	type: 'number',
	width: 260
}, {
	id: 'currency_code',
	label: 'Валюта',
	type: 'string',
	width: 150
}, {
	id: 'sale_schema',
	label: 'Схема продажи',
	type: 'string',
	width: 200
}, {
	id: 'delivery_amount',
	label: 'Стоимость доставки',
	type: 'number',
	width: 210
}, {
	id: 'return_amount',
	label: 'Стоимость возврата',
	type: 'number',
	width: 210
}, {
	id: 'vat',
	label: 'Ставка НДС для товара',
	type: 'number',
	width: 220
}, {
	id: 'percent',
	label: 'Процент комиссии',
	type: 'number',
	width: 220
}, {
	id: 'value',
	label: 'Сумма комиссии',
	type: 'number',
	width: 210
}, {
	id: 'volume_weight',
	label: 'Объёмный вес товара',
	type: 'number',
	width: 240
}, {
	id: 'is_discounted',
	label: 'Товар уценён',
	type: 'string',
	width: 220
}, {
	id: 'is_kgt',
	label: 'Крупногабаритный товар',
	type: 'string',
	width: 250
}];