<template>
    <nav>
        <div class="navbar">
            <div class="navbar__navegacion">
                <RouterLink to="/" > <HomeButtom class="botones__navegacion" /> </RouterLink>
                <RouterLink to="/clima"> <ClimaFabrica class="botones__navegacion" /> </RouterLink>
            </div>
            <ClimaExterior />
            <LoginButtom />
        </div>
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
import ClimaExterior from '@/components/ClimaExterior.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';
import LoginButtom from '@/components/icons/LoginButtom.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import MapSalaCarrier from '@/components/MapSalaCarrier.vue';
import { useRoute } from "vue-router";

const route = useRoute();
let result = Object.values(route.query).join("");

document.title = `Ojo de Halcón - ${result}`;


</script>

<style scoped>
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