<template>
    <div>
        <!-- СПИСОК НЕДВИЖИМОСТИ ПО ФИЛЬТРУ -->
        <div class="filtred_list" v-if="filtredList.length!=0">

            <div 
            @click="chooseItem(filtredList[i].id_advertisement)"
            class="item" v-for="(item, i) in filtredList" :key="i">
                <div class="item_image">
                    <img :src="'http://31.172.66.193:5000/images/'+filtredList[i].image_name"
                    onerror="this.src='http://31.172.66.193:5000/images/house_logo.png'" alt="Изображение потерялось :(">
                </div>
                <div class="item_description">
                    <div class="field_name"><h2>{{filtredList[i].name}}</h2></div>
                    <div class="field_address">{{filtredList[i].address}}</div>
                    <div class="field_price">
                        {{ this.moneyFormat(filtredList[i].price) }}
                        {{ this.titleUnderPrice }}
                    </div>
                    <div class="field_description">{{filtredList[i].description}}</div>
                </div>
                <div class="item_owner">
                    <div class="item_owner_img">
                        <img :src="'http://31.172.66.193:5000/images/user_profile.png'" alt="">
                    </div>
                    <h6>{{filtredList[i].owner_type}}</h6>
                    <h5>{{filtredList[i].owner_name}}</h5>
                </div>
            </div>

        </div>
        <div class="loading" v-else>
            <img v-if="!flagNotFound" src="http://31.172.66.193:5000/images/loading.gif" alt="">
            <span v-else>{{titleNotFound}}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            titleNotFound: 'По вашему запросу объявлений не найдено :(',
            flagNotFound: false
        }
    },
    props:{
        // Прилетает от соответствующего Filter
        filtredList:{
            type:Array
        },
        titleUnderPrice:{
            type: String
        }
    },
    methods:{
        moneyFormat(n) {
            return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',');
        },
        startFunction(type){
            setTimeout(() => {this.flagNotFound=true;}, 3000);         
        },
        chooseItem(id){
            this.$router.push(`${this.$route.path}/estate-item/${id}`)
        }
    },
    mounted(){
            this.startFunction()    
    }
}
</script>

<style scoped>
h6{
    color: var(--blue);
}
.filtred_list{
    margin-top: 20px;
    display: grid;
    gap: 15px;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
}
.item{
    display: grid;
    grid-template-columns: 1.5fr 3fr 1fr;
    grid-auto-rows: 300px;
    box-shadow: 0 0 1px var(--darkgray);
    padding: 10px;
    transition-duration: 0.3s;
    cursor: pointer;
}
.item:hover{
    box-shadow: 0 0 5px var(--darkgray);
}
.filtred_list img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}
.item_description{
    padding: 0 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    gap: 20px;
}

.field_name{
    color: var(--blue);
}
.field_address{
    font-size: 1rem;
    flex: 0 0 10%;
}
.field_price{
    font-size: 1.5rem;
}
.field_description{
    font-size: 1rem;
    max-height: 100px;
    overflow: hidden;
    position: relative;
}
.field_description::after{
    content: '';
    position: absolute;
    width: 100%;
    height: 30px;
    left: 0;
    bottom: 0;
    background: linear-gradient(0deg, white, transparent);
}

.item_owner{
    flex: 0 0 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    text-align: center;
}
.item_owner_img{
    width: 50%;
    border-radius: 10px;
    object-fit: contain;
}

@media (max-width: 767px){
  .item{
        display: grid;
        padding: 10px;

        grid-template: [start] "item_image" 300px [row2] 
                        [row2] "item_description"  auto [row3]
                        [row3] "item_owner"  30px [row-end] / 1fr;
    }
    .item_image{
        grid-area: item_image;
    }
    .item_description{
        grid-area: item_description;
        gap: 10px;
        padding: 0;
    }
    .item_owner{
        grid-area: item_owner;
        padding: 0 20px;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 5px;
    }
    .item_owner_img{
        display: none;
    }
    .item_description{
        
    }
    .item_owner{
        padding: 0;
    }
}
@media (max-width: 410px){
    
}
@media (min-width: 1920px){
   
}
@media (min-width: 1500px) and (max-width: 1920px){
  
}
@media (min-width: 1000px) and (max-width: 1500px){

}
@media (min-width: 768px){
    .field_address{
        font-size: 1.2rem;
    }
    .field_price{
        font-size: 1.6rem;
    }
    .field_description{
        font-size: 1.2rem;
    }
}


</style>