<template>
    <div class="this">
        <h2 class='title_block'>Регистрация</h2>
        <main>
            <input type="text" maxlength="11" title="Оптимальный формат: 89993332244" :class="{incorrect: telIsIncorrect}" v-model="formData.number" placeholder="Номер телефона">
            <input type="password" title="Минимальная длина 4 символа" :class="{incorrect: passwordIsIncorrect}" v-model="formData.password" placeholder="Пароль">
            <input type="password" title="Минимальная длина 4 символа" :class="{incorrect: passwordIsIncorrect}" v-model="checkPassword" placeholder="Повторите пароль">

            <input type="text" v-model="formData.surname" placeholder="Введите фамилию">
            <input type="text" v-model="formData.name" placeholder="Введите имя">
            <ul class="typeOwner">
                <li :class="{active: formData.typeOwner=='Собственник'}" @click="changeTypeOwner('Собственник')">Собственник</li>
                <li :class="{active: formData.typeOwner=='Риелтор'}" @click="changeTypeOwner('Риелтор')">Риелтор</li>
            </ul>
            
            <button @click="check_data">Готово? Жми!</button>
            <p class="unsuccess" v-if="dataIsIncorrect">{{hint}}</p>
            <p class="success" v-if="success">Попытка регистрации.</p>
        </main>
    </div>
</template>

<script>
import {login, checkLogin, registration} from '@/services/api.js'
import {mapGetters, mapMutations} from 'vuex'

export default {
    data() {
        return {
            formData: {
                number: '',
                password: '',
                typeOwner:'',
                surname:'',
                name:'',
            }, 
            checkPassword: '',
            telIsIncorrect: false,
            passwordIsIncorrect: false,
            dataIsIncorrect: false,
            success: false,
            hint: 'Проверьте ваши данные'
        }
    },
    methods:{
        ...mapMutations(['update_ACCESS_TOKEN', 'update_AUTH_USER']),
        changeTypeOwner(type){
            this.formData.typeOwner=type
        },
        // ПРОВЕРКА ДАННЫХ
        check_data(){
            const object = this.formData
            const values = Object.values(object)
            this.dataIsIncorrect=false
            // Проверка на пустоту
            values.forEach(value => {
                if(value=='')this.dataIsIncorrect=true
            });
            // Проверка пароля
            if(this.passwordIsIncorrect)this.dataIsIncorrect=true
            // Проверка телефона
            if(this.telIsIncorrect){this.dataIsIncorrect=true}
            // Результат
            if(!this.dataIsIncorrect){
                this.success=true
                this.registration_method()
            }else{
                this.hint = 'Проверьте ваши данные'
            }
        },
        // Отправка данных на сервер
        async registration_method(){
            console.log('Registration attempt');
            await registration(this.formData)
            .then((response) => {
                this.hint=response.data
                this.success=true
                this.dataIsIncorrect=false
                console.log(response.data);
                this.login_method()
            })
            .catch((e)=>{
                this.dataIsIncorrect=true
                this.hint=e.response.data
                this.success=false
                console.log(e.response.data);
                })
        },
        // Авторизация
        async login_method(){
            console.log('Login attempt');
            await login(this.formData)
            .then((response) => {
                document.cookie = `ACCESS_TOKEN=${response.data}`
                this.update_ACCESS_TOKEN(response.data)
                this.checkLogin_method(response.data)
            })
            .catch((e)=>{console.log(e.response.data);})
        },
        // Получение данных авторизированного пользователя
        async checkLogin_method(ACCESS_TOKEN){
            console.log('Checking login...');
            await checkLogin({ACCESS_TOKEN: ACCESS_TOKEN})
            .then((response) => {
                this.update_AUTH_USER(response.data)
                this.$router.push('/personal-acc')
            })
            .catch((e)=>{console.log(e);})
        },
    },
    watch: {
        'formData.number'(n){
            let value = String(this.formData.number)
            // Убираем буквы
            if(this.price!=0){
                if(!value.match(/^[1-9|\+](\d{0,})$/))
                {this.formData.number=(this.formData.number).substring(0, (this.formData.number).length-1)}
            }  
            // Проверяем формат
            let match = value.match(/^[\d\+][\d\(\)\ -]{9}\d$/);
            if (!match) {this.telIsIncorrect=true}else{this.telIsIncorrect=false}
            
            // Меняем +7 на 8
            let match2 = value.match(/^[\+]\d+$/);
            if (match2) { 
                this.formData.number = (this.formData.number).slice(2,)
                this.formData.number = '8'+this.formData.number
            }
            // Меняем первую цифру на 8
            let match3 = value.match(/^[\[0-7|9]\d+$/);
            if (match3) { 
                const x = this.formData.number
                this.formData.number = (this.formData.number).slice(1,)
                this.formData.number = '8'+x
            }
        },
        'formData.password'(n){
           if(this.formData.password!=this.checkPassword || this.formData.password.length < 4)this.passwordIsIncorrect=true
            else{this.passwordIsIncorrect=false}
        },
        'checkPassword'(n){
           if(this.formData.password!=this.checkPassword || this.formData.password.length < 4)this.passwordIsIncorrect=true
            else{this.passwordIsIncorrect=false}
        },
    }
}
</script>

<style scoped >
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
.typeOwner{
    display: flex;
    justify-content: center;
    align-items: center;
    
}
.typeOwner *{
    background-color: var(--gray);
    padding: 5px 15px;
    list-style: none;
    cursor: pointer;
}
.typeOwner *:hover{
    background-color: var(--blue);
    color: var(--white)
}
.active{
    background-color: var(--darkblue);
    color: var(--white)
}
.typeOwner li:first-child{
    border-radius: 10px 0 0 10px;
}
.typeOwner li:last-child{
    border-radius: 0 10px 10px 0;
}
.incorrect{
    box-shadow: 0 0 5px var(--red);
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
        padding: 10px 0;
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
        padding: 10px 0;
    }
}
</style>