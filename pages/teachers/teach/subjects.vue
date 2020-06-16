<template>
  <div>
    <h3>{{ params }}</h3>
  </div>
</template>

<script>
  export default {
    mounted () {
      this.params = this.$route.params
      // conslode.log('route params', this.$route.query)
      console.log(this.$route.params)
      this.getTeachByTeacher().then(result => (this.items = result))
    },
    data() {
      return {
        params: '',
        items: []
      }
    },
    methods: {
      async getTeachByTeacher (teacherId) {
        const response = await this.$store.dispatch('teach/getTeachByTeacherId', teacherId)
        console.log('response', response)
        return response
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>