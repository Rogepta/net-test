# test-net

Система управления заявками. Пользователи создают заявки и отслеживают их статус; администратор меняет статусы и удаляет записи.

## Стек

| Слой | Технологии |
|---|---|
| Backend | Python 3.11+, FastAPI, SQLAlchemy, SQLite, python-jose |
| Frontend | React 19, TypeScript, Vite, TanStack Query |

---

## Запуск backend

```bash
cd backend

python -m venv venv
# Windows
venv\Scripts\activate
# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

API доступен на `http://localhost:8000`.  
Интерактивная документация: `http://localhost:8000/docs`.

---

## Запуск frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение доступно на `http://localhost:5173`.

Адрес API задаётся переменной `VITE_API_URL` (см. `.env.example`); по умолчанию `http://localhost:8000`.

---

## Учётные данные администратора (по умолчанию)

| Поле | Значение |
|---|---|
| Логин | `admin` |
| Пароль | `admin` |

Значения по умолчанию пригодны только для разработки. Перед развёртыванием в production задайте переменные окружения (см. ниже) — при `ENVIRONMENT=production` приложение откажется стартовать с дефолтными `SECRET_KEY` и `ADMIN_PASSWORD`.

---

## Конфигурация (переменные окружения)

Все настройки читаются из окружения; значения по умолчанию рассчитаны на локальную разработку. Для локального переопределения скопируйте `backend/.env.example` в `backend/.env` и запустите сервер с флагом `--env-file`: `uvicorn app.main:app --reload --env-file .env`.

| Переменная | По умолчанию | Описание |
|---|---|---|
| `ENVIRONMENT` | `development` | При `production` включается проверка безопасных значений на старте |
| `ADMIN_USERNAME` | `admin` | Логин администратора (создаётся при первом запуске) |
| `ADMIN_PASSWORD` | `admin` | Пароль администратора |
| `SECRET_KEY` | `change-me-in-production` | Ключ подписи JWT |
| `JWT_ALGORITHM` | `HS256` | Алгоритм подписи JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Время жизни токена в минутах |
| `DATABASE_URL` | `sqlite:///./tickets.db` | Строка подключения к БД |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Разрешённые источники  |

В режиме `ENVIRONMENT=production` приложение бросает ошибку при старте, если `SECRET_KEY` или `ADMIN_PASSWORD` остались дефолтными.

---

## Эндпоинты API

### Аутентификация

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/auth/login` | Получить JWT-токен администратора |

Тело запроса:
```json
{ "username": "admin", "password": "admin" }
```

### Заявки

| Метод | Путь | Требует токен | Описание |
|---|---|---|---|
| `GET` | `/tickets` | — | Список заявок с фильтрацией, поиском и пагинацией |
| `POST` | `/tickets` | — | Создать заявку |
| `PATCH` | `/tickets/{id}/status` | — | Изменить статус заявки |
| `DELETE` | `/tickets/{id}` | Да | Удалить заявку |

Завершённую заявку (`status = done`) нельзя редактировать или удалить — `PATCH` и `DELETE` в этом случае возвращают `409 Conflict`.

**Параметры GET /tickets:**

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `page` | int | `1` | Номер страницы |
| `page_size` | int | `10` | Записей на странице (1–100) |
| `status` | string | — | Фильтр по статусу: `new`, `in_progress`, `done` |
| `priority` | string | — | Фильтр по приоритету: `low`, `normal`, `high` |
| `search` | string | — | Полнотекстовый поиск по заголовку и описанию |
| `sort_by` | string | `created_at` | Поле сортировки: `created_at`, `priority` |
| `order` | string | `desc` | Порядок: `asc`, `desc` |

### Прочее

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/health` | Проверка работоспособности сервера |
