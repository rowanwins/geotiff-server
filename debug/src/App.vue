<template>
    <Row id="app">
      <Col span="10" class="sidebar">
      <h3>Scene ID</h3>
        <Input v-model="value" placeholder="Enter a scene id" style="width: 300px" v-on:on-enter="imageryIdSet"/>
      </Col>
      <Col span="14">
        <div id="map"></div>
      </Col>
  </Row>
</template>

<script>
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
let lamdbaLayer = null
let map = null
export default {
  name: 'app',
  data: function () {
    return {
      value: 'S2A_OPER_MSI_ARD_TL_EPAE_20190828T022125_A021835_T54KWC_N02.08',
      baseUrl: 'https://fngolf6uu6.execute-api.ap-southeast-2.amazonaws.com/production/',
      provider: 'DEA',
      pMin: 630,
      pMax: 2646
    }
  },
  mounted () {
    map = L.map('map').setView([-20.4, 141.4], 12)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map)

    lamdbaLayer = L.tileLayer(`${this.baseUrl}tiles/{x}/{y}/{z}.jpeg?sceneId={sceneId}&pMin={pMin}&pMax={pMax}&provider={provider}`, {
      sceneId: this.value,
      provider: this.provider,
      pMin: this.pMin,
      pMax: this.pMax
    }).addTo(map)

  },
  methods: {
    imageryIdSet: async function () {

      const metadata = await axios(`${this.baseUrl}metadata?sceneId=${this.value}&provider=${this.provider}&bands=b4,b3,b2`)

      map.fitBounds([
        [metadata.data.wgsBbox[1], metadata.data.wgsBbox[0]],
        [metadata.data.wgsBbox[3], metadata.data.wgsBbox[2]]
      ])

      lamdbaLayer.options.sceneId = this.value
      lamdbaLayer.options.pMin = Math.min(...metadata.data.bandInformation.map(b => b.stats.percentiles[0]))
      lamdbaLayer.options.pMax = Math.max(...metadata.data.bandInformation.map(b => b.stats.percentiles[1]))

      lamdbaLayer.redraw()
    }
  }
}
</script>

<style>
    html, body, #app, .ivu-col, #map {
      height: 100%;
      margin: 0px;
    }
    .sidebar{
      padding: 50px;
    }

</style>
