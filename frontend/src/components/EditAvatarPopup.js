import PopupWithForm from './PopupWithForm';
import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
    const currentUser = React.useContext(CurrentUserContext);
    const avatarInput = React.useRef();

    function handleSubmit(evt) {
        evt.preventDefault();

        onUpdateAvatar({
            avatar: avatarInput.current.value
        });
    }

    React.useEffect(() => {
        avatarInput.current.value = currentUser.avatar;
    }, [currentUser]);

    return (
        <PopupWithForm
            name="avatar"
            title="Обновить аватар"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit} >
            <fieldset className="form__inputs">
                <input 
                    ref={avatarInput}
                    id="form_avatar-edit" 
                    className="form__input form__input-link-avatar" 
                    name="avatar-input" 
                    placeholder="Ссылка на картинку" 
                    required />
                <span id="form_avatar-edit-error" className="form__error"></span>
            </fieldset>
        </PopupWithForm>
    );
}

export default EditAvatarPopup;