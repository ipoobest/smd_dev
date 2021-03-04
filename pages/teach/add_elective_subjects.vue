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
                <v-dialog v-model="dialogCreateTeach" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mr-2" v-on="on"
                      >เพิ่ม</v-btn
                    >
                  </template>

                  <v-card>
                    <v-card-title>
                      <span class="headline">สร้างการเรียน</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="form" validation>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.subject_id"
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
                                v-model="input.teacher"
                                :items="itemTeachers"
                                item-text="name"
                                return-object
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
                        @click="addSubject"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <!-- <thead>
              <tr>
                <th>รหัส/ชื่อวิขา</th>
                <th>ระดับชั้น</th>
                <th>ครูผู้สอน</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in subjectsInTerm" :key="index">
                <td v-if="item.subject_info">
                  {{ item.subject_info.codet }} {{ item.subject_info.sname }}
                </td>
                <td v-else>
                  {{ item.subject.codet }} {{ item.subject.sname }}
                </td>
                 <td v-else>{{ item.sname }}</td> 
                <td>{{ item.classRoomLevel }}</td>
                <td v-if="item.teacher">{{ item.teacher.name }}</td>
                <td v-else>
                  {{ item.teachers.title }} {{ item.teachers.firstName }}
                  {{ item.teachers.lastName }}
                </td>
                <td>
                  <v-btn color="info" @click="addStudent(item)">
                    เพิ่มรายชื่อนักเรียน
                  </v-btn>
                  <v-btn color="error" @click="deleteItem(item)">
                    ลบวิชา
                  </v-btn>
                </td>
              </tr>
            </tbody> -->
            <template v-slot:[`item.subjectName`]="{ item }">
              <div v-if="item.teachInfo">{{ item.teachInfo.sname }}</div>
              <div v-else>{{ item.subject.sname }}</div></template
            >
            <template v-slot:[`item.teacherName`]="{ item }"
              >{{ item.teachers.title }} {{ item.teachers.firstName }}
              {{ item.teachers.lastName }}</template
            >
            <template v-slot:[`item.actions`]="{ item }">
              <!-- <v-btn color="info" @click="editItem(item)"> แก้ไข </v-btn> -->
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
      dialogCreateTeach: false,
      singleSelect: false,
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
      await this.getSubjectsFromTeach().then(
        (result) => (this.subjectsInTerm = result)
      );
    },
    async addSubject() {
      var subjectInfo = await this.input.classSubject;
      const data = {
        schoolYear: this.query.schoolYear,
        term: this.query.term,
        sname: this.input.classSubject,
        classRoomLevel: this.input.classRoomLevel,
        classRoomName: "รวม",
        rating: [],
        students: [],
        department: this.input.department,
        department_numner: this.checkDepartmentNumber(this.input.department),
        // teacher: this.input.teacher,
        // subject_info: this.subjectinfo,
        subject: {
          __type: "Pointer",
          className: "Subjects",
          objectId: this.subjectInfo.id,
        },
        teachers: {
          __type: "Pointer",
          className: "_User",
          objectId: this.input.teacher.value,
        },
        type: "วิชาเลือกเสรี",
      };

      this.addSubjectToTeach(data);
      this.resetForm();
      this.close();
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
        (subject) => subject.objectId == this.input.subject_id
      );

      this.subjectInfo = {
        id: subject_name[0].objectId,
        codet: subject_name[0].codet,
        sname: subject_name[0].sname,
        credit: subject_name[0].credit,
        hour: subject_name[0].hour,
      };
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
      console.log("this item edit", item);
      this.editedIndex = this.items.indexOf(item);
      this.input = Object.assign({}, item);
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
      this.dialogCreateTeach = false;
    },
  },
};
</script>
