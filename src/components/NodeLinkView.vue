<template>
  <div id="app">
    <l-map id="mapContainer" ref="map"
      :zoom='8'
      :minZoom='7'
      :maxZoom='18'
      :center="[36.176267, 126.976912]"
    >
      <l-tile-layer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
    </l-map>
    <NodeBoxView />
  </div>
</template>

<script>
// import axios from 'axios'
import NodeBoxView from './NodeBoxView.vue'
import { LMap, LTileLayer } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet-src.js'

export default {
  name: 'NodeLinkView',
  components: {
    LMap,
    LTileLayer,
    NodeBoxView,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #app {
      width: 99vw;
      height: 97vh;
  }

  #mapContainer {
    z-index: 0;
  }
</style>
