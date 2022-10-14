const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

router.get('/', (req, res) => {
  res.send('Get Request');
});

router.post('/', (req, res) => {
  res.send(req.body);
});

router.use('/users', userRouter);

router.use('/cards', cardRouter);

module.exports = router;
