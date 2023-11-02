const pools = require('./pools/pools')
const User = require('./models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('./config')
const crypto = require('crypto');


// Генератор токена
const generateAccessToken = (id, role) =>{
    const payload = {
        id, role
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController{
    // Регистрация пользователя
    async registration(req, res){
        try {
            // Проверка ошибок ввода
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                console.log('~~~ Error in Registration: ', errors.errors[0].msg);
                return res.status(400).json(`${errors.errors[0].msg}`)
            }

            // Получение данных пользователя и их проверка
            const {number, password, ...other} = req.body
            // console.log(number, password, other);
            const candidate = await pools.Root_pool.promise().query(`SELECT * FROM user WHERE number='${number}'`)     
            if(candidate[0].length){return res.status(400).json('Пользователь с таким номером телефона уже существует')}

            // Если логин свободен, хэшируем пароль и отправляем нового пользователя в БД
            const hashPasword = bcrypt.hashSync(password, 7);
            const sql = "INSERT INTO `user` (`id`, `number`, `password`, `role`, `typeOwner`, `surname`, `name`) VALUES"
            const user = new User.User(number, hashPasword, other)
            await pools.Root_pool.promise().query(sql+user.getUserInfo())
            
            return res.json('Пользователь зарегистрирован')
        } catch (e) {res.status(400).json('Ошибка регистрации'+e)}
    }

    async login(req, res){
        try {
            // Получение данных пользователя и их проверка
            const {number, password} = req.body
            
            const current_user = await pools.User_pool.promise().query(`SELECT * FROM user WHERE number='${number}'`)  
            if(!current_user[0].length){return res.status(400).json(`Пользователь с номером ${number} не найден`)}

            // Вытаскиваем объект пользователя
            const user_object = current_user[0][0]

            // Проверяем пароль и хэш пользователя из бд
            const validPassword = bcrypt.compareSync(password, user_object.password)
            if(!validPassword){return res.status(400).json(`Введен неверный пароль`)}

            // Генерируем токен
            const token = generateAccessToken(user_object.id, user_object.role)
            
            return res.status(200).json(token)    
        } catch (e) {res.status(400).json('Ошибка авторизации'+e)}
    }

    async checkLogin(req, res){
        try {
            const {ACCESS_TOKEN} = req.body
            if(ACCESS_TOKEN){
                const decodeDate = jwt.verify(ACCESS_TOKEN, secret)
                const authorized_user = await pools.User_pool.promise().query(`SELECT * FROM user WHERE id='${decodeDate.id}'`)  
                // console.log(authorized_user[0][0]);
                if(authorized_user[0][0]){
                    const other = {
                        typeOwner:authorized_user[0][0].typeOwner,
                        surname:authorized_user[0][0].surname,
                        name:authorized_user[0][0].name,
                    }
                    const USER = new User.User(authorized_user[0][0].number,'', other)
                    return res.status(200).json(USER.getAuthInfo())
                }else{
                    return res.status(400).json(`Пользователь удален`)
                }
            }else{
                return res.status(400).json(`Вы не авторизованны`)
            }
        } catch (e) {
            // console.log(e);
            res.status(400).json('Ошибка авторизации')
        }
    }
    

    async newAdvertisement(req, res){
        try {
            // Проверка на наличие файла
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('Файл не обнаружен');
            }
            // Получение данных и файла
            const info = req.body; 
            const file = req.files.file
            const name_file = crypto.randomBytes(20).toString('hex') + '.' + file.mimetype.split('/')[1];
            
            const sql = "INSERT INTO `list_advertisement` (`id_advertisement`, `type_of_service`, `type_of_estate`, `owner_name`, `owner_tel`, `owner_type`, `name`, `address`, `price`, `description`, `rooms`, `square`, `image_name`) VALUES"
            const resDB = await pools.User_pool.promise().query(sql+ `(NULL, '${info.type_of_service}', '${info.type_of_estate}', '${info.owner_name}', 
                                                        '${info.owner_tel}', '${info.owner_type}', '${info.name}', '${info.address}', '${info.price}', 
                                                        '${info.description}', '${+info.rooms}', '${+info.square}', '${name_file}')`);  
            
            // Перемещение изображения в локальную директорию сервера
            file.mv(`public/images/${name_file}`, err => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.status(200).json('Объявление успешно сформировано!');
            });
        } catch (e) {
            console.warn(e);
            res.status(400).json('Ошибка при загрузке. Возможно, потеряно соединение с БД.')
        }
    }

    async deleteAdvertisement(req, res){
        try {       
            const {number, id_advertisement} = req.body; 
            
            const advertisement = await pools.User_pool.promise().query(`SELECT * FROM list_advertisement WHERE owner_tel='${number}'`)

            if(number==advertisement[0][0].owner_tel){
                await pools.User_pool.promise().query(`DELETE FROM list_advertisement WHERE list_advertisement.id_advertisement = '${id_advertisement}'`) 
                .then(() => {
                    return res.status(200).json('Объявление удалено');
                })
                .catch(error => {
                    return res.status(500).json(err);
                })
            }
        } catch (e) {
            console.warn(e);
            res.status(400).json('Ошибка при загрузке. Возможно, потеряно соединение с БД.')
        }
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

module.exports = new authController()