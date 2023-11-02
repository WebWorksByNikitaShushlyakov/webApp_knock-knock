const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')

router.post(
    '/registration',
    [check('number', "Номер телефона не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть не менее 4х символов").isLength({min:4})], 
    controller.registration)
router.post('/login', controller.login)
router.post('/check-login', controller.checkLogin)
router.post('/new-advertisement', controller.newAdvertisement)
router.post('/delete-advertisement', controller.deleteAdvertisement)




// router.get('/info', controller.getInfo)

module.exports = router