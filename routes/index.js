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

router.use((req, res) => {
  res.status(404);

  // respond with json
  if (req.accepts('json')) {
    res.json({ message: 'Передан неправильный путь' });
    return;
  }

  // default to plain-text
  res.type('txt').send('Not found');
});

module.exports = router;
