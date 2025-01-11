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

export const products: Record<string, string>[] = [
	{
		offer_id: '210167440',
		name: 'Смартфон POCO C61 64 ГБ зеленый',
		fbo: '340',
		fbs: '0',
		ordered: '88',
		returns: '0',
	},
	{
		offer_id: '210167441',
		name: 'Ноутбук ASUS VivoBook 15',
		fbo: '243',
		fbs: '7',
		ordered: '126',
		returns: '1',
	},
	{
		offer_id: '205800162',
		name: 'Наушники Sony WH-1000XM4',
		fbo: '154',
		fbs: '25',
		ordered: '46',
		returns: '0',
	},
	{
		offer_id: '209932822',
		name: 'Планшет Samsung Galaxy Tab S7',
		fbo: '95',
		fbs: '0',
		ordered: '27',
		returns: '0',
	},
	{
		offer_id: '210222824',
		name: 'Фитнес-трекер Xiaomi Mi Band 6',
		fbo: '58',
		fbs: '0',
		ordered: '58',
		returns: '0',
	},
	{
		offer_id: '210222821',
		name: 'Кофемашина Philips 3200 Series',
		fbo: '48',
		fbs: '15',
		ordered: '48',
		returns: '0',
	},
	{
		offer_id: '210889494',
		name: 'Телевизор LG 55UN73006LA',
		fbo: '46',
		fbs: '2',
		ordered: '10',
		returns: '0',
	},
	{
		offer_id: '205800161',
		name: 'Смарт-часы Apple Watch Series 6',
		fbo: '27',
		fbs: '23',
		ordered: '1',
		returns: '1',
	},
	{
		offer_id: '205876161',
		name: 'Игровая консоль Sony PlayStation 5',
		fbo: '24',
		fbs: '74',
		ordered: '10',
		returns: '0',
	},
	{
		offer_id: '205800346',
		name: 'Электросамокат Xiaomi Mi Electric Scooter 1S',
		fbo: '22',
		fbs: '0',
		ordered: '22',
		returns: '1',
	},
];