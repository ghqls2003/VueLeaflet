<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet-src.js'
import 'leaflet.markercluster/dist/leaflet.markercluster-src.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import L from 'leaflet'
import leaf500001 from './realworld.50000.1.js'
// import leaf500002 from './realworld.50000.2.js'

export default {
  name:'Leaf50000View',
  components: {},
  data() {
    return {
      map: null,
      tiles: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
			}),
      latlng: L.latLng(-38.79, 175.27),
      markers: L.markerClusterGroup({ chunkedLoading: true }),
      markers2: L.markerClusterGroup({ chunkedLoading: true }),
    }
  },
  mounted() {
		this.map = L.map('map', { center: this.latlng, zoom: 9, layers: [this.tiles] })
    if(this.map){
        this.markers.clearLayers()
        this.markers2.clearLayers()
    this.getMarker()
    // this.getRandom()
    setInterval(this.getRandom, 5000)
      }
    // setInterval(this.getMarker, 5000)
  },
  unmounted() {},
  methods: {
    getMarker() {
      var markerList = [];

      for (var i = 0; i < leaf500001.addressPoints.length; i++) {
        var a = leaf500001.addressPoints[i];
        var title = a[2];
        var marker = L.marker(L.latLng(a[0], a[1]), { title: title });
        marker.bindPopup(title);
        markerList.push(marker);
      }
      // for (var j = 0; j < leaf500002.addressPoints2.length; j++) {
      //   var a2 = leaf500002.addressPoints2[j];
      //   var title2 = a2[2];
      //   var marker2 = L.marker(L.latLng(a2[0], a2[1]), { title: title2 });
      //   marker2.bindPopup(title2);
      //   markerList.push(marker2);
      // }
      // for(var k=0; k<10000; k++){
      //   var title3 = "test1"
      //   const rand_35 = ((Math.random()*2)-39.85).toFixed(6);
      //   const rand_126 = ((Math.random()*2)+174.77).toFixed(6);
      //   var marker3 = L.marker(L.latLng(rand_35, rand_126), {title: title3});
      //   marker3.bindPopup(title3)
      //   markerList.push(marker3);
      // }

      this.markers.addLayers(markerList);
      this.map.addLayer(this.markers);
    },
    getRandom() {
      if(this.map){
        this.markers2.clearLayers()
      }
      var markerList2 = [];
      for(var k=0; k<10000; k++){
        var title3 = "test1"
        const rand_35 = ((Math.random()*2)-39.85).toFixed(6);
        const rand_126 = ((Math.random()*2)+174.77).toFixed(6);
        var marker3 = L.marker(L.latLng(rand_35, rand_126), {title: title3});
        marker3.bindPopup(title3)
        markerList2.push(marker3);
      }

      this.markers2.addLayers(markerList2);
      this.map.addLayer(this.markers2);
    }
  }
}
</script>

<style scoped>
  #map {
    width: 100vw;
    height: 95vh;
  }
</style>