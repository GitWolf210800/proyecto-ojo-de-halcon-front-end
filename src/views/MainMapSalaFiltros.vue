<template>
    <nav>
        <div class="navbar">
            <div class="navbar__navegacion">
                <RouterLink to="/"> <HomeButtom class="botones__navegacion" /> </RouterLink>
                <RouterLink to="/clima"> <ClimaFabrica class="botones__navegacion" /> </RouterLink>
            </div>
            <TituloInstalacion :instalacion="instalacion" />
            <ClimaExterior />
            <LoginButtom class="login-buttom" @click = "clickLogin" />
        </div>
    </nav>

    <div class="map">
        <MapFiltroClima />
    </div>

    <Login v-if="visibilityLogin" />

    <footer>
        <div class="footer__nav">
            <EyeHawkIconVersion />
            <LogoTipoitiFooter />
        </div>
    </footer>

</template>

<script setup>
import TituloInstalacion from '@/components/icons/TituloInstalacion.vue';
import ClimaExterior from '@/components/ClimaExterior.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';
import LoginButtom from '@/components/icons/LoginButtom.vue';
import Login from '@/components/Login.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import MapFiltroClima from '@/components/MapFiltroClima.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const visibilityLogin = ref(null);

const clickLogin = () => {
    if (!visibilityLogin.value){
        visibilityLogin.value = true;
    } else {
        visibilityLogin.value = false;
    }
};

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