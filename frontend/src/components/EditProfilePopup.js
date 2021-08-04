import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    // Подписка на контекст
    const currentUser = React.useContext(CurrentUserContext);

    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser]);

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            name="edit"
            title="Редактировать профиль"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit}>
            <fieldset className="form__inputs">
                <input
                    onChange={(evt) => setName(evt.target.value)}
                    value={name || ''}
                    id="form_edit-name"
                    className="form__input form__input-name"
                    type="text"
                    name="name"
                    minLength="2"
                    maxLength="40"
                    required
                    placeholder="Имя" />
                <span id="form_edit-name-error" className="form__error"></span>

                <input
                    onChange={(evt) => setDescription(evt.target.value)}
                    value={description || ''}
                    id="form_edit-about"
                    className="form__input form__input-about"
                    type="text"
                    name="about"
                    minLength="2"
                    maxLength="200"
                    required
                    placeholder="О себе" />
                <span id="form_edit-about-error" className="form__error"></span>
            </fieldset>
        </PopupWithForm>
    );
}

export default EditProfilePopup;