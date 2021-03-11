<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }} ของปีการศีกษา {{ query.schoolYear }} เทอม
            {{ query.term }}
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
            :search="search"
            align="center"
            :headers="headers"
            :items="subjectsInTerm"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mr-2" v-on="on"
                      >เพิ่ม</v-btn
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
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.teachInfo.objectId_subject"
                                @change="editSubjectName"
                                :items="classSubject"
                                outlined
                                label="วิชา"
                                required
                                :rules="[(v) => !!v || 'กรุณาเลือกวิชา']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.department"
                                :items="selectDepartment"
                                outlined
                                label="กลุ่มสาระวิชา"
                                required
                                :rules="[
                                  (v) => !!v || 'กรุณาเลือกกลุ่มสาระวิชา',
                                ]"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.teachers.objectId"
                                :items="itemTeachers"
                                item-text="name"
                                item-value="value"
                                outlined
                                label="ครูผู้สอน"
                                require
                                :rules="[(v) => !!v || 'กรุณาเลือกครูผู้สอน']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.classRoomLevel"
                                :items="classRoomLevel"
                                outlined
                                label="ระดับชั้น"
                                required
                                :rules="[(v) => !!v || 'กรุณาเลือกระดับชั้น']"
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

            <template v-slot:[`item.subjectName`]="{ item }">
              <div v-if="item.teachInfo">{{ item.teachInfo.sname }}</div>
              <div v-else>{{ item.subject.sname }}</div></template
            >
            <template v-slot:[`item.teacherName`]="{ item }"
              >{{ item.teachers.title }} {{ item.teachers.firstName }}
              {{ item.teachers.lastName }}</template
            >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="success" @click="addStudent(item)">
                เพิ่มนักเรียน
              </v-btn>
              <v-btn color="info" @click="editItem(item)"> แก้ไข </v-btn>
              <v-btn color="error" @click="deleteItem(item)"> ลบ </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  middleware: "admin",
  async mounted() {
    this.query = this.$route.query;
    await this.getSubjectsFromTeach().then(
      (result) => (this.subjectsInTerm = result)
    );

    await this.getSubjects().then((result) => (this.subjects = result));
    await this.getClass().then((result) => (this.classes = result));
    await this.getTeacher().then((result) => (this.teachers = result));
    await this.getDepartment().then(
      (result) => (this.selectDepartment = result)
    );

    await this.selectInputSubjects();
    await this.selectInputClasses();
    await this.selectInputTeacher();
  },
  computed: {
    selectSubject() {
      for (var i = 0; i < this.subjects.length; i++) {
        this.selectSubjects.push(this.subjects[i].sname);
      }
    },
    formTitle() {
      return this.editedIndex === -1 ? "สร้าง" : "แก้ไข";
    },
  },
  data() {
    return {
      title: "การจัดการวิชา",
      headers: [
        { text: "วิชา", value: "subjectName" },
        { text: "ชั้นเรียน", value: "classRoomLevel" },
        { text: "ห้องเรียน", value: "classRoomName" },
        { text: "ครูผู้สอน", value: "teacherName" },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
      search: "",
      dialogAddStudents: false,
      dialog: false,
      singleSelect: false,
      editedIndex: -1,
      items: [],
      subjects: [],
      subjectsInTerm: [],
      subjectInfo: [],
      selectSubjects: [],
      selectDepartment: [],
      query: {
        schoolYear: "",
        term: "",
      },
      input: {
        teachInfo: {},
        subject: {},
        teachers: {},
        classSubject: "",
        classRoomLevel: "",
        classRoomName: "",
        teacher: [],
      },
      classSubject: [],
      classRoomLevel: [],
      classRoomName: [],
      itemTeachers: [],
    };
  },
  methods: {
    async getClass() {
      const conditions = {
        schoolYear: this.query.schoolYear,
        term: this.query.term,
      };
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        conditions
      );
      return response.results;
    },
    async getTeacher() {
      var conditions = {
        type: "ครู",
      };
      const response = await this.$store.dispatch(
        `users/getUserByConditions`,
        conditions
      );
      return response.results;
    },
    async getSubjects() {
      var conditions = {
        type: "วิชาเลือก",
        term: this.query.term,
      };
      const response = await this.$store.dispatch(
        `subjects/getSubjectsByConditions`,
        conditions
      );

      return response.results;
    },
    async getSubjectsFromTeach() {
      const condition = {
        schoolYear: this.query.schoolYear,
        term: this.query.term,
        type: "วิชาเลือกเสรี",
      };
      const response = await this.$store.dispatch(
        `teach/getSubjectsByConditions`,
        condition
      );
      // console.log("response get subject", response.results);
      return response.results;
    },
    async getClassesByConditions() {
      const condition = {
        schoolYear: this.query.schoolYear,
        term: this.query.term,
        classRoomLevel: this.input.classRoomLevel,
        classRoomName: this.input.classRoomName,
      };
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        condition
      );
      return response.results[0].studentId;
    },
    async getDepartment() {
      const response = await this.$store.dispatch(`department/getDepartment`);
      var department = this.mapDepartment(response.results);
      return department;
    },
    async addSubjectToTeach(data) {
      const response = await this.$store.dispatch(`teach/createTeach`, data);
    },
    async updateSubjectToTeach(data) {
      const response = await this.$store.dispatch(`teach/updateTeach`, data);
    },
    async save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          // console.log("this. teacher", this.input);
          const data = {
            classRoomLevel: this.input.classRoomLevel,
            objectId: this.input.objectId,
            teachInfo: {
              objectId_subject: this.input.teachInfo.objectId_subject,
              sname: this.subjectInfo.sname,
              codet: this.subjectInfo.codet,
              credit: this.subjectInfo.credit,
            },
            teachers: {
              __type: "Pointer",
              className: "_User",
              objectId: this.input.teachers.objectId,
            },
            department: this.input.department,
            department_numner: this.checkDepartmentNumber(
              this.input.department
            ),
          };
          // console.log("edit", data);
          await this.updateSubjectToTeach(data);
          this.resetForm();
          await this.getSubjectsFromTeach().then(
            (result) => (this.subjectsInTerm = result)
          );
          this.close();
        } else {
          // console.log("this. input", this.input);

          const data = {
            schoolYear: this.query.schoolYear,
            term: this.query.term,
            classRoomLevel: this.input.classRoomLevel,
            classRoomName: "รวม",
            rating: [],
            students: [],
            department: this.input.department,
            department_numner: this.checkDepartmentNumber(
              this.input.department
            ),
            teachInfo: {
              objectId_subject: this.input.teachInfo.objectId_subject,
              sname: this.subjectInfo.sname,
              codet: this.subjectInfo.codet,
              credit: this.subjectInfo.credit,
            },
            teachers: {
              __type: "Pointer",
              className: "_User",
              objectId: this.input.teachers.objectId,
            },
            type: "วิชาเลือกเสรี",
          };
          // console.log("data create", data);
          await this.addSubjectToTeach(data);
          this.resetForm();
          await this.getSubjectsFromTeach().then(
            (result) => (this.subjectsInTerm = result)
          );
          this.close();
        }
      }
    },
    async deleteSubject(objectId) {
      const response = await this.$store.dispatch(
        `teach/deleteSubjectInTeach`,
        objectId
      );
      //
    },
    selectInputSubjects() {
      this.classSubject = [];
      this.subjects.forEach((subject) => {
        var data = {
          text: subject.codet + " " + subject.sname,
          value: subject.objectId,
        };
        this.classSubject.push(data);
      });
    },
    selectInputClasses() {
      for (var index = 0; index < this.classes.length; index++) {
        this.classRoomLevel.push(this.classes[index].classRoomLevel);
        this.classRoomName.push(this.classes[index].classRoomName);
      }
    },
    selectInputTeacher() {
      this.itemTeachers = [];
      for (var index = 0; index < this.teachers.length; index++) {
        const teacher = {
          name:
            this.teachers[index].title +
            " " +
            this.teachers[index].firstName +
            " " +
            this.teachers[index].lastName,
          value: this.teachers[index].objectId,
        };
        this.itemTeachers.push(teacher);
      }
    },

    editSubjectName() {
      var subject_name = this.subjects.filter(
        (subject) => subject.objectId == this.input.teachInfo.objectId_subject
      );
      this.subjectInfo = subject_name[0];
      // console.log("this subjectInfo", this.subjectInfo);
    },
    addClasses(item) {
      this.$router.push({
        name: "teach-add_classes",
        query: {
          classId: item.objectId,
          schoolYear: this.query.schoolYear,
          term: this.query.term,
        },
      });
    },
    addStudent(item) {
      this.$router.push({
        name: "teach-add_students_to_elective_subject",
        query: { id: item.objectId },
      });
    },
    editItem(item) {
      // console.log("edit item", item);
      this.editedIndex = this.subjectsInTerm.indexOf(item);
      this.input = JSON.parse(JSON.stringify(item));
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.subjectsInTerm.indexOf(item);
      if (confirm("ยืนยีนการวิชาเรียน")) {
        this.subjectsInTerm.splice(index, 1);
        this.deleteSubject(item.objectId);
      }
    },
    mapDepartment(item) {
      var department = [];
      item.forEach((item) => {
        department.push(item.name);
      });

      return department;
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
    },
    back() {
      this.$router.go(-1);
    },
    resetForm() {
      this.$refs.form.reset();
    },
    close() {
      // this.resetForm();
      this.dialog = false;
      this.editedIndex = -1;
    },
  },
};
</script>
