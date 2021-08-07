const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  validationCardID,
  validationCreateCard,
} = require('../middlewares/validate');

router.get('/cards', getCards);
router.post('/cards', validationCreateCard, createCard);
router.delete('/cards/:cardId', validationCardID, deleteCard);

router.put('/cards/likes/:cardId', validationCardID, likeCard);
router.delete('/cards/likes/:cardId', validationCardID, dislikeCard);

module.exports = router;
