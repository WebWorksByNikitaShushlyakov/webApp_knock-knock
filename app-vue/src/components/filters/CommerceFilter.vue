<template>
    <div>
        <nav class="menuFilterBuy">
            <article>
                <!-- Тип недвижимости -->
                <h2 @click="stateFilter[0]=!stateFilter[0]">{{typeValue}}</h2>
                <ul class="type" :class="stateFilter[0] ? 'isClose' : ''">
                    <li><input type="radio" name="type" value="Офис" @change="typeValue='Офис'" checked id="t1"> <label for="t1">Офис</label> </li>
                    <li><input type="radio" name="type" value="Торговая площадь" @change="typeValue='Торговая площадь'" id="t2"> <label for="t2">Торговая площадь</label> </li>
                    <li><input type="radio" name="type" value="Склад" @change="typeValue='Склад'" id="t3"> <label for="t3">Склад</label> </li>
                    <li><input type="radio" name="type" value="Свободное назначение" @change="typeValue='Свободное назначение'" id="t4"> <label for="t4">Свободное назначение</label> </li>
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
                    <li><input type="text" size="4" maxlength="9" name="price" placeholder="До"  v-model="priceValueTo"></li>
                </ul>
            </article>
            <article>
                <!-- Кол-во комнат -->
                <h2 @click="stateFilter[2]=!stateFilter[2]">
                    Площадь
                    <span v-if="squareValueFrom && squareValueTo">
                        : От {{squareValueFrom}} До {{squareValueTo}} м².
                    </span>
                </h2>
                <ul class="square" :class="stateFilter[2] ? 'isClose' : ''">
                    <li><input type="text" size="4" maxlength="9" name="square" placeholder="От" v-model="squareValueFrom"></li>
                    <li><input type="text" size="4" maxlength="9" name="square" placeholder="До"  v-model="squareValueTo"></li>
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
            
            typeValue: 'Офис',

            priceValueFrom: 1000,
            priceValueTo: 100000,
            titleUnderPrice: '',

            squareValueFrom: 1,
            squareValueTo: 1000,


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
               let type=false, price=false, square=false
               
               if(item.type_of_estate==this.typeValue)type=true
               if(item.price>=this.priceValueFrom && item.price<=this.priceValueTo)price=true
               if(item.square>=this.squareValueFrom && item.square<=this.squareValueTo)square=true
               
               if(type && price && square)return true
            })
            
            this.$emit('updateFilter', this.filtredList)
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
    overflow: hidden;
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
    top: 0;
    font-size: 14px;
    color: var(--darkgray);

    height: 100%;
    width: 24px;

    display: flex;
    justify-content: center;
    align-items: center;
}

/* Площадь */
.square{
    display: flex;
    gap: 10px;
    align-items: center;
}
.square li{
    position: relative;
}
.square li input{
    padding: 7px 24px 7px 7px;
}
.square li::after{
    content: 'м²';
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
    color: var(--darkgray);

    height: 100%;
    width: 24px;

    display: flex;
    justify-content: center;
    align-items: center;
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
    article ul li, .price li input, .square li input{
        font-size: 1.4rem;
    }
    .square li::after{
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
    input[type=text]{width: 12vw;}
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
    input[type=text]{width: 12vw;}
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