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
            <v-col cols="3">
              <v-btn class="success" @click="exportXml()">export ranking</v-btn>
            </v-col>
          </v-card-title>
          <v-simple-table :headers="headers" :items="items" :search="search">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <p>
                  ชั้น {{ student.classRoomLevel }} ห้อง
                  {{ student.classRoomName }} ปีการศึกษา
                  {{ student.schoolYear }} เทอม {{ student.term }}
                </p>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <v-simple-table>
              <thead>
                <tr>
                  <th>เลขที่</th>
                  <th>รหัสประจำตัว</th>
                  <th>ชื่อ</th>
                  <th>นามสกุล</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in sortNumberStudent" :key="index">
                  <th>{{ item.number }}</th>
                  <th>{{ item.idstd }}</th>
                  <th>{{ item.namet }}</th>
                  <th>{{ item.snamet }}</th>
                  <th>
                    <v-btn class="success" @click="studentScore(item)" small >
                      ดูคะแนน
                    </v-btn>
                  </th>
                </tr>
              </tbody>
            </v-simple-table>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import XLSX from "xlsx";
export default {
  layout: 'assessment',
  middleware: "assessment",
  async mounted() {
    this.id = this.$route.query.id;
    this.studentInClassId = await this.getListClasses();
    this.student = await this.getDataFromApi(this.id);
    this.items = await this.getStudents(this.student.studentId);
    // this.students = await this.getStudentsNotIn(this.studentInClassId);
  },
  computed: {
    // sortedNumber() {
    //   return this.items.sort(function(a, b) {
    //     return a.number - b.number;
    //   });
    // },
    sortNumberStudent() {
      return this.items.sort((a, b) => a.number - b.number );
    }
  },
  data() {
    return {
      index: -1,
      title: "รายชื่อนักเรียน",
      id: "",
      search: "",
      dialog: false,
      classes: "",
      headers: [
        { text: "รหัสประจำตัว", value: "idstd" },
        { text: "ชื่อ", value: "namet" },
        { text: "นามสกุล", value: "snamet" },
        { text: "actions", value: "actions", sortable: false }
      ],
      items: [],
      singleSelect: false,
      selectItems: [],
      students: [],
      studentId: [],
      studentInClassId: [],
      student: {
        objectId: "",
        classRoomLevel: "",
        classRoomName: "",
        term: ""
      }
    };
  },
  methods: {
    async getDataFromApi(classId) {
      const response = await this.$store.dispatch(`classes/getClass`, classId);
      console.log("response xxxid", response);
      return response;
    },
    async getStudent() {
      const response = await this.$store.dispatch(`students/getStudent`);
      console.log("response", response);
      return response.results;
    },
    async getStudents(items) {
      console.log("items", items);
      const objectId = {
        $in: items
      };
      const response = await this.$store.dispatch(`students/getStudents`, {
        objectId
      });
      console.log("response student", response);
      return response.results;
    },
    async getStudentsNotIn(items) {
      const query = {
        class: this.student.classRoomLevel,
        objectId: {
          $nin: items
        }
      };
      const response = await this.$store.dispatch(
        `students/getStudents`,
        query
      );
      console.log("response", response);
      return response.results;
    },
    async getListClasses() {
      const response = await this.$store.dispatch(`classes/getListClasses`);
      // console.log('classes')
      let results = response.results.map(a => a.studentId);
      // console.log('result map ', results)
      let merged = [].concat.apply([], results);
      // console.log('merged', merged)
      return merged;
    },
    async addStudents() {
      const object = {
        objectId: this.id,
        studentId: this.studentId
      };
      const response = await this.$store.dispatch(
        `classes/updateClasses`,
        object
      );
    },
    async studentScore(item) {
      console.log('item', item)
        this.$router.push({
        name: "assessment-students-grade",
        query: { id: item.idstd, schoolYear: this.student.schoolYear, term: this.student.term }
      });
    },
    async getRanking() {
      var condition = {
        schoolYear: this.student.schoolYear,
        term: this.student.term,
        classRoomLevel: this.student.classRoomLevel,
        classRoomName: this.student.classRoomName
      };
      console.log('condition getRanking', condition)
      const response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        condition
      );
      console.log("getListClass", response);
      return response.results;
    },
    async exportXml() {
        this.ranking = await this.getRanking()
        var data = this.ranking.sort((a, b) => a.rankingInClasses - b.rankingInClasses)
        // console.log('data sort', data)
        const dataWS = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, dataWS)
        XLSX.writeFile(wb,`rankking-${this.student.schoolYear}-${this.student.term}-${this.student.classRoomLevel}/${this.student.classRoomName}.xlsx`)
    },
    back() {
      this.$router.go(-1);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.index = -1;
      }, 300);
    },
  }
};
</script>

<style lang="scss" scoped></style>
