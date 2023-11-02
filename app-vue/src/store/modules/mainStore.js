import service from '@/services/temporary_data'
import {getResidentialBuy, getResidentialLongRent, getResidentialDailyRent, getCommerceBuy ,getCommerceRent, getMyAdvertisement} from '@/services/api.js'

export default {
    // actions - асинхронные действия для изменения состояния. Например для связи с backend.
    actions:{
        delay(){
            // console.log('Loading..');
            return new Promise(r=> setTimeout(()=>r(), 1000))
        },
        async fetchOriginalList(context, type){
            // Искуственная задержка
            // await this.dispatch('delay')
            let number = 0
            if(type.split('/')[1]=='my-advertisement'){             
                number = type.split('/')[2]
                type='/my-advertisement/'
            };
            let originalList = [], titleUnderPrice='', priceValueTo=0
            switch (type) {
                case '/residential/buy': {
                    titleUnderPrice = 'руб'
                    priceValueTo = 5000000

                    await getResidentialBuy()
                        .then((response) => {
                            originalList= response.data[0];
                        })
                        .catch((e)=>{
                            console.log(e.response.data); 
                        })
           
                } break;
                case '/residential/long-rent': {
                    titleUnderPrice = 'руб/мес'
                    priceValueTo = 30000

                    await getResidentialLongRent()
                        .then((response) => {
                            originalList= response.data[0];
                        })
                        .catch((e)=>{
                            console.log(e.response.data); 
                        })

                } break;
                case '/residential/daily-rent': {
                    titleUnderPrice = 'руб/сут'
                    priceValueTo = 5000

                    await getResidentialDailyRent()
                        .then((response) => {
                            originalList= response.data[0];
                        })
                        .catch((e)=>{
                            console.log(e.response.data); 
                        })

                } break;
                case '/commerce/buy': {
                    titleUnderPrice = 'руб'
                    priceValueTo = 30000000
                    
                    await getCommerceBuy()
                        .then((response) => {
                            originalList= response.data[0];
                        })
                        .catch((e)=>{
                            console.log(e.response.data); 
                        })
                
                } break;
                case '/commerce/rent': {
                    titleUnderPrice = 'руб/мес'
                    priceValueTo = 500000
                    
                    await getCommerceRent()
                        .then((response) => {
                            originalList= response.data[0];
                        })
                        .catch((e)=>{
                            console.log(e.response.data); 
                        })
                
                } break;
                case '/my-advertisement/': {
                    titleUnderPrice = 'руб'
                    priceValueTo = 10000000
                    await getMyAdvertisement(number)
                        .then((response) => {
                            originalList= response.data[0];
                        })
                        .catch((e)=>{
                            console.log(e.response.data); 
                        })
                
                } break;
                default: break;
                
            }
            let info = {
                'list': originalList,
                'title': titleUnderPrice,
                'priceTo': priceValueTo
            }
            // Отправка данных в мутацию
            context.commit('updateOriginalList', info)  
        },
        // async getResidentialBuy_method(context){
        //     console.log('getResidentialBuy...');
        //     await getResidentialBuy()
        //     .then((response) => {
        //         console.log(response.data[0]);
        //         return 'response.data[0]';
        //     })
        //     .catch((e)=>{
        //         console.log(e.response.data); 
        //     })
        // },
       
    },

    // mutations - синхронные действия для изменения state. Например реакция на пользовательские события.
    mutations:{
        // функция инициируемая из actions
        updateOriginalList(state, info){
            state.originalListEstates = info.list
            state.titleUnderPrice = info.title
            state.priceValueTo = info.priceTo
        },
    },

    // state - хранилище состояний (моделей)
    state:{
        // Исходный список недвижимости
        originalListEstates: [],
        titleUnderPrice: '',
        priceValueTo: 0
    },

    // getters - методы, возвращающие различные вычисляемые данные
    getters:{
        async INFO_originalList(state){
            return state
        }
    },
}