<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ title }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-col>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="classRoomLevel"
                  :items="classes"
                  dense
                  outlined
                  label="ระดับชั้น"
                  @change="getSubjectByTeach()"
              /></v-col>
              <v-col cols="3">
                <v-select
                  v-model="subject"
                  :items="subjectList"
                  dense
                  outlined
                  label="วิชา"
                  @change="getDepartmentBySubject()"
              /></v-col>
              <v-col cols="3">
                <v-select
                  v-model="department"
                  :items="departmentList"
                  dense
                  outlined
                  label="กลุ่มสาระวิชา"
              /></v-col>
              <v-col cols="1"
                ><v-btn color="success" @click="getGrade()">GET</v-btn></v-col
              >
              <v-col cols="1"
                ><v-btn color="info" @click="updateGradeList()"
                  >update</v-btn
                ></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="classRoomLevel"
                  :items="classes"
                  dense
                  outlined
                  label="ระดับชั้น"
              /></v-col>
              <v-col cols="1"
                ><v-btn color="success" @click="getGradeInClass()"
                  >GET</v-btn
                ></v-col
              >
              <v-col cols="1"
                ><v-btn color="info" @click="updateGradeInClass()"
                  >update</v-btn
                ></v-col
              >
            </v-row>
          </v-col>
          <v-data-table :headers="headers" :items="items" :search="search">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <!-- <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                color="success"
                dark
                class="mr-2"
                @click="addSubject(item)"
              >
                จัดการวิชาบังคับ
              </v-btn>
              <v-btn
                color="info"
                dark
                class="mr-2"
                @click="addElevtiveSubject(item)"
              >
                จัดการวิชาเลือกเสรี
              </v-btn>
            </template> -->
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  // middleware: 'authentication',
  layout: "fix_data",
  mounted() {},
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  data() {
    return {
      headers: [
        { text: "ปีการศึกษา", value: "schoolYear", align: "center" },
        { text: "เทอม", value: "term", align: "center  " },
        { text: "ชื่อ", value: "studentName", align: "center  " },
        { text: "กลุ่มสาระวิชา", value: "subject.sname", align: "center  " },
        { text: "หมายเลข", value: "department_number", align: "center  " },
      ],
      dialogCreateYear: false,
      items: [],
      search: ``,
      title: `เกรด`,
      classRoomLevel: "",
      subject: "",
      department: "",
      departmentNumber: "",
      classes: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      subjectList: [],
      departmentList: [],
    };
  },
  methods: {
    async getSubjectByTeach() {
      var data = {
        classRoomLevel: this.classRoomLevel,
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByConditions`,
        data
      );
      console.log("response subject", response.results);
      this.mapSubject(response.results);
    },
    async getDepartmentBySubject() {
      var data = {
        sname: this.subject,
      };
      const response = await this.$store.dispatch(
        `subjects/getSubjectsByConditions`,
        data
      );

      this.department = response.results[0].department;
      this.departmentNumber = this.checkDepartmentNumber(this.department);
      this.departmentList.push(response.results[0].department);
    },
    async getGrade() {
      var data = {
        classRoomLevel: this.classRoomLevel,
        "teachInfo.sname": this.subject,
      };
      console.log("getGrade to fixed", data);
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        data
      );
      console.log("get grade", response.results);
      this.items = response.results;
    },
    async getGradeInClass() {
      const data = {
        classRoomLevel: this.classRoomLevel,
        term: "2",
      };
      console.log("getGrade to fixed", data);
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        data
      );
      console.log("get grade", response.results);
      this.items = response.results;
    },
    async updateGrade(item) {
      console.log("item grade", item);
      var data = {
        objectId: item.objectId,
        department: this.department,
        department_number: this.departmentNumber,
        teach: {
          __type: "Pointer",
          className: "Teach",
          objectId: item.teachId,
        },
        subject: {
          __type: "Pointer",
          className: "Subjects",
          objectId: item.objectId,
        },
      };

      console.log("data requert update", data);
      const response = await this.$store.dispatch(`grade/updateGrade`, data);

      // this.getGrade();
      // alert("update success");
    },
    back() {
      this.$router.push({ name: "index" });
    },
    updateGradeList() {
      this.items.forEach((item) => {
        // console.log("item update", item);
        this.updateGrade(item);
      });
      // alert("update success");
      this.getGrade();
    },
    updateGradeInClass() {
      this.items.forEach(async (item) => {
        var data = {
          objectId: item.objectId,
          department_number: parseInt(
            this.checkDepartmentNumber(item.subject.department)
          ),
        };
        console.log("updateGradeInClass data", data);
        const response = await this.$store.dispatch(`grade/updateGrade`, data);
        // console.log("response update", response);
      });
      this.getGradeInClass();
    },
    checkDepartmentNumber(data) {
      switch (data) {
        case "ภาษาไทย":
          return 1;
        case "คณิตศาสตร์":
          return 2;
        case "วิทยาศาสตร์":
          return 3;
        case "สังคมศึกษา ศาสนา และวัฒนธรรม":
          return 4;
        case "สุขศึกษาและพลศึกษา":
          return 5;
        case "ศิลปะ":
          return 6;
        case "การงานอาชีพและเทคโนโลยี":
          return 7;
        case "ภาษาต่างประเทศ":
          return 8;
        case "กิจกรรมพัฒนาผู้เรียน":
          return 9;
      }
      // if (data == "ภาษาไทย") {
      //   return 1;
      // }
      // if (data == "คณิตศาสตร์") {
      //   return 2;
      // }
      // if (data == "วิทยาศาสตร์") {
      //   return 3;
      // }
      // if (data == "สังคมศึกษา ศาสนา และวัฒนธรรม") {
      //   return 4;
      // }
      // if (data == "สุขศึกษาและพลศึกษา") {
      //   return 5;
      // }
      // if (data == "ศิลปะ") {
      //   return 6;
      // }
      // if (data == "การงานอาชีพและเทคโนโลยี") {
      //   return 7;
      // }
      // if (data == "ภาษาต่างประเทศ") {
      //   return 8;
      // }
      // if (data == "กิจกรรมพัฒนาผู้เรียน") {
      //   return 9;
      // }
    },
    mapSubject(data) {
      var itemSubject = [];
      var itemDepartment = [];
      data.forEach((item) => {
        itemSubject.push(item.subject.sname);
      });
      this.subjectList = [...new Set(itemSubject)];
    },
    async addSubject(item) {
      this.$router.push({
        name: "teach-add_subjects",
        query: { schoolYear: item.schoolYear, term: item.term },
      });
    },
    async addElevtiveSubject(item) {
      this.$router.push({
        name: "teach-add_elective_subjects",
        query: { schoolYear: item.schoolYear, term: item.term },
      });
    },
  },
};
</script>
