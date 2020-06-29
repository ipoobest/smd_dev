<template>
  <div>
    <p>
        {{
          `schoolYear: ${this.$route.query.schoolYear},
          term: ${this.$route.query.term},
          classRoomLevel: ${this.$route.query.classRoomLevel},
          classRoomName: ${this.$route.query.classRoomName}`
        }}
    </p>
    <p>
      รายชื่อนักเรียน : 
      {{
      students
      }}
    </p>
  </div>
</template>

<script>
  export default {
    layout: 'teacher',
    async mounted () {
      await this.getStudentByTeach().then(result => (this.students = result))
      await this.getStudent(this.students).then(result => (this.items = result))
    },
    data() {
      return {
        title: 'เพิ่มคะแนนให้นักเรียน',
        dialog: false,
        formTitle: 'tesst',
        headers: [],
        search: '',
        data: '',
        items:[],
        students: [],
      }
    },
    methods: {
      async getStudentByTeach(data) {
        const conditions = {
          schoolYear: this.$route.query.schoolYear,
          term: this.$route.query.term,
          classRoomLevel: this.$route.query.classRoomLevel,
          classRoomName: this.$route.query.classRoomName
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
      },
      addScore() {
        console.log('item id ', item)
        // this.getUserByTacherId(item.teacherId)
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)

        this.dialog = true
      },
      save () {},
      close () {},
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
