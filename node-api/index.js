const fileUpload = require('express-fileupload');
const path = require('path')
const express = require('express')
const mysql = require("mysql2");
const pools = require('./pools/pools')

const authRouter = require('./authRouter')
const dataRouter = require('./dataRouter')

const PORT = process.env.PORT || 5000

const app = express()
app.use(fileUpload()); //Для загрузки файлов
app.use(express.json())
app.use(express.static('public')) //Директория храния изображений

app.use("/api",authRouter)
app.use("/api/getData",dataRouter)

const _dirname = path.resolve()
app.use(express.static(_dirname))
app.use(express.static(path.join(_dirname, '../app-vue/dist')));



// Базовая страница (Путь к приложению VUE)
app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, '../app-vue/dist/index.html'));
})
app.get('/residential/buy', (req, res) => {
    res.sendFile(path.join(_dirname, '../app-vue/dist/index.html'));
})



// Запуск серверного приложения
const start = () => {
    try {
        app.listen(PORT, ()=>{console.log(`Server working on ${PORT}`);})
    } catch (error) {
        console.log(error);
    }
}
start()
