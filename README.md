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

python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

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

---

## Учётные данные администратора (по умолчанию)

| Поле | Значение |
|---|---|
| Логин | `admin` |
| Пароль | `admin` |

Перед развёртыванием в production смените `SECRET_KEY` в `backend/app/auth.py`.

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

**Параметры GET /tickets:**

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `page` | int | `1` | Номер страницы |
| `page_size` | int | `10` | Записей на странице (1–100) |
| `status` | string | — | Фильтр по статусу: `new`, `in_progress`, `done` |
| `priority` | string | — | Фильтр по приоритету: `low`, `medium`, `high` |
| `search` | string | — | Полнотекстовый поиск по заголовку и описанию |
| `sort_by` | string | `created_at` | Поле сортировки: `created_at`, `priority`, `status` |
| `order` | string | `desc` | Порядок: `asc`, `desc` |

### Прочее

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/health` | Проверка работоспособности сервера |
