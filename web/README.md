# Геолжурнал

Функция модуля в системе:
- Просмотр статистики и отчетов как по отдельным скважинам, так и общую статистику по работам за определенный период
- Сравнение нескольких скважин по определенным показателям (напр. по дебету воды, газа, нефти и тд)

# Deployment

Для работы приложение необходимо прописать следующее:

Переменные окружения:

  WEB_REALM: 'keycloak', // реалм keycloak;

  WEB_AUTH_URL: '/auth', // адрес keycloak;

  WEB_CLIENT_ID: 'user', // клиент keycloak;

Проксирование к сервисам: 

    '/generated-resources': {
        target: 'http://localhost:17602', // адрес где развернут Generated Resources
        pathRewrite: { '^/generated-resources': '' },
    },
    '/header-mfe': {
        target: 'http://localhost:17602', // адрес где развернут header-mfe
        pathRewrite: { '^/header-mfe': '' },
    },

