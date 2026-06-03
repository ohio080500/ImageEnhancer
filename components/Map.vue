<template>
  <div class="map-container">
    <div id="map" class="leaflet-map"></div>

    <!-- Map Controls (Floating) -->
    <div class="map-controls">
      <v-btn
        color="primary"
        @click="getUserLocation"
        :loading="gettingLocation"
        small
        dark
        title="Get your current location"
      >
        <v-icon left small>mdi-crosshairs-gps</v-icon>
        <span class="d-none d-sm-inline">My Location</span>
      </v-btn>
      <v-btn
        color="error"
        @click="clearAllMarkers"
        :disabled="markersList.length === 0"
        small
        dark
        title="Delete all markers"
      >
        <v-icon left small>mdi-delete-sweep</v-icon>
        <span class="d-none d-sm-inline">Clear</span>
      </v-btn>
    </div>

    <!-- Markers List (Bottom Right) -->
    <v-card v-if="markersList.length > 0" class="markers-list">
      <v-card-text class="pa-2">
        <h4 class="subtitle-2 font-weight-bold mb-2">Markers ({{ markersList.length }})</h4>
        <v-list dense>
          <v-list-item 
            v-for="(marker, index) in markersList" 
            :key="index"
            @click="focusMarker(marker)"
            class="marker-item"
          >
            <v-list-item-content>
              <v-list-item-title class="caption">{{ marker.title }}</v-list-item-title>
              <v-list-item-subtitle class="caption">
                {{ marker.lat.toFixed(4) }}, {{ marker.lng.toFixed(4) }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                x-small
                @click.stop="removeMarkerByIndex(index)"
              >
                <v-icon x-small>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Marker Details Popup -->
    <v-card v-if="selectedMarker" class="marker-detail-popup">
      <v-card-title class="pb-2">
        <div class="d-flex justify-space-between align-center w-100">
          <span>{{ selectedMarker.title }}</span>
          <v-btn icon small @click="selectedMarker = null">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-2">
        <p class="mb-2">
          <strong>Latitude:</strong> {{ selectedMarker.lat.toFixed(6) }}<br>
          <strong>Longitude:</strong> {{ selectedMarker.lng.toFixed(6) }}
        </p>
        <p v-if="selectedMarker.description" class="mb-0">
          <strong>Added:</strong> {{ selectedMarker.description }}
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'MapComponent',
  data() {
    return {
      mapInstance: null,
      currentLocation: {
        lat: 14.5994,
        lng: 121.0054
      },
      currentZoom: 12,
      gettingLocation: false,
      markersList: [],
      selectedMarker: null
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initializeMap()
      this.setupMapEvents()
    })
  },

  beforeDestroy() {
    this.$map.destroyMap()
  },

  methods: {
    initializeMap() {
      if (!window.L) {
        console.error('Leaflet not loaded')
        return
      }

      this.$map.initMap('map', {
        lat: this.currentLocation.lat,
        lng: this.currentLocation.lng,
        zoom: this.currentZoom
      })

      this.updateMarkersList()
    },

    setupMapEvents() {
      if (!this.$map.getMapInstance()) return

      const mapInstance = this.$map.getMapInstance()

      mapInstance.on('zoomend', () => {
        this.currentZoom = mapInstance.getZoom()
      })

      mapInstance.on('moveend', () => {
        const center = mapInstance.getCenter()
        this.currentLocation.lat = center.lat
        this.currentLocation.lng = center.lng
      })
    },

    getUserLocation() {
      this.gettingLocation = true
      this.$map.getCurrentLocation()
        .then((location) => {
          this.currentLocation.lat = location.lat
          this.currentLocation.lng = location.lng
          this.$map.centerMap(location.lat, location.lng, 15)
        })
        .catch((error) => {
          console.error('Location error:', error)
        })
        .finally(() => {
          this.gettingLocation = false
        })
    },

    clearAllMarkers() {
      this.$map.clearMarkers()
      this.markersList = []
    },

    removeMarkerByIndex(index) {
      const marker = this.$map.getMarkers()[index]
      if (marker) {
        this.$map.removeMarker(marker)
        this.updateMarkersList()
      }
    },

    updateMarkersList() {
      this.markersList = this.$map.getMarkers().map(marker => marker.data)
    },

    focusMarker(marker) {
      this.selectedMarker = marker
      this.$map.centerMap(marker.lat, marker.lng, 16)
    }
  }
}
</script>

<style scoped>
.map-container {
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
  position: relative;
  margin: 0;
  overflow: hidden;
}

.leaflet-map {
  height: 100%;
  width: 100%;
  border-radius: 0;
  border: none;
  flex: 1;
}

.map-controls {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1000;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.markers-list {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 320px;
  max-height: 40vh;
  overflow-y: auto;
  z-index: 999;
  background: rgba(255, 255, 255, 0.98);
}

.marker-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.marker-item:hover {
  background-color: #f5f5f5;
}

.marker-detail-popup {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 300px;
  z-index: 998;
  background: rgba(255, 255, 255, 0.98);
}

::v-deep .leaflet-container {
  font-family: inherit;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .map-controls {
    top: 8px;
    left: 8px;
    gap: 4px;
  }

  .markers-list {
    bottom: 8px;
    right: 8px;
    width: calc(100vw - 32px);
    max-width: 320px;
  }

  .marker-detail-popup {
    top: 8px;
    right: 8px;
    width: calc(100vw - 32px);
    max-width: 300px;
  }
}
</style>
