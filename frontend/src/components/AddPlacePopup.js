import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
    const nameInput = React.useRef();
    const linkInput = React.useRef();

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onAddPlace({
            name: nameInput.current.value,
            link: linkInput.current.value
        });
    }

    return (
        <PopupWithForm
            name="add"
            title="Новое место"
            buttonText="Создать"
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit}>
            <fieldset className="form__inputs">
                <input
                    ref={nameInput}
                    id="form_add-name"
                    className="form__input form__input-card-name"
                    type="text"
                    name="name"
                    minLength="2"
                    maxLength="30"
                    required
                    placeholder="Название" />
                <span id="form_add-name-error" className="form__error"></span>
                <input
                    ref={linkInput}
                    id="form_add-about"
                    className="form__input form__input-src"
                    type="url"
                    name="about"
                    required
                    placeholder="Ссылка на картинку" />
                <span id="form_add-about-error" className="form__error"></span>
            </fieldset>
        </PopupWithForm>
    )
}

export default AddPlacePopup;