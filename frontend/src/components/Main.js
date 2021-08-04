import React from 'react';
import Card from './Card';
import editAvatar from '../images/profile-avatar-edit.svg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile content__section">
                <div className="profile__bio">
                    <div className="profile__avatar-container" onClick={onEditAvatar}>
                        <img src={`${currentUser.avatar}`} className="profile__avatar"
                            alt="Аватар профиля" />
                        <img src={editAvatar} className="profile__avatar-edit"
                            alt="Смена аватара профиля" />
                    </div>
                    <div className="profile__info">
                        <div className="profile__name">
                            <h1 className="profile__title">{currentUser.name}</h1>
                            <button className="profile__edit-button" type="button"
                                onClick={onEditProfile} aria-label="изменить информацию о себе в профиле"></button>
                        </div>
                        <p className="profile__subtitle">{currentUser.about}</p>
                    </div>
                </div>
                <button className="profile__add-button" type="button" onClick={onAddPlace} aria-label="добавить изображение"></button>
            </section>

            <section className="elements content__section">
                <ul className="elements__items">
                    {cards.map((card) =>
                        <Card
                            key={card._id}
                            card={card}
                            onCardClick={onCardClick}
                            onCardLike={onCardLike}
                            onCardDelete={onCardDelete} />)}
                </ul>
            </section>
        </main>
    );
}

export default Main;
