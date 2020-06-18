<template>
  <div>
    <h3>add score {{ data }}</h3>
  </div>
</template>

<script>
  export default {
    layout: 'teacher',
    async mounted () {
      this.data = this.$route.params.data
      await this.getStudentByTeach(this.data).then(result => (this.students = result))
      // await console.log('classtes', this.students)
      await this.getStudent(this.students).then(result => (this.items = result))
    },
    data() {
      return {
        data: '',
        items:[],
        students: []
      }
    },
    methods: {
      async getStudentByTeach(data) {
        const conditions = {
          schoolYear: data.schoolYear,
          term: data.term,
          classRoomLevel: data.classRoomLevel,
          classRoomName: data.classRoomName
        }
        const response = await this.$store.dispatch('classes/getClassesByAcademicYears', conditions)
        console.log('response students', response.results[0].studentId)
        return response.results[0].studentId
      },
      async getStudent(data) {
        const query = {
          objectId: {
            $in: data
          }
      }
        const response = await this.$store.dispatch('students/getStudents', query)
        console.log('response student', response.results)
      }
    }
  }
</script>
