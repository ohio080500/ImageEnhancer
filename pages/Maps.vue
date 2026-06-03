<template>
  <div class="maps-page">
    <Map />
  </div>
</template>

<template>
  <div class="maps-container">
    <Map />
  </div>
</template>

<script>
import Map from '~/components/Map.vue'

export default {
  name: 'MapsPage',
  components: {
    Map
  },

  head() {
    return {
      title: 'Interactive Map',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Interactive map with markers, GPS location, and geographic exploration'
        }
      ]
    }
  }
}
</script>

<style scoped>
.maps-container {
  padding: 0;
  margin: 0;
  height: calc(100vh - 64px);
  width: 100vw;
  background: #000;
}
</style>

<style scoped>
.maps-page {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}
</style>
