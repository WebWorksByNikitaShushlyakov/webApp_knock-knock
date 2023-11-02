<template>
    <div class="this">
        <article v-if="Object.keys(this.currentObject).length!=0">
            <!-- ОПИСАНИЕ ОБЪЕКТА -->
            <div class="info_box">
                <div class="title">
                    <h2>{{currentObject.name}}</h2>
                    <span>{{decodeTypeForTitle(currentObject.type_of_service)}}</span>
                    <h6>{{currentObject.address}}</h6>
                </div>

                <div class="img_container">
                    <img :src="'http://31.172.66.193:5000/images/'+currentObject.image_name"
                    onerror="this.src='http://31.172.66.193:5000/images/house_logo.png'" alt="">
                </div>

                <div class="desc">
                    <ul class="add_info">
                        <li v-if="!isCommerce">Комнат: <span>{{currentObject.rooms}}</span></li>
                        <li>Общая площадь: <span>{{currentObject.square}} м²</span></li>
                    </ul>
                    <p>{{currentObject.description}}</p>
                </div>
            </div>
            <!-- КОНТАКТНАЯ ИНФОРМАЦИЯ -->
            <div class="contact_box">
                <div class="price">
                    <h3>{{moneyFormat(currentObject.price)}}</h3>
                    <h3>{{titleUnderPrice}}</h3>
                </div>

                <!-- <div class="agency" v-if="currentObject.agency_image">
                    <img :src="currentObject.agency_image" alt="">
                    <h6>Агенство недвижимости</h6>
                    <h4>{{currentObject.agency_name}}</h4>
                </div> -->

                <div class="contact">
                    <img :src="'http://31.172.66.193:5000/images/user_profile.png'" alt="">
                    <h6>{{currentObject.owner_type}}</h6>
                    <h4>{{currentObject.owner_name}}</h4>
                    <button @click="telIsOpen=true" v-if="!telIsOpen">Показать номер</button>
                </div>

                <div class="number" v-if="telIsOpen">
                    <h6>Чтобы связаться с представителем, звоните:</h6>
                    <h4>{{telFormat(currentObject.owner_tel)}}</h4>
                </div>
            </div>        
            
        </article> 
        <div class="loading" v-else>
            <img v-if="!flagNotFound" src="http://31.172.66.193:5173/public/media/images/loading.gif" alt="">
            <span v-else>{{titleNotFound}}</span>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
    data() {
        return {
            currentObject: {},
            titleUnderPrice: '',
            telIsOpen: false,
            isCommerce: false
        }
    },
    methods: {
        ...mapActions(['fetchOriginalList']), 
        async startComponent(){
            const typeOfService = ((this.$route.fullPath).split('/'))

            if(typeOfService[1]=='commerce')this.isCommerce=true;

            const ID = this.$route.params.id
            // Запрос на обновление требуемых данных
            await this.fetchOriginalList('/'+typeOfService[1]+'/'+typeOfService[2])    
            // Запрос на получение требуемых данных
            const OBJECT_INFO = await this.INFO_originalList
            // Получить список недвижимости из данных
            const list = OBJECT_INFO.originalListEstates
            this.titleUnderPrice=OBJECT_INFO.titleUnderPrice
            // Получить выбранный объект недвижимости

            list.forEach(object => {
                if(object.id_advertisement==ID)this.currentObject=object
            });
            if(Object.keys(this.currentObject).length==0)this.$router.push('/')
        },
        decodeTypeForTitle(type){
            switch (type) {
                case 'residentialBuy':
                    return 'Продажа жилой недвижимости'
                    break;
                case 'residentialLongRent':
                    return 'Долгосрочная аренда жилой недвижимости'
                    break;
                case 'residentialDailyRent':
                    return 'Посуточная аренда жилой недвижимости'
                    break;
                case 'commerceBuy':
                    return 'Продажа коммерческой недвижимости'
                    break;
                case 'commerceRent':
                    return 'Аренда коммерческой недвижимости'
                    break;
                default:
                    break;
            }
        },
        moneyFormat(n) {
            return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',');
        },  
        telFormat(n){
            let string = ('' + n).replace(/\D/g, '');
            let match = string.match(/^(7|8)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
            if (match) {
                let firstSym = (match[1] ? '+7 ' : '')
                return [firstSym, '(', match[2], ') ', match[3], '-', match[4], '-', match[5]].join('')
            }
            return null;
        } 
    },
    mounted() {
        this.startComponent()
    },
    computed:{
        // Отслеживание изменений состояния getOriginalList внутри getters 
        ...mapGetters(['INFO_originalList']),
    }
}
</script>

<style scoped>
h2{
    color: var(--blue);
}
h6{
    color: var(--darkgray);
}
.number h4{
    color: var(--blue);
}


article{
    display: grid;
    column-gap: 20px;
    grid-template-columns: 3fr 1fr;
}
article >*{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.info_box >*, 
.contact_box >*{
    box-shadow: 0 0 2px var(--darkgray);
    
    border-radius: 10px;
    padding: 10px;
}
.contact_box >*{
    text-align: center;
}


.title{
    align-items: start;
    display:flex;
    flex-direction: column;
    gap: 10px;
}
.price{

}
.img_container{
    padding: 0px;
    background-color: transparent;
    width: 100%;
    max-height: 40vw;
    border: 1px solid var(--gray);
    border-radius: 10px;
    background-color: var(--gray);
}
.desc{
    align-items: start;
}
.add_info{
    margin-left: 0px;
    list-style: none;
    margin-bottom: 20px;
    color: var(--blue);
    font-size: 1.3rem;
}
.add_info span{
    color: var(--darkblue);
}
.add_info li{
    padding-left: 12px;
    position: relative;
}
.add_info li:after{
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-40%);
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: var(--darkblue);
}



.agency{

}
.contact{

}
.number{
    text-align: center;
}


.img_container img{
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
}
.agency img,
.contact img{
    width: 40%;
    object-fit: contain;
    border-radius: 10px;
}


button{
    background-color: var(--blue);
    padding: 10px 20px;
    width: 100%;
    margin-top: 20px;
    animation: animButton 1s alternate infinite;
}
button:hover{
    background-color: var(--darkblue); 
    animation: none
}
@keyframes animButton{
    0%{box-shadow: 0 -20px 20px var(--darkblue) inset;}
    100%{box-shadow: 0 -20px 20px var(--blue) inset;}
}

.price{
    animation: animPrice 3s alternate infinite;
}
@keyframes animPrice{
    0%{color: black}
    100%{color: var(--blue)}
}

@media (max-width: 1000px){
    h4{font-size: 2.2vw;}
}
@media (max-width: 576px){
    h4{font-size: 1.5rem;}
    .price{display: flex; justify-content: center; gap:8px;}
    article{
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        
    }
    .contact_box{
        
        display: flex;
        flex-direction: column;
    } 
    .contact_box img{
        display: none;
    }
    .img_container{
        padding: 0px;
        width: 100%;
        max-height: 100%;
        box-shadow: none;
        border: 0;
    }
}
</style>