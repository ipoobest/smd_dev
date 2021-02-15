<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }} ของปีการศีกษา {{ classItem.schoolYear }} เทอม
            {{ classItem.term }}
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            align="center"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-spacer></v-spacer>
                <v-dialog v-model="dialogAddClass" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mr-2" v-on="on"
                      >เพิ่มชั้นเรียน</v-btn
                    >
                  </template>

                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="form" validation>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="classItem.classRoomId"
                                outlined
                                label="รหัสห้อง"
                                required
                                :rules="[v => !!v || 'กรุณากรอก รหัสห้อง']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="classItem.classRoomLevel"
                                :items="itemLevel"
                                outlined
                                label="ระดับชั้น"
                                required
                                :rules="[v => !!v || 'กรุณากรอก ระดับชั้น']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="classItem.classRoomName"
                                outlined
                                label="ห้อง"
                                required
                                :rules="[v => !!v || 'กรุณากรอก ห้องเรียน']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="classItem.teacher1"
                                :items="selectItemTeacher"
                                outlined
                                label="อาจารย์ประจำชั้น คนที่ 1"
                                required
                                :rules="[
                                  v => !!v || 'กรุณาเลือก อาจารย์ประจำชั้น'
                                ]"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="classItem.teacher2"
                                :items="selectItemTeacher"
                                outlined
                                label="อาจารย์ประจำชั้น คนที่ 2"
                                required
                                :rules="[
                                  v => !!v || 'กรุณาเลือก อาจารย์ประจำชั้น'
                                ]"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close"
                        >ยกเลิก</v-btn
                      >
                      <v-btn
                        class="success"
                        color=" darken-1"
                        text
                        @click="save"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="info" @click="addStudent(item)">
                รายชื่อนักเรียน
              </v-btn>
              <v-btn color="error" @click="deleteItem(item)">
                ลบ
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  middleware: "authentication",
  async mounted() {
    // this.classItem = this.$route.query
   
    await this.getListClass(this.$route.query).then(
      result => (this.items = result)
    );
    await this.getListTeacher().then(result => (this.teachers = result));
    await this.selectItemTeachers();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มชั้นเรียน" : "แก้ไข";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  data() {
    return {
      dialogAddClass: false,
      dialogCreateYear: false,
      headers: [
        { text: "รหัสห้อง", value: "classRoomId", align: "center" },
        { text: "ระดับชั้น", value: "classRoomLevel", align: "center" },
        { text: "ห้อง", value: "classRoomName", align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" }
      ],
      items: [],
      search: ``,
      title: `ห้องเรียน`,
      editedIndex: -1,
      classItem: {
        schoolYear: "",
        term: "",
        classRoomId: "",
        classRoomLevel: "",
        classRoomName: "",
        studentId: [],
        teacherName: ""
      },
      academicYear: {
        schoolYear: "",
        term: ""
      },
      selectAcademic: [],
      teachers: [],
      year: [],
      schoolYear: "",
      term: "",
      itemLevel: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      selectItemTeacher: []
    };
  },
  methods: {
    async getListClass(classItem) {
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        classItem
      );
     
      return response.results;
    },
    async getListTeacher() {
      var conditions = {
        type: "ครู"
      };
      const response = await this.$store.dispatch(
        `users/getUserByConditions`,
        conditions
      );
      return response.results;
    },
    async createClasses(data) {
      const response = await this.$store.dispatch(
        `classes/createClasses`,
        data
      );
      this.getListClass(this.$route.query).then(
        result => (this.items = result)
      );
    },
    async deteleClasses(itemId) {
     
      const response = await this.$store.dispatch(
        `classes/deleteClass`,
        itemId
      );
    },
    async getAcademicYear() {
      const response = await this.$store.dispatch(
        `academic_year/getAcademicYear`
      );
      return response.results;
    },
    selectItemTeachers() {
     
      for (var index = 0; index < this.teachers.length; index++) {
        this.selectItemTeacher.push(
          this.teachers[index].title +
            " " +
            this.teachers[index].firstName +
            " " +
            this.teachers[index].lastName
        );
      }
    },
    editItem(item) {
      //
      this.editedIndex = this.items.indexOf(item);
      this.classItem = Object.assign({}, item);

      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.items.indexOf(item);
      if (confirm("ยืนยีนการลบข้อมูล")) {
        this.deteleClasses(item.objectId);
        this.items.splice(index, 1);
      }
    },
    back() {
      this.$router.go(-1);
    },
    close() {
      if (this.dialogAddClass) {
        this.dialogAddClass = false;
      } else if (this.dialogCreateYear) {
        this.dialogCreateYear = false;
      }
      setTimeout(() => {
        this.classItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    async save() {
      if (this.$refs.form.validate()) {
       
        // const data = { ...this.classItem, ...this.$route.query };
        const data = {
          advisoryTeacher: {
            teacher1: this.classItem.teacher1,
            teacher2: this.classItem.teacher2
          },
          classRoomId: this.classItem.classRoomId,
          classRoomLevel: this.classItem.classRoomLevel,
          classRoomName: this.classItem.classRoomName,
          schoolYear: this.$route.query.schoolYear
        };
       
        //check ceate
        const getClass = {
          classRoomId: this.classItem.classRoomId,
          classRoomLevel: this.classItem.classRoomLevel,
          classRoomName: this.classItem.classRoomName,
          schoolYear: this.$route.query.schoolYear
        };
        //
        const classes = await this.getListClass(getClass);
        //
        if (classes.length != 0) {
          alert("ชั้นเรียนนี้ถูกสร้างแล้ว");
          this.close();
          return;
        } else {
          this.createClasses(data);
          this.close();
        }
      }
    },
    addStudent(item) {
     
      this.$router.push({
        name: "classes-add_student",
        query: { id: item.objectId }
      });
    },
    resetForm() {
      this.$refs.form.reset();
    }
  }
};
</script>
