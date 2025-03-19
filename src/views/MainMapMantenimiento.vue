<template>

<nav>
    <NavBarUniversal />
</nav>

<div class="map">
    <MapFabrica />
</div>

<footer>
    <div class="footer__nav">
        <EyeHawkIconVersion />
        <LogoTipoitiFooter />
    </div>
</footer>

</template>

<script setup>
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import NavBarUniversal from '@/components/NavBarUniversal.vue';
import MapFabrica from '@/components/maps/MapFabricaMantenimiento.vue';
</script>