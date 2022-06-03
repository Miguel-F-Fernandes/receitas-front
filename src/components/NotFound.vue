<template>
  <v-container class="d-flex flex-column justify-center align-center" style="height: 100%">
    <p class="text-h2">{{ $i18n.t('not-found.text') }}</p>
    <p>{{ $i18n.t('not-found.redirecting') }} {{ count }} . . .</p>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      count: 5,
    }),

    created() {
      document.title = this.$i18n.t(`toolbar-title.${this.$route.name}`)
      this.$watch(
        () => this.$i18n.locale,
        () => {
          document.title = this.$i18n.t(`toolbar-title.${this.$route.name}`)
        }
      )
    },

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
