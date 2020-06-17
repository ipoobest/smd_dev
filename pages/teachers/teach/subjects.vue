<template>
  <div>
    <h3>{{ teachObjectId }}</h3>
  </div>
</template>

<script>
  export default {
    layout: 'teacher',
    mounted () {
      this.params = this.$route.params
      this.teachObjectId = this.$store.state.auth.auth.teacherObjectId
      // conslode.log('route params', this.$route.query)
      console.log(this.teachObjectId)
      this.getTeachByTeacherId(this.teachObjectId).then(result => (this.items = result))
    },
    data() {
      return {
        params: '',
        teachObjectId: '',
        items: []
      }
    },
    methods: {
      async getTeachByTeacherId (teacherId) {
       const data = {
           'schoolYear': this.$route.params.schoolYear,
           'term': this.$route.params.term,
           'teacher.value': teacherId
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