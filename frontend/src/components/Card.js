import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {

    const currentUser = React.useContext(CurrentUserContext);

    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = card.owner._id === currentUser._id;

    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName = (
        `${isOwn ? 'element__trash-button' : 'element__trash-button_hidden'}`
    );

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = `element__like-button ${isLiked ? 'element__like-button_active' : ''}`;

    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    function handleDeleteClick() {
        onCardDelete(card);
    }

    return (
        <li className="element">
            <div className="element__cover">
                <img src={card.link} alt={card.name} className="element__img" onClick={handleClick} />
            </div>
            <button className={cardDeleteButtonClassName} onClick={handleDeleteClick} type="button" aria-label="удалить каточку"></button>
            <div className="element__caption">
                <h2 className="element__title">{card.name}</h2>
                <div className="element__like-container">
                    <button className={cardLikeButtonClassName} onClick={handleLikeClick} type="button" aria-label="лайкнуть изображение"></button>
                    <p className="element__like-count">{card.likes.length}</p>
                </div>
            </div>
        </li>
    );
}

export default Card;
