<template>
  <Header :AUTH_USER="AUTH_USER"></Header>
  <StartComponent></StartComponent>
  <router-view 
    :AUTH_USER="AUTH_USER"

  ></router-view>
  <!-- @update_ACCESS_TOKEN="update_ACCESS_TOKEN" -->
  <!-- @update_AUTH_USER="update_AUTH_USER" -->
</template>

<script>
import {checkLogin} from '@/services/api.js'
import Header from '@/components/Header.vue'
import StartComponent from '@/components/StartComponent.vue'
import {mapGetters, mapMutations} from 'vuex'

export default{
  data() {
    return {
      ACCESS_TOKEN: '',
      AUTH_USER: {}
    }
  },
  components:{
    Header,StartComponent
  },
  methods: {
    ...mapMutations(['update_AUTH_USER']),

    // Получение значения куки с указанным name
    getCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },

    // Получение данных авторизированного пользователя
    async checkLogin_method(){
        console.log('Getting date...');
        await checkLogin({ACCESS_TOKEN: this.ACCESS_TOKEN})
        .then((response) => {
            this.update_AUTH_USER(response.data)
            this.AUTH_USER = response.data
            console.log('Date of user is ready.');
        })
        .catch((e)=>{console.log(e.response.data);})
      },

      startComponent(){
        this.ACCESS_TOKEN = this.getCookie('ACCESS_TOKEN')
        // Проверка на наличие токена доступа
        if(this.ACCESS_TOKEN){
          console.log('User is logged');
          // Проверка на наличие данных пользователя
          this.AUTH_USER = this.get_AUTH_USER
          if(Object.keys(this.AUTH_USER).length==0){
            // В противном случае, отправляем запрос к БД
            this.checkLogin_method()
          }
        }else{
          this.AUTH_USER = {}
          console.log('User is not logged');
        }
      }
  },
  mounted() {
    this.startComponent()
  },
  watch:{
    get_AUTH_USER(){this.startComponent()}
  },
  computed: {
      // Отслеживание изменений состояния внутри getters 
      ...mapGetters(['get_ACCESS_TOKEN','get_AUTH_USER']),
  }
}

</script>

<style >
.this{
  width: 100%;
  min-height: 100%;
  padding: 5%;
  
  --violet: rgb(64, 78, 205);
  --gray: rgb(232, 232, 232);
  --darkgray: rgb(162, 162, 162);
  --lightblue: rgb(230, 245, 255);
  --blue: rgb(42, 151, 224);
  --darkblue: rgb(9, 115, 186);
  --white: rgb(240, 240, 240);
  --red: rgb(219, 112, 112);
  --green: rgb(117, 209, 132);
  --black: rgb(20, 20, 20);
}
input{font-family: mainFont-serif;}
h1{
  font-size: 5rem;
}
h2{
  font-size: 2rem;
}
h3{
  font-size: 1.7rem;
}
h4{
  font-size: 1.5rem;
}
h5{
  font-size: 1.2rem;
}
h6{
  font-size: 1rem;
}
p{
  font-size: 1rem;
}
button{
  color: white;
  border: 0;
  border-radius: 5px;
  font-size: 1.1rem;
  box-shadow: 0 0 5px black;
  transition-duration: 0.2s;
  letter-spacing: 2px;
}
button:active{
  transition-duration: 0.1s;
  transform: scale(0.98);
}
.loading{
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}


body::-webkit-scrollbar {
  width: 8px;               /* ширина scrollbar */
}
body::-webkit-scrollbar-track {
  background: white;       /* цвет дорожки */
}
body::-webkit-scrollbar-thumb {
  background-color: rgb(42, 151, 224);    /* цвет плашки */
  border-radius: 0px;       /* закругления плашки */
}
body::-webkit-scrollbar-thumb:hover{
  background-color: rgb(9, 115, 186);
}


@media (max-width: 767px){
  html{
    font-size: 14px;
  }
  h1{
    line-height: 1em;
  }
}
@media (max-width: 576px){
  .this{
    padding: 5% 3%;
  }
  button{
    color: white;
    border: 0;
    border-radius: 5px;
    font-size: 1.4rem;
    box-shadow: 0 0 5px black;
    transition-duration: 0.2s;
    letter-spacing: 2px;
  }
}
@media (max-width: 400px){
  html{
    font-size: 12px;
  }
  h1{
  font-size: 3rem;
  }
  h2{
    font-size: 1.6rem;
  }
  h3{
    font-size: 1.7rem;
  }
  h4{
    font-size: 1.5rem;
  }
  .title_block{
    text-align: center;
  }
}
@media (max-width: 767px){
  
}
@media (min-width: 1920px){
  html{
    font-size: 18px;
  }
  button{
    font-size: 1.5rem;
  }
}
@media (min-width: 1500px) and (max-width: 1920px){
  html{
    font-size: 17px;
  }
  button{
    font-size: 1.4rem;
  }
}

@media (min-width: 1000px) and (max-width: 1500px){
  html{
    font-size: 15px;
  }
  button{
    font-size: 1.3rem;
  }
}

@media (min-width: 768px) and (max-width: 1000px){
  html{
    font-size: 12px;
  }
  button{
    font-size: 1.1rem;
  }
}
</style>
