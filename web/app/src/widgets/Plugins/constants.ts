export const exampleJsonTableValue = `[
  {
    "id": 7, - id продукта
    "vat": 20, - ключ vat
    "percent": 5 - ключ percent
  },
  {
    "id": 1, - id продукта
    "delivery_amount": 500, - ключ delivery_amount
    "return_amount": 300 - ключ return_amount
  }
]`

export const exampleJsonTimeSeries = `{
  "7": { - id продукта
    "ordered_units": [ - ключ ordered_units
      {
        "key": "2025-01-23T00:00:00Z",
        "value": 1
      },
    ]
  },
  "1": {
    "ordered_units": [ - ключ ordered_units
      {
        "key": "2025-01-23T00:00:00Z",
        "value": 4
      },
    ]
  }
}`

export const allTypeData = [{
  key: 'number',
  name: 'Число'
},{
  key: 'date',
  name: 'Дата'
},{
  key: 'string',
  name: 'Строка'
},{
  key: 'boolean',
  name: 'Флаг'
}]