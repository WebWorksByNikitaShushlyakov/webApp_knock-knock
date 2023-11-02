export default {
    // actions - асинхронные действия для изменения состояния. Например для связи с backend.
    actions:{
        
    },

    // mutations - синхронные действия для изменения state. Например реакция на пользовательские события.
    mutations:{
        // функция инициируемая из actions
        
        update_ACCESS_TOKEN(state, ACCESS_TOKEN){
            state.ACCESS_TOKEN=ACCESS_TOKEN
        },
        update_AUTH_USER(state, AUTH_USER){
            state.AUTH_USER=AUTH_USER
        },
        clear_AUTH(state){
            console.log('Clean on conf');
            state.ACCESS_TOKEN= '',
            state.AUTH_USER= {}
        }
    },

    // state - хранилище состояний (моделей)
    state:{
        ACCESS_TOKEN: '',
        AUTH_USER: {}
    },

    // getters - методы, возвращающие различные вычисляемые данные
    getters:{
        get_ACCESS_TOKEN(state){
            return state.ACCESS_TOKEN
        },
        get_AUTH_USER(state){
            return state.AUTH_USER
        },
    },
}