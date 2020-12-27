<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            อัพเดทชั้นเรียน
            <v-spacer></v-spacer>
            <v-col cols="3" sm="3" md="3">
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
                <v-col cols="2">
                  <v-text-field
                    v-model="schoolYear"
                    label="ปีการศึกษา"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-select
                    v-model="classRoomLevel"
                    :items="itemLevel"
                    label="ระดับชั้น"
                    single-line
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="1">
                  <v-select
                    v-model="term"
                    :items="itemTerm"
                    label="เทอม"
                    single-line
                    hide-details
                  ></v-select>
                </v-col>

                <v-col cols="1">
                  <v-btn color="info" dark class="mr-2" @click="getClassesItems"
                    >get</v-btn
                  >
                </v-col>
                <v-col cols="1">ไปยัง</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="newSchoolYear"
                    label="ปีการศึกษา"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
                <!-- newClassRoomLevel -->
                <v-col cols="2">
                  <v-select
                    v-model="newClassRoomLevel"
                    :items="itemLevel"
                    label="ระดับชั้น"
                    single-line
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="1">
                  <v-select
                    v-model="newTerm"
                    label="เทอม"
                    :items="itemTerm"
                    single-line
                    hide-details
                  ></v-select>
                </v-col>
              </v-toolbar>
              <v-col cols="2">
                <v-btn
                  color="success"
                  dark
                  class="mr-2"
                  @click="upgradeClasses()"
                  >อัดเดทชั้นเรียน</v-btn
                >
              </v-col>
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
      <v-col v-if="newItems.length != 0" cols="12">
        <v-card>
          <v-card-title>
            ชั้นเรียนที่ถูก update
            <v-spacer></v-spacer>
            <v-col cols="3" sm="3" md="3">
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
            :items="newItems"
            :search="search"
            align="center"
          >
            <template v-slot:top>
              <!-- <v-toolbar flat color="white">
                <v-col cols="12">
                  <h3>
                    ปีการศึกษา {{ newItems.schoolYear }} เทอม
                    {{ newItems.term }} ระดับชั้น {{ newItems.schoolYear }}
                  </h3>
                </v-col>
              </v-toolbar> -->
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
    // console.log("route params", this.$route.query);
    // await this.getListClass(this.$route.query).then(
    //   result => (this.items = result)
    // );
    // await this.getListTeacher().then(result => (this.teachers = result));
    // await this.selectItemTeachers();
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
        { text: "ปีการศึกษา", value: "schoolYear", align: "center" },
        { text: "เทอม", value: "term", align: "center" },
        { text: "รหัสห้อง", value: "classRoomId", align: "center" },
        { text: "ระดับชั้น", value: "classRoomLevel", align: "center" },
        { text: "ห้อง", value: "classRoomName", align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" }
      ],
      items: [],
      newItems: [],
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
      schoolYear: "2563",
      newSchoolYear: "",
      classRoomLevel: "ม.1",
      newClassRoomLevel: "",
      term: "1",
      newTerm: "",
      itemTerm: ["1", "2"],
      itemLevel: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      selectItemTeacher: []
    };
  },
  methods: {
    async getClassesItems() {
      console.log(
        "getClasses",
        this.schoolYear,
        this.term,
        this.classRoomLevel
      );
      var data = {
        schoolYear: this.schoolYear,
        term: this.term,
        classRoomLevel: this.classRoomLevel
      };
      this.items = await this.getListClass(data);
    },
    async getListClass(classItem) {
      const response = await this.$store.dispatch(
        `classes/getClassesByConditins`,
        classItem
      );
      console.log("getListClass", response);
      return response.results;
    },
    async createClasses(data) {
      const response = await this.$store.dispatch(
        `classes/createClasses`,
        data
      );
      // this.getListClass(this.$route.query).then(
      //   result => (this.items = result)
      // );
    },
    async deteleClasses(itemId) {
      console.log("delete ", itemId);
      const response = await this.$store.dispatch(
        `classes/deleteClass`,
        itemId
      );
    },
    async upgradeClasses() {
      console.log("item update", this.items);
      this.items.forEach(async item => {
        console.log(`item `, item);
        var data = {
          classRoomId: item.classRoomId,
          classRoomLevel: this.newClassRoomLevel,
          classRoomName: item.classRoomName,
          schoolYear: this.newSchoolYear,
          term: this.newTerm,
          studentId: item.studentId
        };
        await this.createClasses(data);
        // console.log("new data", data);
      });
      var newData = {
        schoolYear: this.newSchoolYear,
        term: this.newTerm,
        classRoomLevel: this.newClassRoomLevel
      };
      console.log('newdata', newData)
      this.newItems = await this.getListClass(newData);
    },
    editItem(item) {
      // console.log('item id ', item)
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
    save() {
      if (this.$refs.form.validate()) {
        console.log("objects", this.classItem);
        const data = { ...this.classItem, ...this.$route.query };
        console.log("data request", data);
        this.createClasses(data);
        this.close();
      }
    },
    addStudent(item) {
      console.log("item id ", item.objectId);
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
