const pools = require('./pools/pools')


class dataController{
    // Регистрация пользователя
    async getResidentialBuy(req, res){
        try {
            // console.log('getResidentialBuy');

            const type = 'residentialBuy'
            const list = await pools.Base_pool.promise().query(`SELECT * FROM list_advertisement WHERE type_of_service='${type}'`)

            if(list){return res.status(200).json(list)}
            else{return res.status(400).json('Ошибка базы данных') }
        } catch (e) {res.status(400).json('Ошибка ...'+e)}
    }
    async getResidentialLongRent(req, res){
        try {
            // console.log('getResidentialLongRent');

            const type = 'residentialLongRent'
            const list = await pools.Base_pool.promise().query(`SELECT * FROM list_advertisement WHERE type_of_service='${type}'`)

            if(list){return res.status(200).json(list)}
            else{return res.status(400).json('Ошибка базы данных') }
        } catch (e) {res.status(400).json('Ошибка ...'+e)}
    }
    async getResidentialDailyRent(req, res){
        try {
            // console.log('getResidentialDailyRent');

            const type = 'residentialDailyRent'
            const list = await pools.Base_pool.promise().query(`SELECT * FROM list_advertisement WHERE type_of_service='${type}'`)

            if(list){return res.status(200).json(list)}
            else{return res.status(400).json('Ошибка базы данных') }
        } catch (e) {res.status(400).json('Ошибка ...'+e)}
    }

    async getCommerceBuy(req, res){
        try {
            // console.log('getCommerceBuy');

            const type = 'commerceBuy'
            const list = await pools.Base_pool.promise().query(`SELECT * FROM list_advertisement WHERE type_of_service='${type}'`)

            if(list){return res.status(200).json(list)}
            else{return res.status(400).json('Ошибка базы данных') }
        } catch (e) {res.status(400).json('Ошибка ...'+e)}
    }

    async getCommerceRent(req, res){
        try {
            // console.log('getCommerceRent');

            const type = 'commerceRent'
            const list = await pools.Base_pool.promise().query(`SELECT * FROM list_advertisement WHERE type_of_service='${type}'`)

            if(list){return res.status(200).json(list)}
            else{return res.status(400).json('Ошибка базы данных') }
        } catch (e) {res.status(400).json('Ошибка ...'+e)}
    }
    
    async getMyAdvertisement(req, res){
        try {
            const number = req.params.number;
            // console.log('getMyAdvertisement');

            const list = await pools.Base_pool.promise().query(`SELECT * FROM list_advertisement WHERE owner_tel='${number}'`)
            
            if(list){return res.status(200).json(list)}
            else{return res.status(400).json('Ошибка базы данных') }
        } catch (e) {res.status(400).json('Ошибка ...'+e)}
    }


    async getInfo(req, res){
        try {
            res.json('server KUKU')
        } catch (e) {
            console.warn(e);
            res.status(400),json('getInfo error')
        }
    }
}

module.exports = new dataController()