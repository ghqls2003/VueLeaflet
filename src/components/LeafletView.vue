<template>
  <div id="app">
    <l-map id="mapContainer" ref="map"
      :zoom='8'
      :minZoom='4'
      :maxZoom='18'
      :center="[36.176267, 126.976912]"
    >
      <l-tile-layer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <v-marker-cluster>
        <l-marker
          v-for="([lat, lng], i) in this.randCoord"
          :key="i"
          :lat-lng="[lat, lng]"
          :icon="randomIcon"
        />
        <l-marker
          v-for="([lat, lng], i) in this.cardatalistCoord"
          :key='i'
          :lat-lng="[lat, lng]"
          :icon="defaultIcon"
        />
      </v-marker-cluster>
    </l-map>
    <RltmCntrlView v-bind:cardata=cardata v-bind:roopdata=roopdata v-bind:randCoord=randCoord @rltm="setView" ref="RltmCntrView"/>
  </div>
</template>

<script>
import axios from 'axios'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import L from 'leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet-src.js'
import 'leaflet.markercluster/dist/leaflet.markercluster-src.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import icon from '@/assets/green05_5.png'
import randicon from '@/assets/red05_5.png'
import RltmCntrlView from './RltmCntrlView.vue'

export default {
  name: 'LeafletView',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    "v-marker-cluster": Vue2LeafletMarkerCluster,
    RltmCntrlView
  },
  data() {
    return {
      defaultIcon: L.icon({
        iconUrl: icon,
        iconSize: [38, 40], // 가로, 세로
        iconAnchor: [22, 94], // 아이콘 위치
      }),
      randomIcon: L.icon({
        iconUrl: randicon,
        iconSize: [38, 40], // 가로, 세로
        iconAnchor: [22, 94], // 아이콘 위치
      }),
      cardata: [],
      cardatalistCoord: [],
      cardataCoord: [],
      roopdata: [],
      randCoord: []
    };
  },
  mounted() {
    this.getData();
    setInterval(this.getRandMarker, 5000)
    // this.getRandMarker
  },
  updated() {
    // alert("바뀜")
  },
  methods: {
    getData() {
      axios.get('/vc/selectRealTimeCarInfo')
      .then(response => {
        const data = JSON.parse(response.data.replace("data: ", '').replace("\n\n", ''))
        this.cardata = data.data

        var roopDataList = []
        for(var n=0; n<300; n++){
          for(var o=0; o<10; o++){
            roopDataList.push(this.cardata[o])
          }
        }
        this.roopdata = roopDataList
        
        this.getMarker();
        this.getRandMarker();
      })
      .catch(error => {
        console.log(error);
      });
    },
    setView(value) {
      this.$refs.map.mapObject.flyTo([value[0], value[1]], 18)
    },
    getMarker() {
      for(var i=0; i<this.cardata.length; i++){
        var setting = [this.cardata[i].coord.y, this.cardata[i].coord.x]
        this.cardatalistCoord.push(setting)
      }
    },
    getRandMarker() {
      var listCoord = []
      for(var j=0; j<this.roopdata.length; j++){
        const rand_35 = ((Math.random()*3)+34.5).toFixed(6);
        const rand_126 = ((Math.random()*3)+126.5).toFixed(6);
        listCoord.push([rand_35, rand_126]);
      }
      this.randCoord = listCoord
    },
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
