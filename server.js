const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

let items = [];
let id = 0;

let budgets = new Map();
let balance = 0;
let overMessages = [
  "You are over budget. Stop spending money.",
  "Seriously, stop.",
  "Have you no self-control??",
  "Stop. Just stop.",
  "Think of the children!"
];
let messageIndex = 0;
let categories = [
  "Food",
  "Clothes",
  "Rent",
  "Utilities",
  "Entertainment",
  "Other"
];

app.get('/api/items', (req, res) => {
  res.send(items);
});

app.post('/api/items', (req, res) => {
  id++;
  let item = {
    id: id,
    amount: req.body.amount,
    description: req.body.description,
    category: req.body.category,
    date: req.body.date,
    month: req.body.month,
  };

  balance -= item.amount;

  items.push(item);
  res.send(item);
});

app.get('/api/budget/:month', (req, res) => {
  let budget = budgets.get(req.params.month);
  res.send(budget);
});

app.post('/api/budget', (req, res) => {
  budgets.set(req.body.month, req.body.budget);
  balance = req.body.budget;
  res.send(balance);
});

app.get('/api/balance', (req, res) => {
  res.send(balance);
});

app.get('/api/message', (req, res) => {
  let message = overMessages[messageIndex];
  messageIndex++;

  if (messageIndex > overMessages.length) {
    messageIndex = 0;
  }

  res.send(message);
});

app.get('/api/categories', (req, res) => {
  res.send(categories);
});

app.delete('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  let item = items[removeIndex];
  balance += item.amount;
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3030, () => console.log('Server listening on port 3030'));
