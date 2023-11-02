const Router = require('express')
const router = new Router()
const controller = require('./dataController')

router.get('/residential/buy', controller.getResidentialBuy)
router.get('/residential/longRent', controller.getResidentialLongRent)
router.get('/residential/dailyRent', controller.getResidentialDailyRent)

router.get('/commerce/buy', controller.getCommerceBuy)
router.get('/commerce/rent', controller.getCommerceRent)

router.get('/my-advertisement/:number', controller.getMyAdvertisement)


module.exports = router