const router = require("express").Router();
const User = require('../models/user')
var bodyParser = require('body-parser')
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');

var jsonParser = bodyParser.json()

//All the routes here only Admin able to access
//get all user
router.get('/', authorize(Role.Admin), async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get user by id
router.get('/:id', authorize(Role.Admin), async (req, res) => {
    await getUser(req, res, async () => {
        res.json(res.userInfo)
    })
})

//To downgrade user to user role by id (for testing purpose)
router.get('/roleuser/:id', authorize(Role.Admin),async(req,res)=>{
    await getUser(req,res,async()=>{
        res.userInfo.role = Role.User
        if(res.userInfo._id.equals(req.user._id)){
            res.status(500).json({
                message: "You are not allowed to downgrade yourself to user role"
            })
        }else{
        const updatedUserInfo = await res.userInfo.save()
        res.json(updatedUserInfo)
        }
    })
})

//delete user by id
router.delete('/:id', authorize(Role.Admin), async (req, res) => {
    await getUser(req, res, async () => {
        try {
            if(res.userInfo._id.equals(req.user._id)){
                res.status(500).json({
                    message: "You are not allowed to delete yourself"
                })
            }else{
            await res.userInfo.remove()
            res.json({ message: 'Deleted User' })
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    })

}
)

//function
//get user by id middleware
async function getUser(req, res, next) {
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({
                messaege: 'Cannot find user'
            })
        }

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
    res.userInfo = user
    next()
}

module.exports = router