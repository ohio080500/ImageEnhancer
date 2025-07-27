<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Auto Image Enhancer</h1>
    
    <label class="file-input-label">
      Choose File
      <input type="file" @change="loadImage" accept="image/*" class="file-input" />
    </label>

    <div v-if="imageLoaded" class="mt-4">
      
      <div class="canvas-row">
        <div class="canvas-wrapper">
          <p class="label">Before</p>
          <canvas ref="originalCanvas" class="border canvas"></canvas>
        </div>
        <div class="canvas-wrapper">
          <p class="label">After</p>
          <canvas 
            ref="enhancedCanvas" 
            class="border canvas"
            :style="{ opacity: transitionValue / 100 }"
          ></canvas>
        </div>
      </div>

      <button @click="downloadImage" class="download-btn mt-4 px-4 py-2 rounded">
        Download Enhanced Image
      </button>
    </div>
  </div>
</template>

<script>
import enhancePlugin from '~/plugins/enhancePlugin';

export default {
  data() {
    return {
      image: null,
      imageLoaded: false,
      transitionValue: 100,
    };
  },
  methods: {
    loadImage(event) {
      const file = event.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.image = img;
          this.imageLoaded = true;
          this.$nextTick(() => this.processImages());
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    processImages() {
      if (!this.image || !this.$refs.originalCanvas || !this.$refs.enhancedCanvas) return;

      const originalCanvas = this.$refs.originalCanvas;
      const originalCtx = originalCanvas.getContext('2d');
      originalCanvas.width = this.image.naturalWidth;
      originalCanvas.height = this.image.naturalHeight;
      originalCtx.drawImage(this.image, 0, 0);
      
      const originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);

      const enhancedCanvas = this.$refs.enhancedCanvas;
      const enhancedCtx = enhancedCanvas.getContext('2d');
      enhancedCanvas.width = this.image.naturalWidth;
      enhancedCanvas.height = this.image.naturalHeight;
      
      const enhancedImageData = enhancePlugin.apply(originalImageData);
      enhancedCtx.putImageData(enhancedImageData, 0, 0);
    },
    downloadImage() {
      if (!this.$refs.enhancedCanvas) return;
      const canvas = this.$refs.enhancedCanvas;
      const link = document.createElement('a');
      link.download = 'enhanced-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }
};
</script>

<style scoped>
input[type="range"] {
  cursor: pointer;
}
canvas {
  height: auto;
  max-width: 100%;
  border: 1px solid #444;
  display: block;
}


div.p-4 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #121212;
  color: #eee;

  max-width: 900px;
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
}


.canvas-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: nowrap; 
  overflow-x: auto; 
}


.canvas-wrapper {
  flex: 0 0 45%;
  max-width: 45%;
  min-width: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #ccc;
  user-select: none;
}


.file-input-label {
  background-color: #1e40af;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  user-select: none;
  margin-bottom: 1rem;
}

.file-input-label:hover {
  background-color: #2563eb;
}

.file-input {
  display: none; 
}


.download-btn {
  background-color: #16a34a;
  color: white;
  font-weight: 600;
  border: none;
  transition: background-color 0.3s ease;
}

.download-btn:hover {
  background-color: #22c55e;
}

button {
  cursor: pointer;
}
</style>
