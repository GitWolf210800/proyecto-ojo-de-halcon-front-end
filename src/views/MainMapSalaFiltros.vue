<template>
    <nav>
        <TituloInstalacion :instalacion="instalacion" />
        <RouterLink to="/clima"> <ClimaFabrica class="botones__navegacion" /> </RouterLink>
        <NavBarUniversal />
    </nav>

    <div class="map">
        <MapFiltroClima />
    </div>

    <footer>
        <div class="footer__nav">
            <EyeHawkIconVersion />
            <LogoTipoitiFooter />
        </div>
    </footer>

</template>

<script setup>
import TituloInstalacion from '@/components/icons/TituloInstalacion.vue';
import NavBarUniversal from '@/components/componentesVue/NavBarUniversal.vue';
import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import MapFiltroClima from '@/components/main/MapFiltroClima.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
let result = Object.values(route.query).join("");
const firstIndex = result.indexOf('_');
const lastIndex = result.lastIndexOf('_');
const fabrica = `Fábrica ${result.substring(firstIndex, 3, lastIndex)}`;
//console.log(fabrica);
const dato = result.substring(firstIndex + 1 , lastIndex);
//console.log(firstIndex, lastIndex);
const instalacion = `${fabrica} ${dato}`;

document.title = `Ojo de Halcón - ${instalacion}`;

</script>