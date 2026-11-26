# Pro Motors — Настройка Google Таблицы, Gmail и витрины Instagram (5 минут, 0 €/мес)

Вся база заявок (`Pedidos`), уведомления в Gmail и витрина работ Instagram (`Instagram`) работают **напрямую в Google-аккаунте Pro Motors** — без платных серверов и без привязки банковской карты.

---

## Шаг 1. Создать Google Таблицу
1. Войдите в Google-аккаунт мастерской (например, аккаунт, связанный с `geral@promotors.pt`).
2. Откройте [sheets.new](https://sheets.new) и назовите таблицу: **`Pro Motors — Gestão Site`**.

## Шаг 2. Установить скрипт `Code.gs`
1. В верхнем меню таблицы откройте **Extensions → Apps Script** (*Extensões → Apps Script*).
2. Удалите шаблонный код `function myFunction() {}` и вставьте целиком содержимое файла [`Code.gs`](Code.gs).
3. Нажмите **Save** (иконка дискеты / `Cmd+S`).

## Шаг 3. Автоматически создать листы (1 клик)
1. В верхней панели редактора Apps Script выберите функцию **`setupSpreadsheet`** и нажмите **Run** (*Executar*).
2. При первом запуске Google попросит разрешение:
   - **Review permissions** → выберите аккаунт Pro Motors → **Advanced** → **Go to ... (unsafe)** → **Allow**.
   - *(Это предупреждение стандартно для вашего личного неопубликованного скрипта; доступ даётся только этому скрипту внутри вашего же аккаунта.)*
3. Вернитесь в таблицу — автоматически появятся 3 оформленных листа:
   - **`Pedidos`** — мини-CRM заявок со статусами (`Novo`, `Confirmado`, `Em curso`, `Concluído`, `Cancelado`).
   - **`Instagram`** — список карточек для витрины работ на сайте.
   - **`Config`** — email мастерской (`WORKSHOP_EMAIL`), включение авто-ответа клиенту (`SEND_CLIENT_CONFIRMATION`) и лимит карточек (`MAX_INSTAGRAM_ITEMS`).

## Шаг 4. Опубликовать Web App
1. В редакторе Apps Script нажмите **Deploy → New deployment** (*Implementar → Nova implementação*).
2. Тип: **Web app** (*Aplicação Web*).
3. Настройки:
   - **Description:** `Pro Motors Website v1`
   - **Execute as:** **Me** (*Eu*)
   - **Who has access:** **Anyone** (*Qualquer pessoa*)
4. Нажмите **Deploy** и скопируйте полученный **Web app URL** (выглядит как `https://script.google.com/macros/s/.../exec`).

## Шаг 5. Подключить URL к сайту
- **На Cloudflare Pages / Netlify / GitHub Actions:** добавьте переменную окружения:
  ```env
  PUBLIC_GAS_WEB_APP_URL=https://script.google.com/macros/s/ВАШ_ID/exec
  ```
  и пересоберите сайт.
- **Локально для проверки:** скопируйте `.env.example` в `.env` (файл `.env` в `.gitignore`, в Git он не попадёт!) и вставьте URL туда.

> ⚠️ **Важно:** если в будущем вы измените код `Code.gs`, нужно нажать **Deploy → Manage deployments → Edit (карандаш) → Version: New version → Deploy**, чтобы изменения вступили в силу по тому же URL.

---

## Как обновлять витрину Instagram без программиста
1. Загрузите фото готовой работы в папку на **Google Drive** и откройте доступ по ссылке (**Anyone with the link → Viewer**).
2. Откройте лист **`Instagram`** в таблице `Pro Motors — Gestão Site`.
3. Добавьте строку:
   - `Ativo`: поставьте галочку
   - `Ordem`: число (например `1`, чтобы карточка была первой)
   - `Categoria_PT` / `Categoria_EN`: короткий тег (например `Travões` / `Brakes`)
   - `Legenda_PT` / `Legenda_EN`: короткая подпись
   - `ImagemURL`: просто вставьте обычную ссылку из Google Drive (`https://drive.google.com/file/d/.../view`) — скрипт сам превратит её в быструю миниатюру!
   - `InstagramURL`: ссылка на пост/Reel в `@promotorspt` (или на сам профиль).
4. Через 1–15 минут (после обновления кэша) новая карточка сама появится на сайте `promotors.pt`!
