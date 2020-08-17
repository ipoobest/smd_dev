<template>
  <v-container>
    <v-row>
      <v-btn class="mr-5" color="primary" fab small dark @click="back" >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>    
      <v-col md="2">
        <h3>ลงคะแนนนักเรียน</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md="2">
        <v-text-field
          v-model="score_aptitude"
          label="คุณลักษณะ"
          outlined
          type="number"
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-text-field
          v-model="score_analytical_thinking"
          label="การคิดการอ่าน"
          outlined
          type="number"
        ></v-text-field>
      </v-col>
       <v-col md="2">
       <v-btn color="info" class="mt-2">
         เกณฑ์การตัดเกรด
       </v-btn>
      </v-col>
    </v-row>
    <v-simple-table fixed-header  height="450px" v-if="rating" >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">ชื่อ</th>
            <!--- this header -->
            <th class="text-left" v-for="item in rating" :key="item.name">{{item.name}} , {{item.score}} คะแนน</th>
            <th class="text-left">คุณลักษณะ</th>
            <th class="text-left">การคิดการอ่าน</th>
            <th class="text-left">ดำเนินการ</th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="student in items" :key="student.name">
            <td > {{ student }} </td>
            <td v-for="item in rating.length" :key="item.name"><v-text-field  type="number" hide-details="auto"  @click="logId(form.score_id[item])" /></td>
            <td><v-text-field v-model="score_aptitude" type="text" hide-details="auto" /></td>
            <td><v-text-field v-model="score_analytical_thinking"  type="text" hide-details="auto" /></td>
            <td><v-btn color="success" @click="logId(student)">บันทึก</v-btn></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
      <h3 v-else>กรุณาเพิ่ทเกณฑ์การให้คะแนน</h3>
  <v-row justify="end">
    <!-- <v-btn color="orange" dark class="mr-2">reset form</v-btn> -->
    <v-btn color="success" @click="save">บันทึกทั้งหมด</v-btn>
  </v-row>
  </v-container>
</template>

 <script>
  export default {
    layout: 'teacher',
    async mounted () {
      await this.getStudentByTeach().then(result => (this.students = result))
      await this.getStudent(this.students).then(result => (this.items = result))
      await this.getTechById(this.$route.query.id).then(result => (this.rating = result))
      console.log('this.data', this.rating)
      
    },
    data() {
      return {
        title: 'เพิ่มคะแนนให้นักเรียน',
        rating: [
          // { name: 'กรุณาเพิ่ทเกณฑ์การให้คะแนน', rating: 0}
        ],
        form: {
          score_id: []
        },
        data: '',
        items: '',
        score: [],
        studentName: [],
        score_analytical_thinking: '',
        score_aptitude: '',
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
        const response = await this.$store.dispatch('teach/getSubjectsByConditions', conditions)
        console.log('response students', response.results[0].students)
        return response.results[0].students
      },
      async getStudent(data) {
        const query = {
          objectId: {
            $in: data
          }
      }
        const response = await this.$store.dispatch('students/getStudents', query)
        console.log('response student test', response.results)
        var name = this.getStudentName(response.results)
        return name
      },
      async getTechById (id) {
        const response = await this.$store.dispatch('teach/getTeachById', id)
        console.log('response rating', response.rating)
        return response.rating
      },
      getStudentName(item) {
        for(var index = 0; index < item.length; index++) {
          this.studentName.push(item[index].tth + " " + item[index].namet + " " + item[index].snamet)
        }
        console.log('student name', this.studentName)
        return  this.studentName
      },
      addScore() {
        console.log('item id ', item)
        // this.getUserByTacherId(item.teacherId)
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)

        this.dialog = true
      },
      logId(item) {
        console.log(item)
      },
      save () {
        console.log('this.score', this.score)
      },
      close () {},
      reset () {},
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
