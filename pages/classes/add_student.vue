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
          <v-simple-table :search="search">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <p>
                  ชั้น {{ student.classRoomLevel }} ห้อง
                  {{ student.classRoomName }} ปีการศึกษา
                  {{ student.schoolYear }} เทอม {{ student.term }}
                </p>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>

                <v-dialog v-model="dialog" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on"
                      >เพิ่มนักเรียน</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">เพิ่มรายชื่อนักเรียน</span>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        v-model="items"
                        :headers="headerStudents"
                        :items="students"
                        :single-select="singleSelect"
                        item-key="objectId"
                        show-select
                        class="elevation-1"
                      >
                      </v-data-table>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" text @click="close">ยกเลิก</v-btn>
                      <v-btn color="blue darken-1" text @click="save">เพิ่ม</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
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
                <tr v-for="(item, index) in sortNumber" :key="index">
                  <th>{{ item.number }}</th>
                  <th>{{ item.idstd }}</th>
                  <th>{{ item.namet }}</th>
                  <th>{{ item.snamet }}</th>
                  <th>
                    <v-btn class="error" small @click="deleteItem(item)">
                      ลบ
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
export default {
  async mounted() {
    this.id = this.$route.query.id;
    this.studentInClassId = await this.getListClasses();
    this.student = await this.getDataFromApi(this.id);
    this.items = await this.getStudents(this.student.studentId);
    this.students = await this.getStudentsNotIn(this.student.studentId);
  },
  computed: {
    sortNumber() {
      // return this.items.sort((a,b) => {
      //   a.number - b.number
      // })
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
      headerStudents: [
        { text: "รหัสประจำตัว", value: "idstd" },
        { text: "ชื่อ", value: "namet" },
        { text: "นามสกุล", value: "snamet" }
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
      console.log("response studen id", response);
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
      console.log('query student notin', query)
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
    async getGradeByConditions(condition) {
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        condition
      );
      console.log('grade id', response.results)
      return response.results
    },
    async addStudents() {
      const object = {
        objectId: this.id,
        studentId: this.studentId
      };
      console.log('object class', object)
      const response = await this.$store.dispatch(
        `classes/updateClasses`,
        object
      );
      console.log('response', response)
    },
    async deleteStudentInGrade(id){
        const response = await this.$store.dispatch(
        `grade/deleteGrade`,
        id
      );
      console.log('response delete', response)
    },
    async deleteItem(item) {
      this.studentId = []
      console.log('item aaas', item)
      const index = this.items.indexOf(item);
      if (confirm("ยืนยีนการลบนักเรียนออกจากชั้นเรียน")) {
        this.items.splice(index, 1);
        for (var i = 0; i < this.items.length; i++) {
          this.studentId.push(this.items[i].objectId);
        }
        // console.log('item studentId', this.studentId)
        // studentId
        const data = {
          studentObjectId: item.objectId,
          schoolYear:  this.student.schoolYear,
          term: this.student.term
        }        
        var studentId = await this.getGradeByConditions(data)
        studentId.forEach(item => {
          console.log('testxx', (item.objectId))
          this.deleteStudentInGrade(item.objectId)
        })
         this.addStudents(this.studentId);
      }
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
    save() {
      console.log("save", this.items);
      for (var index = 0; index < this.items.length; index++) {
        this.studentId.push(this.items[index].objectId);
      }
      console.log("looper", this.studentId);
      this.addStudents(this.studentId);
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped></style>
