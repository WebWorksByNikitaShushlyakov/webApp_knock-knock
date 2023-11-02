<template>
    <div class="this">
        <main v-if="AUTH_USER.name">
            <header class="title_block">
                <h2 >Личный кабинет</h2>
                <h5 @click="leaveAcc">Выйти из аккаунта</h5>
            </header>
            

            <div class="pers_info">
                <p>Пользователь</p>
                <h4>{{AUTH_USER.surname}} {{AUTH_USER.name}}</h4>
            </div>

            <div class="user_info">
                <p>Необходимые параметры</p>
                <h4>Номер телефона: {{AUTH_USER.number}}</h4>
                <h4>Статус: {{ AUTH_USER.typeOwner }}</h4>
            </div>

            <hr>

            

            <form class="advertisement" v-if="showAdvertisment" method="POST" enctype="multipart/form-data">
                <div class="cap_form title_block">
                    <h4>Объявление</h4>
                    <h5 @click="closeForm">Закрыть форму</h5>
                </div>
                

                <!-- Жилая - Коммерческая -->
                <select name="" id="" v-model="typeOfProperty">
                    <option value="null" disabled>У меня</option>
                    <option value="residential">Жилая недвижимость</option>
                    <option value="commercial">Коммерческая недвижимость</option>
                </select>

                <!-- Тип услуги -->
                <select name="" id="" v-if="typeOfProperty=='residential'" v-model="typeOfService">
                    <option value="null" disabled>Я хочу </option>
                    <option value="residentialBuy">Продать жилую недвижимость</option>
                    <option value="residentialLongRent">Сдать в длительную аренду</option>
                    <option value="residentialDailyRent">Сдать в посуточную аренду</option>
                </select>
                <select name="" id="" v-if="typeOfProperty=='commercial'" v-model="typeOfService">
                    <option value="null" disabled>Я хочу </option>
                    <option value="commerceBuy">Продать коммерческую недвижимость</option>
                    <option value="commerceRent">Сдать в длительную аренду</option>
                </select>


                <!-- Тип недвижимости -->
                <select name="" id="" v-if="typeOfProperty=='residential'" v-model="typeOfEstate">
                    <option value="null" disabled>А именно </option>
                    <option value="Квартира">Квартиру</option>
                    <option value="Дом">Дом</option>
                    <option value="Комната">Комнату</option>
                </select>
                <select name="" id="" v-if="typeOfProperty=='commercial'" v-model="typeOfEstate">
                    <option value="null" disabled>А именно </option>
                    <option value="Офис">Офис</option>
                    <option value="Тоговая площадь">Тоговая площадь</option>
                    <option value="Склад">Склад</option>
                    <option value="Свободное назначение">Свободное назначение</option>
                </select>

                <!-- Комнаты -->
                <input type="text" maxlength="2" placeholder="Комнат" v-model="rooms"
                v-if="typeOfEstate=='Квартира' || typeOfEstate=='Дом'">

                <!-- Площадь -->
                <input type="text" maxlength="3" placeholder="Площадь" v-model="scuare"
                v-if="typeOfProperty!=null">
                <span v-if="scuare">{{scuare}} м²</span>

                <!-- Описание -->
                <input type="text" placeholder="Заголовок" v-model="name">
                <input type="text" placeholder="Адрес" v-model="address">
                <input type="text" maxlength="9" :placeholder="priceTitle" v-model="this.price"> 
                <span v-if="price">{{moneyFormat(price)}} {{priceTitle.split(' ')[1]}}</span>
                <textarea name="" id="" cols="30" rows="10" placeholder="Описание" v-model="description"></textarea>
                

                <input name="image_file" type="file" @change='imageUpload' class="imageInput">
                
            </form>

            <button @click="showAdvertisment=!showAdvertisment" v-if="!showAdvertisment">Разместить объявление</button>

            <button @click="newAdvertisement" v-if="showAdvertisment">Отправить!</button>
            <p class='hint_text' :class="{error: error}">{{title}}</p>


            <div class="myList" v-if="my_list.length!=0">
                <h3 class="title_block">Мои объявления</h3>
                <div @click="chooseItem(item.id_advertisement, decodeTypeForRoute(item.type_of_service))"
                class="myList-card" v-for="(item, index) in my_list" :key="index">
                    <div class="item_header">
                        <h4>{{item.name}}</h4>
                        <h5>ID: {{item.id_advertisement}} <span @click.stop="deleteAdvertisement(item.id_advertisement)" title="Удалить объявление">X</span></h5>   
                    </div>
                    <div class="item_body">
                        <p>{{decodeTypeForTitle(item.type_of_service)}}</p>
                        <p>{{item.type_of_estate}}</p>
                        <p>{{item.address}}</p>
                        <p>{{moneyFormat(item.price)}} {{titleForMyList}}</p>
                    </div>
                    <div class="item_image">
                        <img :src="'http://31.172.66.193:5000/images/'+item.image_name" 
                        onerror="this.src='http://31.172.66.193:5000/images/house_logo.png'" alt="Изображение потерялось :(">
                    </div>
                    <!-- srcset="https://clipart-library.com/images_k/house-transparent-png/house-transparent-png-13.png" -->
                </div>
            </div>
            <h5 v-else style="color: var(--darkgray);">У вас пока нет активных объявлений</h5>
            
            
            
        </main>
        <h2 v-else>Только для авторизованных</h2>

    </div>
</template>

<script>
import {mapMutations, mapActions, mapGetters} from 'vuex'
import Advertisement from '@/models/models'
import {newAdvertisement, deleteAdvertisement} from '@/services/api.js'
import FormData from 'form-data'
import setFileds from '@/models/setFields'


export default {
    props:{
        AUTH_USER: {}
    },
    data() {
        return {
            showAdvertisment: false,
            priceTitle: 'Цена руб.',
            title: '',
            error: false,
            my_list: [],

            typeOfProperty: null,
            typeOfService: null,
            typeOfEstate: null,
            name: '',
            address: '',
            price: '',
            description: '',
            image: '',
            rooms: '',
            scuare: '',

            titleForMyList: '',
        }
    },
    methods: {
        ...mapMutations(['clear_AUTH']),
        ...mapActions(['fetchOriginalList']),  
        // Закрыть форму
        closeForm(){
            this.showAdvertisment = false
        },
        chooseItem(id, route){
            this.$router.push(`${route}/estate-item/${id}`)
        },
        // Расшифровка типа услуги (ДЛЯ ПОЛЬЗОВАТЕЛЯ)
        decodeTypeForTitle(type){
            switch (type) {
                case 'residentialBuy':
                    this.titleForMyList = 'руб.'
                    return 'Продажа жилой недвижимости'
                    break;
                case 'residentialLongRent':
                    this.titleForMyList = 'руб/мес.'
                    return 'Долгосрочная аренда жилой недвижимости'
                    break;
                case 'residentialDailyRent':
                    this.titleForMyList = 'руб/сут.'
                    return 'Посуточная аренда жилой недвижимости'
                    break;
                case 'commerceBuy':
                    this.titleForMyList = 'руб.'
                    return 'Продажа коммерческой недвижимости'
                    break;
                case 'commerceRent':
                    this.titleForMyList = 'руб/мес.'
                    return 'Аренда коммерческой недвижимости'
                    break;
                default:
                    break;
            }
        },
        // Расшифровка типа услуги (ДЛЯ СЕРВЕРА)
        decodeTypeForRoute(type){
            switch (type) {
                case 'residentialBuy':
                    return '/residential/buy/'
                    break;
                case 'residentialLongRent':
                    return '/residential/long-rent/'
                    break;
                case 'residentialDailyRent':          
                    return '/residential/daily-rent/'
                    break;
                case 'commerceBuy':
                    return '/commerce/buy/'
                    break;
                case 'commerceRent':
                    return '/commerce/rent/'
                    break;
                default:
                    break;
            }
        },
        // Покинуть аккаунт
        leaveAcc(){
            document.cookie = `ACCESS_TOKEN=`
            this.clear_AUTH()
            console.log('Авторизация отключена');
            this.$router.push('/auth')
        },
        // Возвращает денежный формат
        moneyFormat(n) {
            return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',');
        },  
        // Подгрузка файла в модель
        imageUpload(){
            const file = document.querySelector('.imageInput').files[0]
            this.image = file
        },
        // Попытка разместить объявление
        newAdvertisement(){
            console.log('Checking data...');
            if(this.typeOfProperty
                && this.typeOfService
                && this.typeOfEstate
                && this.name
                && this.address
                && this.price
                && this.description
                && this.image
                && this.scuare){
                    this.title = 'Попытка отправки...'
                    this.error = false
                    // Создаем объект нового объявления
                    const OBJECT_Advertisement = new Advertisement(
                        this.AUTH_USER.name,
                        this.AUTH_USER.number,
                        this.AUTH_USER.typeOwner,
                        this.name,
                        this.address,
                        this.price,
                        this.description,
                        this.rooms,
                        this.typeOfEstate,
                        this.typeOfService,
                        this.scuare,
                    )

                    // Создание экземпляра FormData для передачи данных
                    let formData = new FormData();
                    // Заполнение полей FormData из объекта OBJECT_Advertisement
                    setFileds(OBJECT_Advertisement, formData)
                    // Заполнение поля file
                    formData.append('file', this.image)

                    // Отправка
                    this.newAdvertisement_method(formData)
                }else{
                    this.title = 'Проверьте данные.'
                    this.error = true
                }
        },
        // Отправка данных для нового объявления
        async newAdvertisement_method(formData){
            console.log('Attempt to add...');
            await newAdvertisement(formData)
            .then((response) => {
                this.title = response.data;
                this.success_clearForm()
                this.getMyAdvertisement()
            })
            .catch((e)=>{
                this.title = e.response.data;
                this.error = true
            })
        },
        // Очистка формы при успешной отправке
        success_clearForm(){
            this.showAdvertisment= false
            this.priceTitle= 'Цена руб.'
            this.title= ''
            this.error= false

            this.typeOfProperty=null
            this.typeOfService= null
            this.typeOfEstate= null
            this.name= ''
            this.address= ''
            this.price= ''
            this.description= ''
            this.image= ''
            this.rooms= ''
            this.scuare= ''
        },
        // Получение списка объявлений данного пользователя
        async getMyAdvertisement(){
            // Запрос на обновление требуемых данных
            await this.fetchOriginalList('/my-advertisement/'+ this.AUTH_USER.number)    
            // Запрос на получение требуемых данных
            const OBJECT_INFO = await this.INFO_originalList
            // Парcинг данных из объекта
            this.my_list = OBJECT_INFO.originalListEstates
        },
        // 
        async deleteAdvertisement(id){
            if(confirm(`Вы хотите удалить объявление с ID: ${id}?`)){
                console.log('Attempt to delete...');
                const form = {
                        number: this.AUTH_USER.number,
                        id_advertisement: id
                    }
                    await deleteAdvertisement(form)
                    .then((response) => {
                        alert(response.data);
                        this.getMyAdvertisement();
                    })
                    .catch((e)=>{
                        alert(e.response.data);
                    }) 
            }
        },
    },
    mounted(){
        setTimeout(()=>{
            if(Object.keys(this.AUTH_USER).length==0){this.$router.push('/auth')}
        }, 1000)       
        this.getMyAdvertisement()
    },
    watch: {
        'AUTH_USER.number'(){
            if(this.my_list.length==0)this.getMyAdvertisement()
        },
        typeOfProperty(){
            this.typeOfService = null;
            this.typeOfEstate = null;
        },
        price(){
            const regex = /^[1-9](\d{0,})$/;
            if(this.price!=0){
                if(!String(this.price).match(regex))
                {this.price=(this.price).substring(0, (this.price).length-1)}
            }            
        },
        rooms(){
            const regex = /^[1-9](\d{0,})$/;
            if(this.rooms!=0){
                if(!String(this.rooms).match(regex))
                {this.rooms=(this.rooms).substring(0, (this.rooms).length-1)}
            } 
        },
        typeOfService(){
            const value = this.typeOfService;
            if(value=='residentialBuy' || value=='commerceBuy'){
                this.priceTitle = 'Цена руб.'
            }else if(value=='residentialLongRent' || value=='commerceRent'){
                this.priceTitle = 'Цена руб/мес.'
            }else if(value=='residentialDailyRent'){
                this.priceTitle = 'Цена руб/сут.'
            }else{this.priceTitle = 'Цена'}
        }
    },
    computed:{
        // Отслеживание изменений состояния getOriginalList внутри getters 
        ...mapGetters(['INFO_originalList']),
    }
}
</script>





<style scoped>
main{
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
}
.advertisement{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.advertisement input[type=text],
.advertisement textarea,
.advertisement select option,
.advertisement select, span{
    padding: 5px 10px;
    border: 0;
    box-shadow: 0 0 2px var(--darkgray);
    transition-duration: 0.2s; 
    font-size: 1rem;
    color: var(--black);
    font-family: mainFont-sans_serif;
}
span{
    box-shadow: none;
}
.advertisement textarea{
    max-width: 100%;
    min-width: 100%;
    min-height: 100px;
    max-height: 220px;
}
input{
    font-size: 1rem;
    transition-duration: 0.2s; 
}
input[type=text]:focus,
textarea:focus, 
select:focus{
    outline: 0;
    box-shadow: 0 0 5px var(--blue);
}


.hint_text{
    color: var(--green);
}
.error{
    color: var(--red);
}
hr{
    border: 1px solid var(--gray);
}



button{
    background-color: var(--blue);
    padding: 10px 0;
    width: 100%;
}
button:hover{
    background-color: var(--darkblue);
}

header, .cap_form{
    display: flex;
    flex-direction: column;
    align-items: start;
}
header h5,
.cap_form h5{
    cursor: pointer;
    color: var(--darkgray);
    position: relative;
    user-select: none;
}
header h5::after,
.cap_form h5::after{
    content: '';
    position: absolute;
    width: 0%;
    height: 1px;
    background-color: var(--darkgray);
    bottom: 0;
    left: 50%;
    transition-duration: 0.2s;
}
header h5:hover::after,
.cap_form h5:hover::after{
    left: 0;
    width: 100%;
}

/*myList*/
.myList{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.myList-card{
    box-shadow: 0 0 3px var(--darkgray);
    padding: 10px;
    transition-duration: 0.3s;
    cursor: pointer;
    border-radius: 5px;
    opacity: 1;

    display: grid;
    gap: 5px;
    grid-template: [start] "header header" auto [row2] 
                  [row2] "body image"  200px [row-end] / 3fr 1fr;
}
.myList-card:hover{
    box-shadow: 0 0 5px var(--darkgray);
}
.item_header{
    grid-area:header;
    display: flex;
    justify-content: space-between;
    align-items:center;
}
.item_header h4{
    flex-basis: 72%;
}
.item_header span{
    padding: 5px;
    border: 1px solid var(--gray);
    border-radius: 5px;
    color: var(--gray);
    transition-duration: 0.3s;
}
.item_header span:hover{
    border: 1px solid var(--darkgray);
    color: var(--darkgray)
}
.item_body{
    grid-area:body;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.item_image{
    grid-area:image;
    text-align: center;
    overflow: hidden;
}
.item_image img{
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 5px;
}

@media (max-width: 576px){
  .myList-card{
    box-shadow: 0 0 3px var(--darkgray);
    padding: 10px;
    transition-duration: 0.3s;
    cursor: pointer;
    border-radius: 5px;
    opacity: 1;

    display: grid;
    gap: 15px;
    grid-template:  [start] "header" auto [row2] 
                    [row2] "body"  auto [row3]
                    [row3] "image"  200px [row-end] / 1fr;
    }
}

@media (max-width: 767px){
    input, li{
        font-size: 1.6rem;
    }
    main{
        gap: 15px;
    }
}
@media (max-width: 400px){
    .title_block{
        text-align: center;
        align-items: center;
    }
    .advertisement input[type=text],
    .advertisement input,
    .advertisement textarea,
    .advertisement select option,
    .advertisement select, span{
        font-size: 1.2rem;
    }
    .hint_text{text-align:center;}
}
</style>