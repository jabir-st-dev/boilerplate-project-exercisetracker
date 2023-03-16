const express = require('express');
const router = express.Router();

const userDatabase = require('../database/users')

router.post('/', async function (req, res) {
    const user = await userDatabase.createUser({username: req.body.username});

    console.log({user});

    res.send(user);
})

router.get('/', async function (req, res) {
    const users = await userDatabase.getAll();

    console.log({users});

    res.send(users);
});

router.post('/:_id/exercises', async function (req, res) {
    const {description, duration} = req.body;
    let tDate = req.body.date;

    const {_id} = req.params;

    // console.log({_id, description, duration, tDate})

    if (new Date(tDate).toDateString() === "Invalid Date") {
        tDate = Date.now();
    }

    const date = new Date(tDate).toDateString();

    const exerciseWithUsername = await userDatabase.setExercise({_id, description, duration, date})

    console.log({exerciseWithUsername});

    res.send(exerciseWithUsername);
});

router.get('/:_id/logs', async function(req, res) {
    const {_id} = req.params;

    const exercises = await userDatabase.getAllExercise({_id});

    console.log({exercises});

    res.send(exercises);
})

module.exports = router;