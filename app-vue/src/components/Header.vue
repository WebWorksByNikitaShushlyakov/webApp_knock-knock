<template>
    <header>
        <div class="logo">Тук-Тук</div>
        <div class="burger" @click="menuOpen()">
          <img src="http://31.172.66.193:5000/images/burger.png">
        </div>
        <nav>
          <button 
            v-if="!this.logged"
            :class="{currentPage: $route.path == '/registration'}"
            @click="$router.push('/registration'); moveTo()"
            >Регистрация</button>
          <button 
            v-if="!this.logged"
            :class="{currentPage: $route.path == '/auth'}"
            @click="$router.push('/auth'); moveTo()"
            >Войти</button>
          <button 
            v-if="this.logged"
            :class="{currentPage: $route.path == '/personal-acc'}"
            @click="$router.push('/personal-acc'); moveTo()"
            >Мой кабинет</button>
        </nav>
      </header>
</template>

<script>
export default {
  props:{
      AUTH_USER: {}
  },
  data() {
    return {
      logged: false
    }
  },
  methods: {
    moveTo(){
      const main = document.querySelector('main')
      const block = document.querySelector('.this')
      block.scrollIntoView({
        block: 'start',
        behavior: "smooth"
      });
      window.scrollTo({
        top: main.getBoundingClientRect().height,
        left: 0,
        behavior: "smooth"
      });
      const nav = document.querySelector('nav')
      nav.classList.remove('burger_isOpen')
    },
    menuOpen(){
      const nav = document.querySelector('nav')
      const main = document.querySelector('main')
      if(!nav.classList.contains('burger_isOpen'))nav.classList.add('burger_isOpen')
      main.addEventListener('click', (e)=>{nav.classList.remove('burger_isOpen')})
      
    }
  },
  watch: {
    AUTH_USER(){
      if(Object.keys(this.AUTH_USER).length==0){this.logged=false}
      else{this.logged=true}
    }
  }
}
</script>

<style scoped>
header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 10;

  --gray: rgb(232, 232, 232, 0.5);
  --white: rgb(240, 240, 240);
  color: var(--white);
}
.logo{
  font-size: 2rem;
  font-family: sans-serif;
  user-select: none;
  text-shadow: 0 0 2px rgb(12, 12, 115);
}  
nav{
  display: flex;
  gap: 8px;
  transition-duration: 0.5s;
}
button{
  padding: 8px 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 2px solid var(--white);
}
button:hover{
  color: black;
  background-color: var(--white);
}
.currentPage{
  color: black;
  background-color: var(--white);
} 
.burger{
  display: none;
  width: 55px;
  height: 55px;
  
}
.burger img{
  width:100%;
  height:100%;
  object-fit: contain;
}


.burger_isOpen{
  transform: translateY(0%);
}
@media (max-width: 576px){
  .burger{
    display: block;
  }
  nav{
    position: absolute;
    width: 100%;
    height: auto;
    padding: 40px 20px;
    left: 0;
    top: 0;
    flex-direction: column;
    gap: 20px;
    transform: translateY(-100%);
    background-color: var(--gray);
    backdrop-filter: blur(5px);
    border-radius: 0 0 20px 20px;
  }
}
</style>