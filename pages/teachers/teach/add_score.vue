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
         <v-btn @click="addScoreX">เพิ่ม</v-btn>
      </v-col>
    </v-row>
    <v-simple-table fixed-header v-if="rating" >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">ชื่อ</th>
            <!--- this header -->
            <th class="text-left" v-for="item in rating" :key="item.name">{{item.score}} คะแนน, {{item.rating}} % </th>
            <th class="text-left">คุณลักษณะ</th>
            <th class="text-left">การคิดการอ่าน</th>
            <th class="text-left">คะแนนรวม</th>
            <th class="text-left">เกรด</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item_score in score" :key="item_score.studentName" >
            <td > {{ item_score.studentName }} </td>
              <td v-for="(item_in, index) in  item_score.score" :key="index">
                <v-text-field  v-model="item_score.score[index]" :value="item_in" type="number" hide-details="auto" /> 
              </td>
            <td><v-text-field v-model="item_score.aptitude"  type="number" hide-details="auto" /></td>
            <td><v-text-field v-model="item_score.analytical_thinking" type="number" hide-details="auto" /></td>
            <!-- <td><v-text-field  type="number" style="text-align:justify" hide-details="auto" /></td> -->
            <!-- <td>{{calcScore(item_score.score)}}</td> -->
            <td>{{item_score.score}}</td>
            <td ><p type="text" hide-details="auto" /></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
      <h3 v-else>กรุณาเพิ่มเกณฑ์การให้คะแนน</h3>
  <v-row justify="end">
    <!-- <v-btn color="orange" dark class="mr-2">reset form</v-btn> -->
    <v-btn class="success mt-5 mr-5" @click="updateGrade">บันทึก</v-btn>
  </v-row>
  </v-container>
</template>

 <script>
  export default {
    layout: 'teacher',
    async mounted () {
      await this.getTechById(this.$route.query.id).then(result => (this.items = result))
      await this.getGradeByConditions(this.items).then(result => (this.grade_list = result))
      // console.log('getGrade', this.grade_list)
      
    },
    data() {
      return {
        title: 'เพิ่มคะแนนให้นักเรียน',
        rating: [
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
        grade_list: [],
        grade_array: [],
        students: [],
        grade: '',
        ratio_array: [],
        score_array: []
      }
    },
    methods: {
      async getGradeByConditions(item) {
        console.log('teachId xxxx', item.objectId)
        const conditions = {
          teachId: item.objectId
        }
        const response = await this.$store.dispatch('grade/getGradeByConditions', conditions)
        console.log('response grade xxx', response)
        if(response.results.length == 0) {
          this.createGrade()
        } else {
          console.log('this responbse', response.results)
          this.score =  response.results.slice()
          this.mapScore(response.results)
          console.log('this score', this.score)
          return response.results
        }
      },
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
        console.log('this.item', response)
        this.rating = response.rating
        this.mapRating(this.rating)
        return response
      },
      async createGrade () {
        await this.getStudent(this.items.students).then(result => (this.students = result))

        var initScore =  new Array(this.rating.length)
        initScore.fill(0)
       
        console.log('init sxoew', initScore)
        for(var index = 0; index < this.rating.length; index ++) {
          const data = {
            teachId: this.items.objectId,
            subject: this.items.sname,
            schoolYear: this.items.schoolYear,
            term: this.items.term,
            classRoomLevel: this.items.classRoomLevel,
            classRoomName: this.items.classRoomName,
            studentName: this.students[index],
            score: initScore,
            grade: '',
            aptitude: '',
            analytical_thinking: ''
          }
          // console.log('date create', data)
          const response = await this.$store.dispatch(`grade/createGrade`, data);
          // console.log("response create grade", response);
        }
        this.getGradeByConditions(this.items).then(result => (this.grade = result))
      },
      async updateGrade () {
        this.score.forEach(item => {
          // var objId = item.objectId
          var data = {
            objectId: item.objectId,
            score: item.score,
            aptitude: item.aptitude,
            analytical_thinking: item.analytical_thinking,
          }
          console.log('score', data)
          const response = this.$store.dispatch(`grade/updateGrade`, data);
          console.log('response')
        })
      },
      getStudentName(item) {
        for(var index = 0; index < item.length; index++) {
          this.studentName.push(item[index].tth + " " + item[index].namet + " " + item[index].snamet)
        }
        console.log('student name', this.studentName)
        return  this.studentName
      },
      mapRating(rating) {
        rating.forEach(item => {
          this.ratio_array.push(item.rating)
          this.score_array.push(item.score)
        })
        console.log('this.ratio_array',this.ratio_array)
      },
      mapScore(score) {
        this.score = score
        this.score.forEach(item => {
          item.score_totle = calcScore(item.score)
        })
      },
      addScore() {
        console.log('item id ', item)
        // this.getUserByTacherId(item.teacherId)
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)

        this.dialog = true
      },
      calcScore(score_array) {
        var calc_score = []
        score_array.forEach((score,index) => {
          var result = score * this.score_array / this.ratio_array[index] / 100
          var result = ((( score / this.score_array[index] ) * 100) / 100 ) *  this.ratio_array[index]
          // ((( คะแนนที่ได้ / คะแนนเต็ม ) x 100) / 100 ) x ร้อยละ
          calc_score.push(result)
        })
        var sum_score = calc_score.reduce((a,b) => a+b)
        return sum_score.toFixed(2) 
      },
      addScoreX() {
       this.score.forEach(item => {
          item.aptitude = this.score_aptitude
          item.analytical_thinking = this.score_analytical_thinking
        })
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
