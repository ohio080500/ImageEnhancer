import Vue from 'vue'

// Map Plugin using Leaflet.js and OpenStreetMap (free, no API key needed)
const MapPlugin = {
  install(Vue) {
    Vue.prototype.$map = {
      mapInstance: null,
      markers: [],

      /**
       * Initialize Leaflet map
       * @param {string} elementId - ID of the HTML element to mount map
       * @param {Object} options - Map configuration
       * @param {number} options.lat - Initial latitude (default: 14.5994 - Philippines center)
       * @param {number} options.lng - Initial longitude (default: 121.0054 - Philippines center)
       * @param {number} options.zoom - Initial zoom level (default: 12)
       */
      initMap(elementId, options = {}) {
        const L = window.L
        if (!L) {
          console.error('Leaflet library not loaded. Make sure to include Leaflet in your HTML or Nuxt config.')
          return null
        }

        const latitude = options.lat || 14.5994 // Philippines
        const longitude = options.lng || 121.0054
        const zoom = options.zoom || 12

        // Create map instance
        this.mapInstance = L.map(elementId).setView([latitude, longitude], zoom)

        // Add OpenStreetMap tiles (free, no API key needed)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(this.mapInstance)

        return this.mapInstance
      },

      /**
       * Add a marker to the map
       * @param {number} lat - Latitude
       * @param {number} lng - Longitude
       * @param {Object} options - Marker options
       * @param {string} options.title - Marker title
       * @param {string} options.description - Marker description
       * @param {string} options.icon - Icon color ('red', 'blue', 'green', etc.)
       * @returns {Object} Marker object
       */
      addMarker(lat, lng, options = {}) {
        const L = window.L
        if (!this.mapInstance) {
          console.error('Map not initialized')
          return null
        }

        const title = options.title || 'Marker'
        const description = options.description || ''
        const iconColor = options.icon || 'blue'

        // Create custom marker icon
        const markerIcon = L.icon({
          iconUrl: this.getMarkerIconUrl(iconColor),
          iconSize: [32, 41],
          iconAnchor: [16, 41],
          popupAnchor: [0, -41]
        })

        const marker = L.marker([lat, lng], { icon: markerIcon })
          .addTo(this.mapInstance)
          .bindPopup(`<strong>${title}</strong><br>${description}`)

        marker.data = { lat, lng, title, description, icon: iconColor }
        this.markers.push(marker)

        return marker
      },

      /**
       * Get marker icon URL based on color
       * Uses a simple colored circle icon from a public CDN
       */
      getMarkerIconUrl(color) {
        const colors = {
          red: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          blue: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          green: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          gold: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
          orange: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
          violet: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
          grey: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
          black: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png'
        }
        return colors[color] || colors.blue
      },

      /**
       * Remove a marker from the map
       * @param {Object} marker - Marker object to remove
       */
      removeMarker(marker) {
        if (!this.mapInstance) return

        this.mapInstance.removeLayer(marker)
        const index = this.markers.indexOf(marker)
        if (index > -1) {
          this.markers.splice(index, 1)
        }
      },

      /**
       * Clear all markers
       */
      clearMarkers() {
        this.markers.forEach(marker => {
          this.mapInstance.removeLayer(marker)
        })
        this.markers = []
      },

      /**
       * Center map on coordinates
       * @param {number} lat - Latitude
       * @param {number} lng - Longitude
       * @param {number} zoom - Zoom level (optional)
       */
      centerMap(lat, lng, zoom) {
        if (!this.mapInstance) return

        this.mapInstance.setView([lat, lng], zoom || this.mapInstance.getZoom())
      },

      /**
       * Fit map to all markers
       */
      fitToMarkers() {
        if (!this.mapInstance || this.markers.length === 0) return

        const group = window.L.featureGroup(this.markers)
        this.mapInstance.fitBounds(group.getBounds())
      },

      /**
       * Get user's current location
       * @returns {Promise} Promise with location data
       */
      getCurrentLocation() {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'))
            return
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
              })
            },
            (error) => {
              reject(error)
            }
          )
        })
      },

      /**
       * Add circle/radius to map
       * @param {number} lat - Latitude
       * @param {number} lng - Longitude
       * @param {number} radius - Radius in meters
       * @param {Object} options - Circle options
       */
      addCircle(lat, lng, radius, options = {}) {
        const L = window.L
        if (!this.mapInstance) return null

        const circle = L.circle([lat, lng], {
          color: options.color || '#3388ff',
          fillColor: options.fillColor || '#3388ff',
          fillOpacity: options.fillOpacity || 0.2,
          radius: radius,
          weight: options.weight || 2
        }).addTo(this.mapInstance)

        return circle
      },

      /**
       * Get map instance
       */
      getMapInstance() {
        return this.mapInstance
      },

      /**
       * Get all markers
       */
      getMarkers() {
        return this.markers
      },

      /**
       * Destroy map
       */
      destroyMap() {
        if (this.mapInstance) {
          this.mapInstance.remove()
          this.mapInstance = null
          this.markers = []
        }
      }
    }
  }
}

Vue.use(MapPlugin)
