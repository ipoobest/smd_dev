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
                <v-col cols="6">
                  <v-form ref="formGetClasses" validation>
                    <v-row>
                      <v-col cols="4">
                        <v-text-field
                          v-model="schoolYear"
                          label="ปีการศึกษา"
                          single-line
                          hide-details
                          require
                          :rules="[v => !!v || 'กรุณากรอกข้อมูล ปีการศึกษา']"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          v-model="classRoomLevel"
                          :items="itemLevel"
                          label="ระดับชั้น"
                          require
                          :rules="[v => !!v || 'กรุณาเลือกข้ออมูล ระดับชั้น']"
                          single-line
                          hide-details
                        ></v-select>
                      </v-col>
                      <v-col cols="2">
                        <v-select
                          v-model="term"
                          :items="itemTerm"
                          label="เทอม"
                          single-line
                          require
                          :rules="[v => !!v || 'กรุณาเลือกข้ออมูล เทอม']"
                          hide-details
                        ></v-select>
                      </v-col>
                      <v-col cols="2">
                        <v-btn
                          color="info"
                          dark
                          class="mr-2"
                          @click="getClassesItems"
                          >get</v-btn
                        >
                      </v-col>
                    </v-row></v-form
                  ></v-col
                >
                <v-col cols="1">ไปยัง</v-col>
                <v-col
                  v-if="
                    (classRoomLevel == 'ม.3' || classRoomLevel == 'ม.6') &&
                      term == '2'
                  "
                  cols="5"
                >
                  จบการศึกษา</v-col
                >
                <v-col v-else cols="5">
                  <v-form ref="formToClasses" validation>
                    <v-row>
                      <v-col cols="4"
                        ><v-text-field
                          v-model="newSchoolYear"
                          label="ปีการศึกษา"
                          :rules="[v => !!v || 'กรุณากรอกข้อมูล ปีการศึกษา']"
                          require
                          single-line
                          hide-details
                        ></v-text-field
                      ></v-col>
                      <v-col cols="4">
                        <v-select
                          v-model="newClassRoomLevel"
                          :items="itemLevel"
                          label="ระดับชั้น"
                          :rules="[v => !!v || 'กรุณาเลือกข้ออมูล ระดับชั้น']"
                          require
                          single-line
                          hide-details
                        ></v-select
                      ></v-col>
                      <v-col cols="4"
                        ><v-select
                          v-model="newTerm"
                          label="เทอม"
                          :rules="[v => !!v || 'กรุณาเลือกข้ออมูล เทอม']"
                          :items="itemTerm"
                          require
                          single-line
                          hide-details
                        ></v-select
                      ></v-col>
                    </v-row>
                  </v-form>
                </v-col>
              </v-toolbar>

              <v-col cols="2">
                <v-btn
                  color="success"
                  dark
                  class="mr-2"
                  @click="checkAcademicYear()"
                  >อัพเดทชั้นเรียน</v-btn
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
              <v-btn
                v-if="ranking"
                color="orange"
                dark
                @click="checkRanking(item)"
              >
                init ranking
              </v-btn>
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
      ranking: false,
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
      newSchoolYear: "",
      classRoomLevel: "",
      newClassRoomLevel: "",
      term: "",
      newTerm: "",
      itemTerm: ["1", "2"],
      itemLevel: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      selectItemTeacher: []
    };
  },
  methods: {
    async getClassesItems() {
      this.ranking = false;
      if (this.$refs.formGetClasses.validate()) {
        var data = {
          schoolYear: this.schoolYear,
          term: this.term,
          classRoomLevel: this.classRoomLevel
        };
        this.items = await this.getListClass(data);
      }
    },
    async getListClass(classItem) {
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        classItem
      );
     
      return response.results;
    },
    async getAcademicYear(data) {
      const response = await this.$store.dispatch(
        `academic_year/getAcademicYearByCondition`,
        data
      );
     
      return response.results;
    },
    async getStudentFromStudentClass(objectId) {
      var response = await this.$store.dispatch(
        `students/getStudentById`,
        objectId
      );
     
      return response;
    },
    async getRanking(data) {
      var response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        data
      );
     
      return response;
    },
    async createAcademiYear(data) {
      const response = await this.$store.dispatch(
        `academic_year/createAcademicYear`,
        data
      );
     
      return response.results;
    },
    async createClasses(data) {
      const response = await this.$store.dispatch(
        `classes/createClasses`,
        data
      );
    },
    async deteleClasses(itemId) {
     
      const response = await this.$store.dispatch(
        `classes/deleteClass`,
        itemId
      );
    },
    async createRanking(data) {
      var response = await this.$store.dispatch(`ranking/createRanking`, data);
     
    },
    async checkAcademicYear() {
      this.ranking = true;
      if (this.items.length == 0) {
        alert("กรุณาเลือกชั้นเรียนที่จะ upgrade");
        return;
      }
      if (this.$refs.formToClasses.validate()) {
        // 2. get academtiYear
        var data = {
          schoolYear: this.newSchoolYear,
          term: this.newTerm
        };
        const acadamicYear = await this.getAcademicYear(data);
        if (acadamicYear.length != 0) {
          // create academic year
          //
          // await this.createAcademiYear(data);
          this.checkClassesUpdate();
          //3 call check update
        } else {
          //3 call check update
          //
          await this.createAcademiYear(data);
          this.checkClassesUpdate();
        }
      }
      // 1. check input
      // this.$refs.form.validate()
    },
    async checkRanking(item) {
      var data = {
        schoolYear: item.schoolYear,
        term: item.term,
        classRoomLevel: item.classRoomLevel,
        classRoomName: item.classRoomName
      };
     
      var ranking = await this.getRanking(data);
     

      if (ranking.results.length != 0) {
        alert("ชั้นเรียนนี้ update ranking แล้ว");
        return;
      } else {
        await this.initRanking(item);
      }
    },
    async checkClassesUpdate() {
      var data = {
        schoolYear: this.newSchoolYear,
        term: this.newTerm,
        classRoomLevel: this.newClassRoomLevel
      };
      const classes = await this.getListClass(data);
      if (classes.length != 0) {
        //
        alert("ชั้นเรียนนี้ถูก update แล้ว");
        var newData = {
          schoolYear: this.newSchoolYear,
          term: this.newTerm,
          classRoomLevel: this.newClassRoomLevel
        };
        this.newItems = await this.getListClass(newData);
      } else {
        //
        /// create classes
        // alert('update classes')
        this.upgradeClasses();
      }
    },
    async upgradeClasses() {
      // 1. check academic year update
      // 2. create academic year
      //
      this.items.forEach(async item => {
        //
        var newClassRoomLevel;
        var newSchoolYear;
        if (
          (this.classRoomLevel == "ม.3" || this.classRoomLevel == "ม.6") &&
          this.term == "2"
        ) {
          newClassRoomLevel = "จบการศึกษา";
          newSchoolYear = this.schoolYear;
        } else {
          newClassRoomLevel = this.newClassRoomLevel;
          newSchoolYear = this.newSchoolYear;
        }
        var newClassRoomId =
          this.newClassRoomLevel.substring(2) + "00" + item.classRoomName;
        //
        var data = {
          classRoomId: newClassRoomId,
          classRoomLevel: newClassRoomLevel,
          classRoomName: item.classRoomName,
          schoolYear: newSchoolYear,
          term: this.newTerm,
          studentId: item.studentId
        };
        await this.createClasses(data);
        //
      });

      var newData = {
        schoolYear: this.newSchoolYear,
        term: this.newTerm,
        classRoomLevel: this.newClassRoomLevel
      };
      //
      alert('อัพเกรดสำเร็จ')
      this.newItems = await this.getListClass(newData);
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
    async initRanking(data) {
      // checkRanking
      //
      // var classes = data;
      var length = 0;

      data.studentId.forEach(async item => {
        var studentObject = await this.getStudentFromStudentClass(item);
        var data = {
          schoolYear: this.newSchoolYear,
          term: this.newTerm,
          classRoomLevel: this.newClassRoomLevel,
          classRoomName: `${studentObject.room}`,
          studentObjectId: item,
          studentName: `${studentObject.tth} ${studentObject.namet} ${studentObject.snamet}`,
          studentId: studentObject.idstd
        };
        //
      await this.createRanking(data);
      });
      alert('init ranking สำเร็จ');
      //
    },
    addStudent(item) {
      //
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
