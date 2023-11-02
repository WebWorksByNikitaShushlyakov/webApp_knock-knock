<template>
    <div class="this">
        <h2 class='title_block'>Вход в личный кабинет</h2>
        <main>
            <input type="text" maxlength="11" v-model="formData.number" placeholder="Номер телефона">
            <input type="password" maxlength="30" v-model="formData.password" placeholder="Пароль">
            <button @click="login_method">Войти в кабинет</button>
            <p class="unsuccess" v-if="dataIsIncorrect">{{hint}}</p>
            <p class="success" v-if="success">Попытка авторизации.</p>
        </main> 
    </div>
</template>

<script>
import {login, checkLogin} from '@/services/api.js'
import {mapGetters, mapMutations} from 'vuex'

export default {
    data() {
        return {
            formData: {
                number: '',
                password: '',
            },
            ACCESS_TOKEN: '',
            AUTH_USER: {},
            dataIsIncorrect: false,
            success: false,
            hint: 'Проверьте ваши данные'
        }
    },
    methods:{
        ...mapMutations(['update_ACCESS_TOKEN', 'update_AUTH_USER']),

        // Авторизация. Запрос получает токен доступа.
        async login_method(){
            console.log('Login attempt');
            await login(this.formData)
            .then((response) => {
                this.dataIsIncorrect = false
                this.success = true
                document.cookie = `ACCESS_TOKEN=${response.data}`
                this.update_ACCESS_TOKEN(response.data)
                this.checkLogin_method(response.data)
            })
            .catch((e)=>{
                this.success = false
                this.dataIsIncorrect = true
                this.hint = e.response.data
                console.log(e.response.data);
            })
        },

        // Получение данных авторизованного пользователя
        async checkLogin_method(ACCESS_TOKEN){
            console.log('Checking login...');
            await checkLogin({ACCESS_TOKEN: ACCESS_TOKEN})
            .then((response) => {
                this.update_AUTH_USER(response.data)
                this.$router.push('/personal-acc')
            })
            .catch((e)=>{
                this.dataIsIncorrect= true,
                this.success= false,
                this.hint= e.response.data
                console.log(e);
            })
        },
    },
    watch: {
        // ACCESS_TOKEN(){
        //     // this.$emit('update_ACCESS_TOKEN', this.ACCESS_TOKEN)
        // },
        // AUTH_USER(){
        //     // this.$emit('update_AUTH_USER', this.AUTH_USER)
        // }
    }
}
</script>

<style scoped>
main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    margin-top: 40px;
}
input{
    font-size: 1rem;
    padding: 5px;
    text-align: center;
    border: 0;
    box-shadow: 0 0 5px var(--darkgray);
    transition-duration: 0.2s;
    
}
input:focus{
    outline: 0;
    box-shadow: 0 0 5px var(--blue);
}
button{
    background-color: var(--blue);
    padding: 10px 0;
    width: 100%;
}
button:hover{
    background-color: var(--darkblue);
}
.unsuccess{
    color: var(--red);
}
.success{
    color: var(--green);
}
p{
    text-align: center; 
}
@media (max-width: 767px){
    input, li{
        font-size: 1.6rem;
    }
}
@media (max-width: 400px){
  input, li{
        font-size: 1.7rem;
    }
    main{
        gap: 20px;
        margin-top: 20px;
    }
}
@media (min-width: 1920px){
  input, li{
        font-size: 2rem;
    }
    main{
        gap: 30px;
        margin-top: 40px;
    }
    button{
        padding: 20px 0;
    }
}
@media (min-width: 1500px) and (max-width: 1920px){
  input, li{
        font-size: 1.8rem;
    }
    main{
        gap: 25px;
        margin-top: 35px;
    }
    button{
        padding: 20px 0;
    }
}
@media (min-width: 1000px) and (max-width: 1500px){
  input, li{
        font-size: 1.6rem;
    }
    main{
        gap: 20px;
        margin-top: 35px;
    }
    button{
        padding: 20px 0;
    }
}

@media (min-width: 768px) and (max-width: 1000px){
  input, li{
        font-size: 1.6rem;
    }
    main{
        gap: 15px;
        margin-top: 30px;
    }
    button{
        padding: 20px 0;
    }
}
</style>