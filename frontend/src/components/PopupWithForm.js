import React from 'react';

function PopupWithForm({ name, title, children, buttonText, isOpen, onClose, handleSubmit }) {
    return (
        <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container">
                <h2 className="popup__title">{title}</h2>
                <form className="form" onSubmit={handleSubmit} name={name} noValidate>
                    {children}
                    <button type="submit" className="form__save-button" name="submit">{buttonText}</button>
                </form>
                <button className="popup__close-button" type="button" onClick={onClose}></button>
            </div>
        </div>
    );
}

export default PopupWithForm;