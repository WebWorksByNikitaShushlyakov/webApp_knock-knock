<template>
    <div class="main">
        <main>
          <div class="text">
            <h2>В поисках недвижимости?</h2>
            <h1>Вы по адресу!</h1>
          </div>
          <MainFilter></MainFilter>
        </main>
      </div>
</template>

<script>
import MainFilter from '@/components/filters/MainFilter.vue';
export default {
    components:{
      MainFilter
    }
}
</script>

<style scoped>
.main{
    width: 100%;
    height: 80%;
    background-image: url(http://31.172.66.193:5000/images/main_background.jpg);
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    color: var(--white);
    text-shadow: 0 0 2px rgb(12, 12, 115);

    display: flex;
    flex-direction: column;
    animation: startAnim 45s infinite ease;
}
@keyframes startAnim{
  0%{background-image: url(http://31.172.66.193:5000/images/main_background.jpg);}
  
  30%{background-image: url(http://31.172.66.193:5000/images/main_background.jpg);}
  40%{background-image: url(http://31.172.66.193:5000/images/main_background2.jpeg);}

  60%{background-image: url(http://31.172.66.193:5000/images/main_background2.jpeg);}
  70%{background-image: url(http://31.172.66.193:5000/images/main_background3.jpg);}

  90%{background-image: url(http://31.172.66.193:5000/images/main_background3.jpg);}
  100%{background-image: url(http://31.172.66.193:5000/images/main_background.jpg);}
}
main{
  padding: 5%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15%;
  align-items: start;
  font-family: mainFont-serif;
  backdrop-filter: blur(3px) brightness(90%);
}
@media (max-width: 576px){
  .main{
    width: 100%;
    height: 100%;
  }
  main{
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
@media (max-width: 400px){
  main{
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 10%;
    padding-top: 15%;
  }
}

/*@media(min-width: 1920px){
  main{
    gap: 15%;
  }
}
@media(min-width: 1500px) and (max-width: 1920px){
  main{
    gap: 15%;
  }
}
@media(min-width: 1000px) and (max-width: 1500px){
  main{
    gap: 15%;
  }
}
@media(min-width: 768px) and (max-width: 1000px){
  main{
    gap: 15%;
  }
}*/
</style>