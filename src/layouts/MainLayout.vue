<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white mobile-hide">
      <MenuBar />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-primary text-white mobile-only">
      <MenuBar />
    </q-footer>

  </q-layout>
</template>

<script>
  import MenuBar from 'components/MenuBar';

  export default {
    name: 'MainLayout',

    components: {
      MenuBar
    },

    data() {
      return {
      }
    },
  }
</script>
