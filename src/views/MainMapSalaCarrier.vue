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
import NavBarUniversal from '@/components/NavBarUniversal.vue';
import ClimaExterior from '@/components/ClimaExterior.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';
import ButtonLog from '@/components/ButtonLog.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import MapSalaCarrier from '@/components/MapSalaCarrier.vue';
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