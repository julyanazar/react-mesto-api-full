import React from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import * as Auth from '../utils/auth';

import resultIcon from '../images/popup-result-icon.svg';
import resultIconError from '../images/popup-result-icon-error.svg';

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);

    const [currentUser, setCurrentUser] = React.useState({});

    const [cards, setCards] = React.useState([]);

    const [loggedIn, setLoggedIn] = React.useState(false);
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
    const [message, setMessage] = React.useState({ iconPath: '', text: '' });
    const [email, setEmail] = React.useState('');
    const history = useHistory();

    React.useEffect(() => {

        api.getUserInfo()
            .then((cardList) => {
                setCurrentUser(cardList);
            })
            .catch(err => { console.log(err) });
    }, []);

    React.useEffect(() => {

        api.getInitialCards()
            .then((cardList) => {
                setCards(cardList);
            })
            .catch(err => { console.log(err) });
    }, []);

    React.useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            Auth.getContent(jwt)
                .then((res) => {
                    setLoggedIn(true);
                    setEmail(res.data.email);
                    history.push('/');
                })
                .catch(err => console.log(err));
        }
    }, [history]);

    function handleCardLike(card) {
        // Проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        const changeLike = isLiked ? api.deleteLikeCard(card._id) : api.likeCard(card._id)
        changeLike.then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
            .catch(err => { console.log(err) });
    }

    function handleCardDelete(card) {
        api.removeCard(card._id).then(() => {
            const newCards = cards.filter((c) => c._id !== card._id);
            setCards(newCards);
        })
            .catch(err => { console.log(err) });
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleInfoTooltipPopupOpen() {
        setIsInfoTooltipPopupOpen(true);
    }

    function handleInfoTooltipContent({ iconPath, text }) {
        setMessage({ iconPath: iconPath, text: text })
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
        setIsInfoTooltipPopupOpen(false);
    }

    function handleUpdateUser({ name, about }) {
        api.editUserInfo(name, about)
            .then(() => {

                const updatedUser = { ...currentUser };
                updatedUser.name = name;
                updatedUser.about = about;

                setCurrentUser({ ...updatedUser });
                setIsEditProfilePopupOpen(false);

            })
            .catch(err => { console.log(err) });
    }

    function handleUpdateAvatar({ avatar }) {
        api.editUserAvatar(avatar)
            .then((updatedUser) => {

                setCurrentUser(updatedUser);
                setIsEditAvatarPopupOpen(false);

            })
            .catch(err => { console.log(err) });
    }

    function handleAddPlaceSubmit({ name, link }) {
        api.addCard(name, link)
            .then((card) => {

                setCards([card, ...cards]);
                setIsAddPlacePopupOpen(false);

            })
            .catch(err => { console.log(err) });
    }

    function registration(email, password) {
        Auth.register(email, password)
            .then((res) => {
                if (res.status === 201) {

                    handleInfoTooltipContent({
                        iconPath: resultIcon,
                        text: 'Вы успешно зарегистрировались!'
                    })
                    handleInfoTooltipPopupOpen();

                    setTimeout(history.push, 3000, "/sign-in");
                    setTimeout(closeAllPopups, 2500);
                }

                if (res.status === 400) {
                    console.log('Введный email уже зарегестрирован')
                }
            })
            .catch((err) => {
                handleInfoTooltipContent({
                    iconPath: resultIconError,
                    text: 'Что-то пошло не так! Попробуйте ещё раз.'
                })
                handleInfoTooltipPopupOpen();

                setTimeout(closeAllPopups, 2500);

                console.log(err)
            })
    }

    function authorization(email, password) {
        Auth.authorize(email, password)
            .then((data) => {
                if (!data) {
                    throw new Error('Произошла ошибка');
                }
                Auth.getContent(data)
                    .then((res) => {
                        setEmail(res.data.email);
                    })
                    .catch(err => console.log(err));
                setLoggedIn(true);
                handleInfoTooltipContent({
                    iconPath: resultIcon,
                    text: 'Вы успешно авторизовались!'
                })

                setTimeout(history.push, 3000, "/");
                setTimeout(closeAllPopups, 2500);
            })
            .catch((err) => {
                handleInfoTooltipContent({
                    iconPath: resultIconError,
                    text: 'Что то пошло не так!'
                })
                handleInfoTooltipPopupOpen();

                console.log(err)
            })
    }


    function handleSignOut() {
        setLoggedIn(false);
        localStorage.removeItem('jwt');
        setEmail('');
        history.push('/sign-in');
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className='page'>
                <Header
                    loggedIn={loggedIn}
                    email={email}
                    handleSignOut={handleSignOut} />

                <Switch>
                    {currentUser &&
                        <ProtectedRoute
                            exact
                            path="/"
                            loggedIn={loggedIn}
                            component={Main}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick}
                            onCardClick={handleCardClick}
                            cards={cards}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />}

                    <Route path="/sign-in">
                        <Login
                            authorization={authorization}
                        />
                    </Route>

                    <Route path="/sign-up">
                        <Register
                            registration={registration}
                        />
                    </Route>

                    <Route path="/">
                        {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
                    </Route>
                </Switch>
            </div>

            {currentUser &&
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />
            }

            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit}
            />

            {currentUser &&
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />
            }

            <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups} />

            {currentUser &&
                <InfoTooltip
                    isOpen={isInfoTooltipPopupOpen}
                    onClose={closeAllPopups}
                    message={message}
                />
            }

        </CurrentUserContext.Provider>
    );
}

export default App;