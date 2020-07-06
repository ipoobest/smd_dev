<template>
  <v-container>
    <h3>ลงคะแนน</h3>
    <v-simple-table fixed-header  height="500px" v-if="rating" >
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">ชื่อ</th>
          <!--- this header -->
          <th class="text-left" v-for="item in rating" :key="item.name">{{item.name}}</th>
          <th class="text-left">คุณลักษณะ</th>
          <th class="text-left">การคิดการอ่าน</th>
          <!-- <th class="text-left">Calories</th>
          <th class="text-left">Calories</th> -->
        </tr>
      </thead>
      <tbody >
        <tr v-for="student in items" :key="student.name">
          <td > {{ student.namet }} </td>
          <td v-for="item in rating.length" :key="item.name"><v-text-field  type="text" hide-details="auto" /></td>
          <td><v-text-field  type="text" hide-details="auto" /></td>
          <td><v-text-field  type="text" hide-details="auto" /></td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  </v-container>
</template>

 <script>
  export default {
    layout: 'teacher',
    async mounted () {
      await this.getStudentByTeach().then(result => (this.students = result))
      await this.getStudent(this.students).then(result => (this.items = result))
      this.getTechById(this.$route.query.id).then(result => (this.rating = result))
      console.log('this.data', this.items)
    },
    data() {
      return {
        title: 'เพิ่มคะแนนให้นักเรียน',
        rating: [
          { name: 'กรุณาเพิ่ทเกณฑ์การให้คะแนน', rating: 0}
        ],
        data: '',
        items: '',
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
        console.log('response student test', response.results)
        return response.results
      },
      async getTechById (id) {
        const response = await this.$store.dispatch('teach/getTeachByid', id)
        console.log('response', response.rating)
        return response.rating
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
