<template>
  <div ref="lottieContainer"></div>
</template>

<script>
import lottie from 'lottie-web'

export default {
  props: {
    animationPath: {
      type: String,
      required: true,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    fetch(this.animationPath)
      .then((response) => response.json())
      .then((animationData) => {
        lottie.loadAnimation({
          container: this.$refs.lottieContainer,
          renderer: 'svg',
          loop: this.loop,
          autoplay: this.autoplay,
          animationData: animationData,
        })
      })
      .catch((error) => console.error('Error loading Lottie animation:', error))
  },
  beforeDestroy() {
    lottie.destroy()
  },
}
</script>
