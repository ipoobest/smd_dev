<template>
  <div>
    <h3>{{ params }}</h3>
  </div>
</template>

<script>
  export default {
    layout: 'teacher',
    mounted () {
      this.params = this.$route.params
      // conslode.log('route params', this.$route.query)
      console.log(this.$route.params)
      this.getTeachByTeacherId(this.$route.params.id).then(result => (this.items = result))
    },
    data() {
      return {
        params: '',
        items: []
      }
    },
    methods: {
      async getTeachByTeacherId (teacherId) {
       const data = {
           'schoolYear': this.$route.params.schoolYear,
           'term': this.$route.params.term,
           'teacher.value': 'q5BHP59DvT'
        }
        const response = await this.$store.dispatch(`teach/getTeachByTeacherId`, data )
        console.log('response', response)
        return response
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>