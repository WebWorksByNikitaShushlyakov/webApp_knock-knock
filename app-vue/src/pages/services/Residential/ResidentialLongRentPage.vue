<template>
    <div class="this">
        <h2 class='title_block'>Снимите в Ставрополе на длительный срок</h2>
        
        <!-- ГЛАВНЫЙ ФИЛЬТР ПО ПРИЗНАКАМ. ВОЗВРАЩАЕТ СПИСОК -->
        <ResidentialFilter @updateFilter="updateFilter" @updateTitleUnderPrice="updateTitleUnderPrice"></ResidentialFilter>

         <!-- СПИСОК НЕДВИЖИМОСТИ ПО ФИЛЬТРУ -->
         <ListEstate :filtredList="filtredList" :titleUnderPrice="titleUnderPrice"></ListEstate>
    </div>
</template>

<script>
import ResidentialFilter from '@/components/filters/ResidentialFilter.vue';
import ListEstate from '@/components/ListEstate.vue';
export default {
    components:{
        ResidentialFilter, ListEstate
    },
    data() {
        return {
            filtredList: [],
            titleUnderPrice:''
        }
    },
    methods:{
        updateFilter(newList){
            this.filtredList=newList
        },
        moneyFormat(n) {
            return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace('.', ',');
        },
        updateTitleUnderPrice(newTitle){
            this.titleUnderPrice=newTitle
        }    
    }
    
}
</script>

<style scoped>

</style>