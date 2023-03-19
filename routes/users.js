const express = require('express');
const router = express.Router();

const userDatabase = require('../database/users')
const {getAllExercises} = require("../database/users");

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

    const date = new Date(tDate);

    const exerciseWithUsername = await userDatabase.addExercise({_id, description, duration, date})

    console.log({exerciseWithUsername});

    res.send(exerciseWithUsername);
});

router.get('/:_id/logs', async function (req, res) {
    const {_id} = req.params;
    const {limit} = req.query;

    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    let exercises;

    console.log({from, to, limit});

    exercises = await userDatabase.getAllExercises({_id, from, to, limit});

    // console.log({exercises});
    res.send(exercises);
})

router.get('/all', async function(req, res) {
    const {users, exercises} = await userDatabase.seeAll();

    console.log({users, exercises});
    res.send({users, exercises});
})

module.exports = router;