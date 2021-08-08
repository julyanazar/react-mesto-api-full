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

    /*React.useEffect(() => {
        const JWT = localStorage.getItem('jwt')
        loggedIn &&
            Promise.all([api.getUserInfo(JWT), api.getInitialCards(JWT)])
                .then((data) => {
                    const [userData, cardsData] = data;
                    setCurrentUser(userData);
                    setCards(cardsData.cards);
                })
                .catch((err) => {
                    console.log(`Ошибка получения данных данных: ${err}`)
                })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn, email])*/

    React.useEffect(() => {
        if (loggedIn) {
            const jwt = localStorage.getItem('jwt')
            api.getInitialCards(jwt)
                .then((data) => {
                    setCards(data.reverse())
                })
            api.getUserInfo(jwt)
                .then((data) => {
                    console.log(data)
                    setCurrentUser(data.currentUser)
                })
        }
        return
    }, [loggedIn])

    const tokenCheck = () => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            Auth.checkToken(jwt)
                .then((res) => {
                    if (res) {
                        setEmail(res.email);
                        setLoggedIn(true);
                        history.push('/');
                    }
                })
                .catch(err =>console.log(`Неверный токен: ${err}`));
            return jwt;
        }
    }    

    React.useEffect(() => {
        tokenCheck()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn])

    function handleCardLike(card) {
        if(loggedIn) {
            const jwt = localStorage.getItem('jwt')
        // Проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        const changeLike = isLiked ? api.deleteLikeCard(card._id, jwt) : api.likeCard(card._id, jwt)
        changeLike.then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard.card : c));
        })
            .catch(err => { console.log(err) });
        }
    }

    function handleCardDelete(card) {
        if(loggedIn) {
            const jwt = localStorage.getItem('jwt')
            api.removeCard(card._id, jwt)
            .then(() => {
            const newCards = cards.filter((c) => c._id !== card._id);
            setCards(newCards);
        })
            .catch(err => { console.log(err) });
        }
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

    function handleUpdateUser(item) {
        if(loggedIn) {
          const jwt = localStorage.getItem('jwt')
          api.editUserInfo(item, jwt)
          .then((item) => {
            setCurrentUser({ 
                ...currentUser,
                name: item.data.name, 
                about: item.data.about 
             });
             setIsEditProfilePopupOpen(false);
       }).catch(err => console.error(err))
          }
     }

    function handleUpdateAvatar(item) {
        if(loggedIn) {
            const jwt = localStorage.getItem('jwt')
            api.editUserAvatar(item, jwt)
            .then((item) => {

                setCurrentUser({ 
                    ...currentUser,
                     avatar: item.data.avatar
                 });
                setIsEditAvatarPopupOpen(false);

            })
            .catch(err => { console.log(err) });
        }
    }

    function handleAddPlaceSubmit(item) {
        if(loggedIn) {
            const jwt = localStorage.getItem('jwt')
            api.addCard(item, jwt)
            .then((item) => {

                setCards([item.data, ...cards])
                setIsAddPlacePopupOpen(false);

            })
            .catch(err => { console.log(err) });
        }
    }

    function registration(email, password) {
        Auth.register(email, password)
            .then((res) => {
                if (res.status === 201 || res.status === 200) {

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

    const authorization = (email, password) => {
        Auth.authorize(email, password)
            .then((res) => {
                const JWT = res.token
                JWT && localStorage.setItem('jwt', JWT)
                setEmail(email)
                setLoggedIn(true)
                history.push('/')
            })
            .catch((err) => {
                handleInfoTooltipContent({
                    iconPath: resultIconError,
                    text: 'Что то пошло не так!'
                })
                handleInfoTooltipPopupOpen();
                console.log(`Ошибка авторизации: ${err}`)
            })
    }

    function handleSignOut() {
        setCurrentUser({ _id: null, avatar: '' })
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