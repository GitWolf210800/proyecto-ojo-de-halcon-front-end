<template>
    <nav>
        <div class="navbar">
            <div class="navbar__navegacion">
                <RouterLink to="/" > <HomeButtom class="botones__navegacion" /> </RouterLink>
                <RouterLink to="/clima"> <ClimaFabrica class="botones__navegacion" /> </RouterLink>
            </div>
            <LoginButtom />
        </div>
    </nav>

    <div class="content">
        <MapSalaCarrier class="map__carrier" />
    </div>

    <footer>
            <EyeHawkIconVersion />
            <LogoTipoitiFooter />
    </footer>
</template>

<script setup>
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';
import LoginButtom from '@/components/icons/LoginButtom.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import MapSalaCarrier from '@/components/MapSalaCarrier.vue';

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
    padding-top: 70px;
}

</style>