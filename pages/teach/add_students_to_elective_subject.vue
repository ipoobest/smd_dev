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
                <v-divider class="mx-4" inset vertical></v-divider>
                <p>
                  วิชา {{ classInfo.teachInfo.sname }} ชั้น
                  {{ classInfo.classRoomLevel }}
                </p>
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
                      <v-btn color="error" @click="close">ยกเลิก</v-btn>
                      <v-btn color="info" @click="save">เพิ่ม</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <thead>
              <tr>
                <th>รหัสประจำตัว</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, items) in items" :key="items">
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
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  middleware: "admin",
  async mounted() {
    await this.getTeachById(this.$route.query.id).then(
      (result) => (this.classInfo = result)
    );

    await this.getStudent().then((result) => (this.students = result));
    await this.getStudents(this.classInfo.students).then(
      (result) => (this.items = result)
    );
  },
  data() {
    return {
      xxx: [],
      index: -1,
      title: "รายชื่อนักเรียน",
      id: "",
      search: "",
      dialog: false,
      classes: "",

      headerStudents: [
        { text: "รหัสประจำตัว", value: "idstd" },
        { text: "ชื่อ", value: "namet" },
        { text: "นามสกุล", value: "snamet" },
      ],
      items: [],
      singleSelect: false,
      selectItems: [],
      students: [],
      studentId: [],
      // studentInClassLevel: [],
      student: {
        classId: "",
        classRoomLevel: "",
        classRoomName: "",
        term: "",
      },
      classInfo: {
        teachInfo: "",
      },
    };
  },
  methods: {
    async getTeachById(classId) {
      const response = await this.$store.dispatch(
        `teach/getTeachById`,
        classId
      );
      // console.log('response xxxid', response)
      return response;
    },
    async getStudent() {
      const conditions = {
        class: this.classInfo.classRoomLevel,
      };
      const response = await this.$store.dispatch(
        `students/getStudentByConditions`,
        conditions
      );
      // console.log("response getStudent", response.results);
      return response.results;
    },
    async getStudents(items) {
      // console.log('items', items)
      const objectId = {
        $in: items,
      };
      const response = await this.$store.dispatch(`students/getStudents`, {
        objectId,
      });
      console.log("response student getStudent", response);
      return response.results;
    },
    async getStudentsNotIn(items) {
      // console.log('items not in', items)
      // const objectId = {
      //   $nin: items
      // }
      const query = {
        class: this.student.classRoomLevel,
        objectId: {
          $nin: items,
        },
      };
      const response = await this.$store.dispatch(
        `students/getStudents`,
        query
      );
      // console.log('response', response)
      return response.results;
    },
    async getGrade(data) {
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        data
      );
      return response.results[0];
    },
    async addStudents() {
      const object = {
        objectId: this.$route.query.id,
        students: this.studentId,
      };
      // console.log('object put', object)
      const response = await this.$store.dispatch(`teach/updateTeach`, object);
    },
    async deleteGrade(gradeId) {
      const response = await this.$store.dispatch(`grade/deleteGrade`, gradeId);
      return;
    },
    async deleteItem(item) {
      const index = this.items.indexOf(item);
      if (confirm("ยืนยีนการลบนักเรียนออกจากชั้นเรียน")) {
        this.items.splice(index, 1);
        console.log("item delete", this.items.length, this.items);
        for (var i = 0; i < this.items.length; i++) {
          this.studentId.push(this.items[i].objectId);
        }
        // console.log('item push', this.studentId)
        // 1 get grade by condition ->this.classInfo
        var data = {
          teachId: this.classInfo.objectId,
          studentObjectId: item.objectId,
        };
        // 2 delete grade by
        var grade = await this.getGrade(data);
        await this.deleteGrade(grade.objectId);
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
      // console.log('save',this.items)
      for (var index = 0; index < this.items.length; index++) {
        this.studentId.push(this.items[index].objectId);
      }
      // console.log('looper', this.studentId)
      this.addStudents(this.studentId);
      this.close();
    },
  },
};
</script>
