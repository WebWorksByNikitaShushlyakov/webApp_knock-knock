<template>
    <div>
        <nav class="menuFilterBuy">
            <article>
                <!-- Тип недвижимости -->
                <h2 @click="stateFilter[0]=!stateFilter[0]">{{typeValue}}</h2>
                <ul class="type" :class="stateFilter[0] ? 'isClose' : ''">
                    <li><input type="radio" name="type" value="Квартиру"     @change="typeValue='Квартиру'" checked id="t1"> <label for="t1">Квартиру</label> </li>
                    <li><input type="radio" name="type" value="Дом"          @change="typeValue='Дом'" id="t2"> <label for="t2">Дом</label> </li>
                    <li><input type="radio" name="type" value="Комнату"      @change="typeValue='Комнату'" id="t3"> <label for="t3">Комнату</label> </li>
                </ul>
            </article>
            <article>
                <!-- Цена -->
                <h2 @click="stateFilter[1]=!stateFilter[1]">Цена
                    <span v-if="priceValueFrom && priceValueTo">
                        : От {{moneyFormat(priceValueFrom)}} До {{moneyFormat(priceValueTo)}} {{ titleUnderPrice }}.
                    </span>
                </h2>
                <ul class="price" :class="stateFilter[1] ? 'isClose' : ''">
                    <li><input type="text" size="4" maxlength="9" name="price" placeholder="От" v-model="priceValueFrom"></li>
                    <li><input type="text" size="4" maxlength="9" name="price" placeholder="До" v-model="priceValueTo"></li>
                </ul>
            </article>
            <article :class="typeValue=='Комнату' || typeValue=='Дом'  ? 'isHidden' : ''">
                <!-- Кол-во комнат -->
                <h2 @click="stateFilter[2]=!stateFilter[2]">
                    Комнат
                </h2>
                <ul class="rooms" :class="stateFilter[2] ? 'isClose' : ''">
                    <li title="1 команата" @click="roomsValue['1']=!roomsValue['1']" :class="roomsValue['1'] ? 'active': ''">1</li>
                    <li title="2 команаты" @click="roomsValue['2']=!roomsValue['2']" :class="roomsValue['2'] ? 'active': ''">2</li>
                    <li title="3 команаты" @click="roomsValue['3']=!roomsValue['3']" :class="roomsValue['3'] ? 'active': ''">3</li>
                    <li title="4 команаты" @click="roomsValue['4']=!roomsValue['4']" :class="roomsValue['4'] ? 'active': ''">4</li>
                    <li title="5 и более команат" @click="roomsValue['5+']=!roomsValue['5+']" :class="roomsValue['5+'] ? 'active': ''">5+</li>
                    <li title="Студия" @click="roomsValue['apartment']=!roomsValue['apartment']" :class="roomsValue['apartment'] ? 'active': ''">S</li>
                </ul>
            </article>
        </nav>
        
        <button id='findButton' @click="getFiltred">Найти</button>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
    data() {
        return {
            stateFilter: [true, true, true],
            
            typeValue: 'Квартиру',

            priceValueFrom: 1,
            priceValueTo: 100000,
            titleUnderPrice: '',

            roomsValue: {
                '1': true,
                '2': true,
                '3': true,
                '4': false,
                '5+': false,
                'apartment': false
            },

            // Зависит от запроса родителя
            originalList: [],
            filtredList: [],
        }
    },
    methods: {
        ...mapActions(['fetchOriginalList']),  
        // Преобразователь в денежный формат
        moneyFormat(n) {
            return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',');
        },  
        
        // Фильтрация списка и передача в ListEstate
        getFiltred(){
            this.filtredList = this.originalList.filter((item)=>{
               let type=false, price=false, rooms=false
               let arrRooms = Object.values(this.roomsValue)
               if(item.type_of_estate==this.getTypeForFilter(this.typeValue))type=true
               if(item.price>=this.priceValueFrom && item.price<=this.priceValueTo)price=true
               if(item.type_of_estate=='Комната'){rooms=true}
               else{
                arrRooms.forEach((value,index)=>{
                    if(value){
                        if(index<4){
                            if(item.rooms==index+1){rooms=true}
                        }else{
                            if(item.rooms>=5){rooms=true}
                        }
                    }
                })
                }
               if(type && price && rooms)return true
            })
            this.$emit('updateFilter', this.filtredList)
        },

        // Преобразователь категорий
        getTypeForFilter(typeValue){
            switch (typeValue) {
                case 'Квартиру':
                    return 'Квартира'
                case 'Дом':
                    return 'Дом'
                case 'Комнату':
                    return 'Комната'
                default:
                    break;
            }
        },

    },
    watch: {
        // Проверка нижнего порога Цены
        priceValueFrom(){
            const regex = /^[1-9](\d{0,})$/;
            if(!String(this.priceValueTo).match(regex))
            {this.priceValueFrom=(this.priceValueFrom).substring(0, (this.priceValueFrom).length-1)}
            if(+this.priceValueFrom>+this.priceValueTo){this.priceValueTo=this.priceValueFrom}
        },
        // Проверка верхнего порога Цены
        priceValueTo(){
            const regex = /^[1-9](\d{0,})$/;
            if(this.priceValueTo!=0){
                if(!String(this.priceValueTo).match(regex))
                {this.priceValueTo=(this.priceValueTo).substring(0, (this.priceValueTo).length-1)}
            }  
        },
        titleUnderPrice(){
            this.$emit('updateTitleUnderPrice', this.titleUnderPrice)
        }
    },
    async mounted(){
            // Слушатель для закрытия элементов фильтра
            const allFilters = document.querySelectorAll('article')
            document.addEventListener('click', (e)=>{
                let curIndexMenu = -1
                let curElem = e.target.closest('article')
                if(curElem){
                    allFilters.forEach((elem, index)=>{
                        if(elem==curElem){curIndexMenu=index}
                    })
                };
                for(let i=0; i<allFilters.length; i++){
                    if(curIndexMenu!=i){this.stateFilter[i]=true}
                }
            })
            
            // Запрос на обновление требуемых данных
            await this.fetchOriginalList(this.$route.path)    
            // Запрос на получение требуемых данных
            const OBJECT_INFO = await this.INFO_originalList
            
            // Парcинг данных из объекта
            this.priceValueTo = OBJECT_INFO.priceValueTo
            this.titleUnderPrice = OBJECT_INFO.titleUnderPrice
            this.originalList = OBJECT_INFO.originalListEstates
            
            // Фильтрация при запуске компонента
            this.getFiltred()  
    },
    computed:{
        // Отслеживание изменений состояния getOriginalList внутри getters 
        ...mapGetters(['INFO_originalList']),
    }
}
</script>






<style scoped>
nav{
    border-radius: 5px;
    display: flex;
    box-shadow: 0 0 10px var(--gray);
    margin: 20px 0;
}
@media (max-width: 767px){
    nav{
        display: flex;
        flex-direction: column;
    }
}
article{
    flex: 1 1 100%;
}
article h2{
    padding: 10px 20px;
    font-size: 18px;
    
    height: 100%;
    border: 1px solid var(--gray);
    transition-duration: 0.3s;

    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
article:first-child  h2{
    border-radius: 5px 0 0 5px;
}
article h2:hover{
    background-color: var(--lightblue);
}
article ul{
    background-color: var(--gray);
    position: absolute;
    list-style: none;
    padding: 20px;
    border-radius: 5px;
    transform: translate(10px, 10px);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.339);
}
input[type=text]{
    font-size: 14px;
    border: 1px solid var(--darkgray);
    border-radius: 5px;
    width: 100%;
    outline: 0;
    transition-duration: 0.5s;
}
input[type=text]:hover{
    border: 1px solid black;
}
input[type=text]:focus{
    border: 1px solid var(--violet);
}

/* Фильтр Тип*/
.typeBuy li{
    margin-bottom: 10px;
    color: var(--darkgray);
}
.typeBuy li:last-child{
    margin-bottom: 0px;
}


/* Фильтр Стоимость*/
.price{
    display: flex;
    gap: 10px;
    align-items: center;
}
.price li{
    position: relative;
}
.price li input{
    padding: 7px 24px 7px 7px;
}
.price li::after{
    content: '₽';
    position: absolute;
    right: 0;
    bottom: 2px;
    font-size: 14px;
    color: var(--darkgray);

    height: 100%;
    width: 24px;

    display: flex;
    justify-content: center;
    align-items: center;
}

/* Фильтр Комнаты */
.rooms{
    display: flex;
    gap: 5px;
    justify-content: stretch;
}
.rooms li{
    width: 30px;
    height: 30px;
    border: 1px solid var(--darkgray);
    color: var(--darkgray);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    transition-duration: 0.2s;
}
.rooms .active{
    background-color: var(--lightblue);
    color: var(--violet);
}
/* Скрыть фильтр */
.isClose{
    display: none !important;
}
button{
    background-color: var(--blue);
    padding: 10px 0;
    width: 100%;
}
button:hover{
    background-color: var(--darkblue);
}


/*Класс для скрытия фильтра комнат (для дома, комнаты)*/
.isHidden{
    display: none;
}

@media (max-width: 576px){
    article ul li, .price li input{
        font-size: 1.4rem;
    }
    .rooms li{
        width: 35px;
        height: 35px;
        flex-wrap:wrap;
    }
    .price li::after{
         font-size: 1.4rem;
    }
}

@media (min-width: 1920px){
    article h2,
    article ul,
    .rooms li,
    input[type=text]{font-size: 1.6rem;}
    input[type=text]{width: 15vw;}
    .price, .rooms{gap: 20px;}
    .price li::after{
        font-size: 1.6rem;
        right: 5px;
    }
    .rooms li{
        width: 50px;
        height: 50px;
    }
    .price li input{padding: 7px 50px 7px 7px;}
}
@media (min-width: 1500px) and (max-width: 1920px){
    article h2,
    article ul,
    .rooms li,
    input[type=text]{font-size: 1.4rem;}
    input[type=text]{width: 15vw;}
    .price, .rooms{gap: 10px;}
    .price li::after{
        font-size: 1.4rem;
        right: 5px;
    }
    .rooms li{
        width: 50px;
        height: 50px;
    }
    .price li input{padding: 7px 50px 7px 7px;}
}
@media (min-width: 1000px) and (max-width: 1500px){
    article h2,
    article ul,
    .rooms li,
    input[type=text]{font-size: 1.2rem;}
    input[type=text]{width: 15vw;}
    .price, .rooms{gap: 10px;}
    .price li::after{
        font-size: 1.4rem;
        right: 5px;
    }
    article{
        flex: 1 1 100%;
        max-width: 33.33%;
    }
    .rooms li{
        width: 40px;
        height: 40px;
    }
    .price li input{padding: 7px 50px 7px 7px;}
}
@media (min-width: 768px) and (max-width: 1000px){
  article h2,
    article ul,
    .rooms li,
    input[type=text]{font-size: 1.2rem;}
    input[type=text]{width: 15vw;}
    .price, .rooms{gap: 10px;}
    .price li::after{
        font-size: 1.4rem;
        right: 5px;
    }
    article{
        flex: 1 1 100%;
        max-width: 33.33%;
    }
    .rooms li{
        width: 40px;
        height: 40px;
    }
    .price li input{padding: 7px 50px 7px 7px;}
}
</style>