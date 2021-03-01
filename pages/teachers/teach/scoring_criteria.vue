<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-simple-table :headers="headers" :search="search">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <h4>รายชื่อชั้นเรียน</h4>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="700px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="form" validation>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4" align-self="center">
                              <h3>การเก็บคะแนน</h3>
                            </v-col>
                            <v-col cols="12" sm="6" md="3" align-self="center">
                              <v-text-field
                                v-model="part_num"
                                type="number"
                                required
                                :rules="[
                                  (v) => !!v || 'กรุณากรอก จำนวนการเก็บคะแนน',
                                ]"
                              />
                            </v-col>
                            <v-col cols="12" sm="6" md="2" align-self="center">
                              <h3>ส่วน</h3>
                            </v-col>
                            <v-col cols="12" sm="6" md="2" align-self="center">
                              <v-btn class="info" @click="addPartNumber"
                                >ตกลง</v-btn
                              >
                            </v-col>
                          </v-row>
                          <v-row>
                            <div v-for="item in part_rating" :key="item.id">
                              <v-col align-self="center">
                                <v-row>
                                  <v-text-field
                                    class="mr-5"
                                    v-model="item.name"
                                    label="หัวข้อ"
                                    outlined
                                    type="text"
                                  />
                                  <v-text-field
                                    class="mr-5"
                                    v-model="item.score"
                                    label="คะแนน"
                                    outlined
                                    type="number"
                                  />
                                  <v-text-field
                                    v-model="item.rating"
                                    label="สัดส่วน %"
                                    outlined
                                    type="number"
                                  />
                                </v-row>
                              </v-col>
                            </div>
                          </v-row>
                        </v-container>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close"
                        >ยกเลิก</v-btn
                      >
                      <v-btn class="success" text @click="save">บันทึก</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <thead>
              <tr>
                <th>รหัส/ชื่อวิขา</th>
                <th>ระดับชั้น</th>
                <th>ห้องเรียน</th>
                <th>ครูผู้สอน</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td v-if="item.subject">
                  {{ item.subject.codet }} {{ item.subject.sname }}
                </td>
                <td v-else>
                  {{ item.teachInfo.codet }} {{ item.teachInfo.sname }}
                </td>
                <th>{{ item.classRoomLevel }}</th>
                <th>{{ item.classRoomName }}</th>
                <th v-if="item.teacher">{{ item.teacher.name }}</th>
                <th v-else>
                  {{ item.teachers.title }} {{ item.teachers.firstName }}
                  {{ item.teachers.lastName }}
                </th>

                <th>
                  <v-btn color="info" @click="goToAddScore(item)">
                    จัดการ
                  </v-btn>
                  <!-- <v-btn color="error" @click="deleteItem(item)">
                     ลบ
                   </v-btn> -->
                </th>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  layout: "teacher",
  middleware: "teacher",
  async mounted() {
    this.query = this.$route.query;
    // this.teacherId = this.$store.state.auth.auth.teacherObjectId

    await this.getTeachByConditions(this.query.id).then(
      (result) => (this.items = result)
    );
    if (this.items.length == 0) {
      await this.getTeachByConditionsFixed(this.query.id).then(
        (result) => (this.items = result)
      );
    }
    // get rating
    // this.part_rating = this.items.rating
    //
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  data() {
    return {
      dialog: false,
      formTitle: "เกณฑ์การให้คะแนน",
      title: "เลือกห้องเรียน",
      search: "",
      query: "",
      teacherId: "",
      teach: "",
      dialogCreateTeach: "false",
      part_num: "",
      part_point: [],
      part_rating: [],
      studentsId: [],
      studentsNamr: [],
      rating: [],
      headers: [
        { text: "รหัส/ชื่อวิขา", value: "sname", align: "center" },
        { text: "ระดับชั้น", value: "classRoomLevel", align: "center" },
        { text: "ห้องเรียน", value: "classRoomName", align: "center" },
        { text: "ครูผู้สอน", value: "teacher.name", align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
      items: [],
    };
  },
  methods: {
    async getTeachByConditions(teacherId) {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        // "teacher.value": teacherId,
        teachers: {
          __type: "Pointer",
          className: "_User",
          objectId: teacherId,
        },
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByConditions`,
        data
      );

      return response.results;
    },
    async getTeachByConditionsFixed(teacherId) {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        teachers: {
          __type: "Pointer",
          className: "_User",
          objectId: teacherId,
        },
      };

      const response = await this.$store.dispatch(
        `teach/getTeachByConditions`,
        data
      );

      return response.results;
    },
    async getGradeByConditions(item) {
      const conditions = {
        subject: item.sname,
        schoolYear: item.schoolYear,
        term: item.term,
        classRoomLevel: item.classRoomLevel,
        classRoomName: item.classRoomName,
        "teacher.id": item.teacher.value,
      };
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );

      return response.results;
    },
    async getStudentByTeach(item) {
      const conditions = {
        schoolYear: item.schoolYear,
        term: item.term,
        classRoomLevel: item.classRoomLevel,
        classRoomName: item.classRoomName,
      };
      const response = await this.$store.dispatch(
        "classes/getClassesByConditions",
        conditions
      );

      return response.results[0].studentId;
    },
    async getStudent(data) {
      const query = {
        objectId: {
          $in: data,
        },
      };
      const response = await this.$store.dispatch(
        "students/getStudents",
        query
      );

      var name = this.getStudentName(response.results);
      return name;
    },
    async createGrade(object) {
      const response = await this.$store.dispatch(`grade/createGrade`, object);

      return response;
    },
    async addRatingToTach(teach) {
      const response = await this.$store.dispatch(`teach/updateTeach`, teach);

      return response;
    },
    addPartNumber() {
      this.part_rating = [];
      for (var index = 0; index < this.part_num; index++) {
        this.part_rating.push({ name: "", rating: 0 });
      }
    },
    addRating(item) {
      this.dialog = true;
      this.teach = item;
      if (item.rating) {
        this.part_num = item.rating.length;
      }
      this.part_rating = item.rating;
    },
    getRating(item) {
      var rating = [];
      for (var index = 0; index < item.length; index++) {
        rating.push(item[index].name + " " + item[index].rating + " " + 0);
      }

      return rating;
    },
    getStudentName(item) {
      var studentName = [];
      for (var index = 0; index < item.length; index++) {
        studentName.push(
          item[index].tth + " " + item[index].namet + " " + item[index].snamet
        );
      }

      return studentName;
    },
    mapScoreName(name, score) {
      var student = [];
      for (var i = 0; i < name.length; i++) {
        for (var j = 0; j < score.length; j++) {
          student.push({
            name: name[i],
            score: score[j],
          });
        }
      }

      return student;
    },
    async addScore(item) {
      // เช็คก่อนว่ามมี data ใน gradeรึยัง (1)
      var grade = await this.getGradeByConditions(item);

      if (grade.length == 0) {
        await this.getStudentByTeach(item).then(
          (result) => (this.studentsId = result)
        );
        await this.getStudent(this.studentsId).then(
          (result) => (this.studentName = result)
        );
        var scores = this.mapScoreName(this.studentName, item.rating);
        // ได้รายชื่อนักเรียนแล้ว -> เอารายชื่อนักเรียนไปรวมกับ rating สร้าง grade object
        const data = {
          subject: item.sname,
          schoolYear: item.schoolYear,
          term: item.term,
          classRoomLevel: item.classRoomLevel,
          classRoomName: item.classRoomName,
          teacher: {
            id: item.teacher.value,
            name: item.teacher.name,
          },
          students: scores,
        };

        var response = await this.createGrade(data);
        // เอารายชื่อนักเรียนไปรวมกับ rating
        if (response) {
          this.goToAddScore(item);
        }
      } else {
        this.goToAddScore(item);
      }
    },
    save() {
      var rating = this.part_rating.map((result) => parseInt(result.rating));

      var sum = rating.reduce((a, b) => a + b);
      sum != 100 ? alert("กรุณาทำให้ผลรวม") : null;

      const teach = {
        objectId: this.teach.objectId,
        rating: this.part_rating,
      };

      this.addRatingToTach(teach);
      this.close();
    },
    close() {
      this.dialog = false;
      this.part_num = "";
      setTimeout(() => {}, 300);
    },
    back() {
      this.$router.go(-1);
    },
    goToAddScore(item) {
      this.$router.push({
        name: "teachers-teach-add_scoring_criteria",
        query: {
          id: item.objectId,
          // schoolYear: item.schoolYear,
          // term: item.term,
          // classRoomLevel: item.classRoomLevel,
          // classRoomName: item.classRoomName
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
