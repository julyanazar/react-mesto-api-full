# Приложение `Mesto`
О проекте:
* Учебный проект на тему основы бэкенда для фронтенд-разработчиков;
* Бэкенд расположите в директории `backend/`, а фронтенд - в `frontend/`;
* Ссылка на проект: [www.mesto.website](http://mesto.website.nomoredomains.rocks/) или IP [84.201.177.31](http://84.201.177.31)
* Ссылка на API: [api.mesto.website](http://api.mesto.website.nomoredomains.club)


## В проекте используется:
* JavaScript;
* HTML, CSS;
* React;
* Node.js;
* express.js;
* Nginx;
* MongoDB;
* Yandex Cloud;

## В проекте реализован следующий функционал:
* Редактирование информации профиля;
* Рендеринг списка карточек;
* Рендер одной карточки из формы(добавление новой карточки);
* Удаление и лайки карточек;
* Закрытие модальных окон;


## Инструкция по развёртыванию:
* Установка зависимостей: из папки backend и frontend выполните следующую команду
```
npm install
```
* Собрать frontend: выполните следующую команду
```
npm run build
```
* Добавить .env в папку backend: указать PORT и JWT_SECRET_KEY
* Установить модуль [pm2](https://www.npmjs.com/package/pm2)
* Настроить [nginx](https://nginx.org/ru/docs/beginners_guide.html)
