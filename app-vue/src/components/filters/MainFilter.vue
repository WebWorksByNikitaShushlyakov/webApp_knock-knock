<template>
    <nav>
      <div class="row1">
        <button 
        :class="{currentPage: $route.path == '/residential/buy' || $route.path == '/'}"
        @click="$router.push('/residential/buy')"
        >Купить жильё</button>

        <button 
        :class="{currentPage: $route.path == '/residential/long-rent'}"
        @click="$router.push('/residential/long-rent')"
        >Жильё надолго</button>

        <button 
        :class="{currentPage: $route.path == '/residential/daily-rent'}"
        @click="$router.push('/residential/daily-rent')"
        >Жильё посуточно</button>
      </div>
      <div class="row2">
        <button 
        :class="{currentPage: $route.path == '/commerce/buy'}"
        @click="$router.push('/commerce/buy')"
        >Купить для коммерции</button>

        <button 
        :class="{currentPage: $route.path == '/commerce/rent'}"
        @click="$router.push('/commerce/rent')"
        >Арендовать для коммерции</button>
      </div>
        

        
      </nav>
</template>

<script>
export default {
    
}
</script>

<style scoped>
nav{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
nav div{
  display: flex;
  flex-direction: row;
  gap: 8px;
}
button{
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 2px solid var(--white);
  flex-grow: 1;
}
button:hover{
  color: black;
  background-color: var(--white);
}  
.currentPage{
    color: black;
    background-color: var(--white);
}  

@media (max-width: 576px){
  .row1,
  .row2{
    display: flex;
    flex-direction: column;
  }
  button{
    padding: 10px 20px;
    font-size: 1.4rem;
    background-color: rgba(0, 0, 0, 0.6);
    border: 2px solid var(--white);
  }
}
</style>