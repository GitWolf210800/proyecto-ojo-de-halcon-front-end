<template>
    <nav>
        <RouterLink to="/clima"> <ClimaFabrica class="botones__navegacion" /> </RouterLink>
        <NavBarUniversal />
    </nav>

    <div class="map">
        <MapSalaCarrier />
    </div>

    <footer>
        <div class="footer__nav">
            <EyeHawkIconVersion />
            <LogoTipoitiFooter />
        </div>
    </footer>
</template>

<script setup>
import NavBarUniversal from '@/components/componentesVue/NavBarUniversal.vue';
import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import MapSalaCarrier from '@/components/maps/main/MapSalaCarrier.vue';
import { useRoute } from "vue-router";

const route = useRoute();
let result = Object.values(route.query).join("");

document.title = `Ojo de Halcón - ${result}`;

</script>

<style >

.map__carrier {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    z-index: 0;
}

.content{
    padding-top: 100px;
}

</style>