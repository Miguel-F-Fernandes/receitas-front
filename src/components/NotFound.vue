<template>
  <v-container class="d-flex flex-column justify-center align-center" style="height: 100%">
    <p class="text-h2">Page not found</p>
    <p>Redirecting you in {{ count }} . . .</p>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      count: 5,
    }),

    mounted() {
      this.countdown()
    },

    methods: {
      countdown() {
        setTimeout(() => {
          if (this.count === 1) {
            this.$router.push({
              path: '/',
            })
          }
          this.count -= 1
          this.countdown()
        }, 1000)
      },
    },
  }
</script>

<style scoped lang="scss"></style>
