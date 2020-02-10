const express = require('express');
const Users = require('./data/db.js');
const server = express();
server.use(express.json());

server.post(`/api/users`, (req, res) => {
  const { name, bio } = req.body;

  Users.insert({ name, bio })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      if (!name || !bio) {
        console.log(err);
        res
          .status(400)
          .json({ errorMessage: 'Please provide name and bio for the user.' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'There was an error while saving the user to the database'
      });
    });
});

server.get(`/api/users`, (req, res) => {
  Users.find()
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'The users information could not be retrieved.'
      });
    });
});

server.get(`/api/users/:id`, (req, res) => {
  const { id } = req.params;
  Users.findById(id)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'The user information could not be retrieved.'
      });
    });

  if (!id) {
    res.status(404).json({
      errorMessage: 'The user with the specified ID does not exist.'
    });
  }
});

server.delete(`api/users/:id`, (req, res) => {
  const { id } = req.params;

  Users.remove(id)
    .then(del => {
      if (del) {
        res.status(200).json(del);
      } else {
        res.status(404).json({
          errorMessage: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    });
});

server.put(`/api/users/:id`, (req, res) => {
  const { id } = req.params;
  const userInfo = req.body;
  const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }

  if (!id) {
    res
      .status(404)
      .json({ errorMessage: 'The user with the specified ID does not exist.' });
  }

  Users.update(id, { name, bio }).then(user => {
    if (user) {
      res.status(200).json({ successMessage: true, user });
    } else {
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be modified.' });
    }
  });
});

server.listen(5000, () => console.log('We Out Here'));
