const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с таким id не найдена');
      }
      if (userId !== String(card.owner)) {
        throw new Forbidden('Недостаточно прав');
      }
      return Card.findByIdAndRemove(cardId)
        .orFail(() => {
          throw new NotFound('Карточка с таким id не найдена');
        })
        .then((cardData) => res.send({ data: cardData }))
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw new BadRequest('Переданы некорректные данные');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка с таким id не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка с таким id не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
