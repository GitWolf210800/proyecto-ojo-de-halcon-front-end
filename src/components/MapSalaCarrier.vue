<template>
    <nav>
        <RouterLink to="/" > <HomeButtom class="botones" /> </RouterLink>
        <RouterLink to="/clima"> <ClimaFabrica class="botones" /> </RouterLink>
        <LoginButtom />
    </nav>

    <div class="container__map">
        <div class="map">
            <MapChillerOption1 v-if="opcion1" />
            <MapChillerOption2 v-else-if="opcion2" />
        </div>
        <ToolTipChart />
        <ToolTipInfoTable />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import ToolTipChart from '@/modules/tooltip/components/ToolTipChart.vue';
import MapChillerOption1 from './maps/MapChillerOption1.vue';
import MapChillerOption2 from './maps/MapChillerOption2.vue';
import ToolTipInfoTable from '@/modules/tooltip/components/ToolTipInfoTable.vue';
import { ref } from 'vue';
import HomeButtom from './icons/HomeButtom.vue';
import LoginButtom from './icons/LoginButtom.vue';
import ClimaFabrica from './icons/ClimaFabrica.vue';

const route = useRoute();
const parametros = route.query;
const opcion1 = ref(null);
const opcion2 = ref(null);

</script>

<style scoped>

</style>