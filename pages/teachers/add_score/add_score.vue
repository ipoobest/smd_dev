<template>
  <v-container>
    <v-row>
      <v-btn class="mr-5" color="primary" fab small dark @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-col md="2">
        <h3>ลงคะแนนนักเรียน</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md="2">
        <v-text-field
          v-model="score_aptitude"
          :rules="[
            (v) => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
            (v) => v <= 3 || 'กรุณากรอกคะแนนให้น้อยกว่า 3',
          ]"
          label="คุณลักษณะ"
          outlined
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-text-field
          v-model="score_analytical_thinking"
          :rules="[
            (v) => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
            (v) => v <= 3 || 'กรุณากรอกคะแนนให้น้อยกว่า 3',
          ]"
          label="การคิดการอ่าน"
          outlined
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-btn @click="addScoreX">เพิ่ม</v-btn>
      </v-col>
    </v-row>
    <v-row
      class="mb-5 pl-5"
      v-bind:style="
        !items.approved ? 'border: border: 1px solid red; ' : 'border: none;'
      "
    >
      <div v-if="items.send_score">
        <h3 v-if="!items.approved" class="blue--text">รออนุมัติ</h3>
      </div>
      <div v-if="items.approved">
        <h3 v-if="items.assessment" class="green--text">อนุมัติ</h3>
        <v-col v-else cols="12">
          <v-row>
            <h4>หมายเหตุจากหัวหน้ากลุ่มสาระ</h4>
          </v-row>
          <v-row>
            <p class="red--text">{{ items.approve_message }}</p>
          </v-row>
        </v-col>
      </div>
    </v-row>
    <v-simple-table fixed-header v-if="rating">
      <template v-slot:default>
        <thead>
          <tr>
            <th>เลขที่</th>
            <th>รหัส</th>
            <th class="text-left">ชื่อ</th>
            <!--- this header -->
            <th class="text-left" v-for="(item, index) in rating" :key="index">
              {{ item.name }}, {{ item.score }} , {{ item.rating }} %
            </th>
            <th class="text-left">คุณลักษณะ</th>
            <th class="text-left">การคิดการอ่าน</th>
            <th class="text-left">คะแนนรวม</th>
            <th class="text-left">เกรด</th>
            <th class="text-left">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <v-col v-if="rating.length == 0">
            <v-row justify="center">
              <h2>กรุณาเพิ่มเกณฑ์การให้คะแนน</h2>
              <v-btn color="error" @click="addCriteria()"
                >เพิ่มเกณฑ์การให้คะแนน</v-btn
              >
            </v-row>
          </v-col>
          <tr
            v-for="(item_score, score_index) in sortNumberStudent"
            :key="item_score.studentObjectId"
          >
            <td>{{ item_score.studentNumber }}</td>
            <td>{{ item_score.studentId }}</td>
            <td>{{ item_score.studentName }}</td>
            <td v-for="(item_in, index) in item_score.score" :key="index">
              <v-text-field
                v-model="item_score.score[index]"
                :value="item_in"
                :max="score_array[index]"
                :min="0"
                :rules="[
                  (v) => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
                  (v) =>
                    v <= parseInt(score_array[index]) ||
                    `กรุณากรอกคะแนนให้น้อยกว่า ${score_array[index]}`,
                ]"
                hide-details="auto"
                :disabled="items.save_score"
              />
            </td>
            <td>
              <v-text-field
                v-model="item_score.aptitude"
                :max="3"
                :min="0"
                :rules="[
                  (v) => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
                  (v) => v <= 3 || 'กรุณากรอกคะแนนให้น้อยกว่า 3',
                ]"
                :disabled="items.save_score"
                hide-details="auto"
              />
            </td>
            <td>
              <v-text-field
                v-model="item_score.analytical_thinking"
                :max="3"
                :min="0"
                :rules="[
                  (v) => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
                  (v) => v <= 3 || 'กรุณากรอกคะแนนให้น้อยกว่า 3',
                ]"
                :disabled="items.save_score"
                hide-details="auto"
              />
            </td>
            <td>{{ calcScore(item_score.score, score_index) }}</td>

            <td v-if="edit_mode[score_index]">
              <template v-if="item_score.grade_option">{{
                item_score.grade_option
              }}</template>
              <template v-else>{{ item_score.grade }}</template>
            </td>
            <td v-else>
              <v-select
                v-model="item_score.grade_option"
                :items="item_grade_option"
              />
            </td>

            <td>
              <v-btn
                v-if="edit_mode[score_index]"
                class="info mt-5 mr-3"
                @click="editMode(score_index)"
                >แก้ไข</v-btn
              >
              <v-btn
                v-else
                class="success mt-5 mr-3"
                @click="fixedGrade(score_index)"
                >บันทึก</v-btn
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div v-else>
      <h3>กรุณาเพิ่มเกณฑ์การให้คะแนน</h3>
    </div>

    <v-row justify="center">
      <!-- <v-btn color="orange" dark class="mr-2">reset form</v-btn> -->
      <v-btn v-if="!items.send_score" class="info mt-5 mr-5" @click="sendGrade"
        >ส่งคะแนน</v-btn
      >
      <v-btn class="success mt-5 mr-5" @click="previewGrade" dark
        >รายงานเกรด</v-btn
      >
      <v-btn class="success mt-5 mr-5" @click="previewSummary" dark>ปพ.5</v-btn>
      <!-- <v-btn class="success mt-5 mr-5" @click="previewTscore" dark>Preview3</v-btn> -->
      <div v-if="!items.send_score">
        <v-btn
          class="success mt-5 mr-5"
          v-if="!items.save_score"
          @click="updateGrade"
          >บันทึก</v-btn
        >
        <v-btn
          v-if="items.save_score"
          class="orange mt-5 mr-5"
          @click="editAllGrade"
          dark
          >แก้ไข</v-btn
        >
      </div>
      <!-- <div v-else>
         <v-btn
          class="success mt-5 mr-5"
          v-if="!items.save_score"
          @click="updateGrade"
          >บันทึก</v-btn
        >
        <v-btn v-if="!items.save_score" class="orange mt-5 mr-5" @click="editAllGrade" dark 
          >แก้ไข</v-btn
        >
      </div> -->
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: "teacher",
  layout: "teacher",
  async mounted() {
    await this.getTechById(this.$route.query.id).then(
      (result) => (this.items = result)
    );
    await this.getGradeByConditions(this.items).then(
      (result) => (this.grade_list = result)
    );
    await this.getCriteria().then((result) => (this.criteria = result));
  },
  computed: {
    sortNumberStudent() {
      return this.score.sort((a, b) => a.studentNumber - b.studentNumber);
    },
  },

  data() {
    return {
      title: "เพิ่มคะแนนให้นักเรียน",
      edit_mode: [],
      rating: [],
      form: {
        score_id: [],
      },
      data: "",
      items: {
        save_score: false,
      },
      score: [],
      studentName: [],
      studentId: [],
      score_analytical_thinking: "",
      score_aptitude: "",
      grade: [],
      grade_arr: [],
      grade_list: [],
      grade_array: [],
      criteria: [],
      ratio_array: [],
      score_array: [],
      studentsId: [],
      students: [],
      stu_grade_arr: [],
      stu_classes_arr: [],
      total_score: "",
      item_grade_option: [
        { text: "0-4", value: null },
        { text: "ขส", value: "ขส" },
        { text: "ผ", value: "ผ" },
        { text: "มผ", value: "มผ" },
        { text: "ร", value: "ร" },
        { text: "รส", value: "รส" },
        { text: "มส", value: "มส" },
      ],
    };
  },
  methods: {
    async getGradeByConditions(item) {
      console.log("get grade", item.objectId);
      const conditions = {
        // "teachInfo.teachId": item.objectId
        teachId: item.objectId,
        // teach: {
        //   "__type": "Pointer",
        //   "className": "Teach",
        //   "objectId": item.objectId
        // }
      };

      // 1 get stu array grade
      const response_grade = await this.$store.dispatch(
        "grade/getGradeByConditions",
        conditions
      );
      console.log("get grade item", response_grade);
      //
      this.score = response_grade.results;
      this.edit_mode = new Array(this.score.length);
      this.edit_mode.fill(true);
      this.grade_arr = response_grade.results;
      this.stu_grade_arr = await this.grade_arr.map((a) => a.studentObjectId);
      //

      if (item.students) {
        this.stu_classes_arr = item.students;
      } else {
        // 2 get stu array class
        const response_classes = await this.$store.dispatch(
          `classes/getClass`,
          this.items.classId
        );
        this.stu_classes_arr = response_classes.studentId;
        //
      }
      // 3 check diff
      var difference = this.stu_classes_arr.filter(
        (x) => !this.stu_grade_arr.includes(x)
      );
      //

      // 4 createGrade by diff
      if (difference.length != 0) {
        this.createGrade(difference);
      } else {
        //
        return response_grade.results;
      }
    },
    async getStudentByTeach(data) {
      const conditions = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.$route.query.classRoomLevel,
        classRoomName: this.$route.query.classRoomName,
      };
      const response = await this.$store.dispatch(
        "teach/getSubjectsByConditions",
        conditions
      );
      //
      return response.results[0].students;
    },
    async getStudent(data) {
      //
      const query = {
        objectId: {
          $in: data,
        },
      };
      const response = await this.$store.dispatch(
        "students/getStudents",
        query
      );
      //
      var values = this.getStudentName(response.results);
      var studentName = values[0];
      var studentId = values[1];
      var studentNumber = values[2];
      //
      //
      return [studentName, studentId, studentNumber];
    },
    async getStudentByClassId(classId) {
      const response = await this.$store.dispatch(`classes/getClass`, classId);

      return response.studentId;
    },
    async getTechById(id) {
      const response = await this.$store.dispatch("teach/getTeachById", id);

      this.rating = response.rating;
      this.mapRating(this.rating);
      console.log("response", response);
      return response;
    },
    async getCriteria() {
      // grade
      const response = await this.$store.dispatch(`criteria/getCriteria`);
      //
      return response.results[0].criteria;
    },
    async createGrade(students) {
      //
      var values = await this.getStudent(students);
      var studentName = values[0];
      var studentId = values[1];
      var studentNumber = values[2];

      //

      //
      var initScore = new Array(this.rating.length);
      initScore.fill(0);
      //
      if (initScore.length == 0) {
        return;
      }
      //
      for (var index = 0; index < studentName.length; index++) {
        console.log("thisssss", this.items);

        const data = {
          //pointer techId,studentObjectId
          teachId: this.items.objectId,
          teach: {
            __type: "Pointer",
            className: "Teach",
            objectId: this.items.objectId,
          },
          subject: {
            __type: "Pointer",
            className: "Subjects",
            objectId: this.items.teachInfo.objectId_subject,
          },
          // teachInfo: {
          //   techId: this.items.objectId,
          //   codet: this.items.subject.codet,
          //   credit: this.items.subject.credit,
          //   sname: this.items.subject.sname,
          // },
          studentName: studentName[index],
          studentObjectId: students[index],
          studentId: studentId[index],
          studentNumber: studentNumber[index],
          schoolYear: this.items.schoolYear,
          term: this.items.term,
          classRoomLevel: this.items.classRoomLevel,
          classRoomName: this.items.classRoomName,
          score: initScore,
          grade_option: null,
          grade: "",
          aptitude: "",
          analytical_thinking: "",
        };
        console.log("create grade data",data);
        const response = await this.$store.dispatch(`grade/createGrade`, data);
      }
      this.getGradeByConditions(this.items).then(
        (result) => (this.grade = result)
      );
    },
    async updateTech(data) {
      const response = this.$store.dispatch(`teach/updateTeach`, data);

      this.getTechById(this.$route.query.id).then(
        (result) => (this.items = result)
      );
    },
    async sendGrade() {
      if (confirm("ยืนยันการส่ง")) {
        var sentScore = {
          objectId: this.items.objectId,
          send_score: true,
        };
        this.items.send_score = true;
        this.updateTech(sentScore);
      }
    },
    async updateGrade() {
      if (confirm("ยืนยันการบันทึก")) {
        this.score.forEach((item) => {
          var data = {
            objectId: item.objectId,
            score: item.score,
            aptitude: item.aptitude,
            analytical_thinking: item.analytical_thinking,
            grade: item.grade.toString(),
            total_score: item.sum_score,
            status: "บันทึก",
          };

          const response = this.$store.dispatch(`grade/updateGrade`, data);
        });
        var saveScore = {
          objectId: this.items.objectId,
          save_score: true,
        };
        //
        // this.items.send_score = true
        this.updateTech(saveScore);
      }
    },
    getStudentName(item) {
      this.studentName = [];
      this.studentId = [];
      this.studentNumber = [];
      for (var index = 0; index < item.length; index++) {
        this.studentName.push(
          item[index].tth + " " + item[index].namet + " " + item[index].snamet
        );
        this.studentId.push(item[index].idstd);
        this.studentNumber.push(item[index].number);
      }

      return [this.studentName, this.studentId, this.studentNumber];
    },
    mapRating(rating) {
      rating.forEach((item) => {
        this.ratio_array.push(item.rating);
        this.score_array.push(item.score);
      });
    },
    calcScore(score_array, index) {
      var calc_score = [];
      //
      score_array.forEach((score, index) => {
        var result =
          (((score / this.score_array[index]) * 100) / 100) *
          this.ratio_array[index];
        // ((( คะแนนที่ได้ / คะแนนเต็ม ) x 100) / 100 ) x ร้อยละ

        calc_score.push(result);
        //
      });

      console.log("calc_score", calc_score);
      var sum_score = calc_score.reduce((a, b) => a + b);
      console.log("sum_score xxx", sum_score);

      this.score[index].sum_score = sum_score.toFixed(2);
      this.score[index].grade = this.calcGrade(sum_score.toFixed(2));
      //
      return sum_score.toFixed(2);
    },
    calcGrade(score) {
      //
      if (score == 100 || score >= this.criteria.g4) {
        return 4;
      } else if (score >= this.criteria.g3_5) {
        return 3.5;
      } else if (score >= this.criteria.g3) {
        return 3;
      } else if (score >= this.criteria.g2_5) {
        return 2.5;
      } else if (score >= this.criteria.g2) {
        return 2;
      } else if (score >= this.criteria.g1_5) {
        return 1.5;
      } else if (score >= this.criteria.g1) {
        return 1;
      } else {
        return 0;
      }
    },
    fixedGrade(index) {
      var item = this.score[index];
      const data = {
        objectId: item.objectId,
        grade: item.grade.toString(),
        grade_option: item.grade_option,
        score: item.score,
      };
      this.$set(this.edit_mode, index, !this.edit_mode[index]);
      const response = this.$store.dispatch(`grade/updateGrade`, data);
      console.log("response", response);
    },
    editMode(index) {
      //
      this.$set(this.edit_mode, index, !this.edit_mode[index]);
    },
    editAllGrade() {
      this.items.save_score = false;
    },
    addScoreX() {
      if (
        this.score_aptitude < 0 ||
        this.score_aptitude > 3 ||
        this.score_analytical_thinking < 0 ||
        this.score_analytical_thinking > 3
      ) {
        alert("กรุณากรอกข้อมูลให้ถูกต้อง");
        return;
      }
      this.score.forEach((item) => {
        item.aptitude = this.score_aptitude;
        item.analytical_thinking = this.score_analytical_thinking;
      });
    },
    addCriteria() {
      this.$router.push({
        name: "teachers-teach-add_scoring_criteria",
        query: { id: this.$route.query.id },
      });
    },
    back() {
      this.$router.go(-1);
    },
    previewGrade() {
      //
      this.$router.push({
        name: "teachers-preview-grade",
        query: { id: this.$route.query.id },
      });
      // this.$router.push({name: 'subjects-id', params: { id: `${item.objectId}`}})
    },
    previewSummary() {
      this.$router.push({
        name: "teachers-preview-grade_summary",
        query: { id: this.$route.query.id },
      });
    },
    previewTscore() {
      this.$router.push({
        name: "teachers-preview-grade_tscore",
        query: { id: this.$route.query.id },
      });
    },
  },
};
</script>
