<template>
    <nav>
        <!--<TituloInstalacion :instalacion="" />-->
        <RouterLink to="/mantenimiento" > <MantenimientoFabrica class="botones__navegacion" /> </RouterLink>
        <NavBarUniversal />
    </nav>

    <!--<div class="map">
        <MapSalaCompresor />
    </div>

    <footer>
        <div class="footer_nav">
            <EyeHawkIconVersion />
            <LogoTipoitiFooter />
        </div>
    </footer>-->

</template>

<script setup>
import { useRoute } from 'vue-router';
import TituloInstalacion from '@/components/icons/TituloInstalacion.vue';
import NavBarUniversal from '@/components/componentesVue/NavBarUniversal.vue';
import MantenimientoFabrica from '@/components/icons/MantenimientoFabrica.vue';
import MapSalaCompresor from '@/components/maps/main/MapSalaCompresor.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';

const route = useRoute();
let result = Object.values(route.query).join("");
console.log(result);

</script>