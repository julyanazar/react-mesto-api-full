class Api {
    constructor({ url, headers }) {
        this._url = url;
        this._headers = headers;
    }

    // Получить доступные карточки
    getInitialCards(token) {
        return fetch(`${this._url}/cards`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => this._checkRequestResult(res));
    }

    // Получить данные пользователя
    getUserInfo(token) {
        return fetch(`${this._url}/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => this._checkRequestResult(res));
    }

    // Редактировать данные пользователя
    editUserInfo(item, token) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(
                {name: item.name, about: item.about}
            )
        })
            .then(res => this._checkRequestResult(res));
    }

    // Добавление новой карточки
    addCard(item, token) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: item.name,
                link: item.link
              })
        })
            .then(res => this._checkRequestResult(res));
    }

    // Поставить лайк
    likeCard(cardId, token) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => this._checkRequestResult(res));
    }

    // Удалить лайк
    deleteLikeCard(cardId, token) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => this._checkRequestResult(res));
    }

    // Удалить карточку
    removeCard(cardId, token) {
        return fetch(`${this._url}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => this._checkRequestResult(res));
    }

    // Редактировать аватар пользователя
    editUserAvatar(item,token) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ avatar: item.avatar })
        })
            .then(res => this._checkRequestResult(res));
    }
    
    _checkRequestResult(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка! ${res.status}`);
    }

}

const api = new Api({
    url: 'http://api.mesto.website.nomoredomains.club',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('jwt')}`,
    }
});

export default api;