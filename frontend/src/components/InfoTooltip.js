import React from 'react';

function InfoTooltip({ onClose, isOpen, message }) {

    return (
        <div className={`popup popup_type_infotool ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container">
                <img src={message.iconPath} alt="" className="popup__result-icon" />
                <p className="popup__title-info">{message.text}</p>
                <button type="button" className="popup__close-button" onClick={onClose} />
            </div>
        </div>
    );
}

export default InfoTooltip;