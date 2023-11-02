<template>
    <div class="this">
        <h2 class='title_block'>Арендовать коммерческую недвижимость в Ставрополе</h2>

        <!-- ГЛАВНЫЙ ФИЛЬТР ПО ПРИЗНАКАМ. ВОЗВРАЩАЕТ СПИСОК -->
        <CommerceFilter @updateFilter="updateFilter" @updateTitleUnderPrice="updateTitleUnderPrice"></CommerceFilter>

        <!-- СПИСОК НЕДВИЖИМОСТИ ПО ФИЛЬТРУ -->
        <ListEstate :filtredList="filtredList" :titleUnderPrice="titleUnderPrice"></ListEstate>
        
    </div>
</template>

<script>
import CommerceFilter from '@/components/filters/CommerceFilter.vue';
import ListEstate from '@/components/ListEstate.vue';
export default {
    components:{
        CommerceFilter, ListEstate
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