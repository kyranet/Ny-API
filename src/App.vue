<template>
    <div id="app">
        <app-navbar/>
        <router-view/>
    </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';

export default {
    name: "App",
    components: { AppNavbar, AppFooter }
};
</script>

<style lang="scss">
    // Import Bulma's core
    @import '~bulma/sass/utilities/_all';
    $menu-item-active-background-color: $info;
    $menu-item-hover-background-color: $light;
    $footer-background-color: $light; // Import Bulma and Buefy styles
    @import '~bulma';
    @import '~buefy/src/scss/buefy';

</style>
