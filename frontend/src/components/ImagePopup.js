import React from 'react';

function ImagePopup({ card, onClose }) {
    return (
        <div className={`popup popup_type_image ${card ? 'popup_opened' : ''}`}>
            <div className="popup__container-img">
                <img src={card ? card.link : ''} alt={card ? card.name : ''} className="popup__img" />
                <h3 className="popup__caption">{card ? card.name : ''}</h3>
                <button className="popup__close-button" type="button" onClick={onClose} />
            </div>
        </div>
    );
}

export default ImagePopup;