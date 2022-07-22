const router = require("express").Router();
const Todoitem = require('../models/todoitem')
var bodyParser = require('body-parser')
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');

var jsonParser = bodyParser.json()

//------- admin routes-------
//get all todoitem
router.get('/getall', authorize(Role.Admin), async (req, res) => {
    try {
        const todoitems = await Todoitem.find()
        res.json(todoitems)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


//------user routes--------
//to get all the user's todoitem
router.get('/', async (req, res) => {
    try {
        const todoitem = await Todoitem.find({ user: req.user })
        res.json(todoitem)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// find todoitem with id (only authorized to get own todoitem)
router.get('/:id', getTodoitem, (req, res) => {

    res.json(res.todoitem)

})


//create new todoitem
router.post('/', jsonParser, async (req, res) => {
    console.log(req);
    const todoitem = new Todoitem({
        name: req.body.name,
        description: req.body.description,
        creationDate: Date.now(),
        status: "active",
        remark: req.body.remark,
        user: req.user
    })

    try {
        const newTodoitem = await todoitem.save()
        res.status(201).json(newTodoitem)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//update todoitem (only authorized to update own todoitem)
router.patch('/:id', jsonParser, async (req, res) => {
    await getTodoitem(req, res, async () => {
        res.todoitem.name = req.body.name
        res.todoitem.description = req.body.description
        res.todoitem.status = req.body.status
        res.todoitem.remark = req.body.remark
        try {
            const updatedTodoitem = await res.todoitem.save()
            res.json(updatedTodoitem)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    })
})


//delete todoitem (only authorized to delete own todoitem)
router.delete('/:id', getTodoitem, async (req, res) => {
    try {
        await res.todoitem.remove()
        res.json({ message: 'Todoitem deleted' })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})




//functions
//check todoitems if exist and also belongs to the user 
async function getTodoitem(req, res, next) {
    try {
        todoitem = await Todoitem.findById(req.params.id)
        if (todoitem == null) {

            return res.status(404).json({
                message: 'Cannot find todoitem'
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
    if (req.user._id.equals(todoitem.user)) {
        res.todoitem = todoitem
    } else {
        return res.status(401).json({ message: 'Unauthorized, This todoitem doesnt belongs to you' });
    }
    next()
}

module.exports = router;