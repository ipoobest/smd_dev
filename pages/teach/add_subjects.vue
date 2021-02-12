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
            :headers="headers"
            :items="items"
            :search="search"
            align="center"
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
                                v-model="input.subject.objectId"
                                @change="editSubjectName"
                                :items="classSubject"
                                outlined
                                label="วิชา"
                                required
                                :rules="[v => !!v || 'กรุณาเลือกวิชา']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.department"
                                :items="department"
                                outlined
                                label="กลุ่มสาระการเรียนรู้"
                                required
                                :rules="[
                                  v => !!v || 'กรุณาเลือกกลุ่มสาระการเรียนรู้'
                                ]"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.teachers.objectId"
                                :items="itemTeachers"
                                item-text="name"
                                outlined
                                label="ครูผู้สอน"
                                require
                                :rules="[v => !!v || 'กรุณาเลือกครูผู้สอน']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.classRoomLevel"
                                :items="classRoomLevel"
                                outlined
                                label="ระดับชั้น"
                                required
                                :rules="[v => !!v || 'กรุณาเลือกระดับชั้น']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="input.classRoomName"
                                :items="classRoomName"
                                outlined
                                label="ห้องเรียน"
                                required
                                :rules="[v => !!v || 'กรุณาเลือกระดับชั้น']"
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
            <template v-slot:[`item.teacherName`]="{ item }"
              >{{ item.teachers.title }} {{ item.teachers.firstName }}
              {{ item.teachers.lastName }}</template
            >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="info" @click="editItem(item)">
                แก้ไข
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
  middleware: "admin",
  async mounted() {
    this.query = this.$route.query;
    await this.getSubjectsFromTeach().then(result => (this.items = result));
    await this.getSubjects().then(result => (this.subjects = result));
    await this.getClass().then(result => (this.classes = result));
    await this.getTeacher().then(result => (this.teachers = result));
    await this.getDepartment().then(result => (this.items_depart = result));
    await this.selectInputSubjects();
    await this.selectInputClasses();
    await this.selectInputTeacher();
  },
  computed: {
    selectSubject() {
      for (var i = 0; i < this.subjects.length; i++) {
        this.selectSubjects.push(this.subjects[i].sname);
      }
      console.log("looper", this.selectSubjects);
    },
    formTitle() {
      return this.editedIndex === -1 ? "สร้าง" : "แก้ไข";
    }
  },
  data() {
    return {
      headers: [
        { text: "วิชา", value: "subject.sname" },
        { text: "ชั้นเรียน", value: "classRoomLevel" },
        { text: "ห้องเรียน", value: "classRoomName" },
        { text: "ครูผู้สอน", value: "teacherName" },
        { text: "Actions", value: "actions", sortable: false, align: "center" }
      ],
      title: "การจัดการวิชา",
      search: "",
      dialog: false,
      singleSelect: false,
      editedIndex: -1,
      items: [],
      items_depart: [],
      subjects: [],
      subjectsInTerm: [],
      selectSubjects: [],
      subjectInfo: [],
      query: {
        schoolYear: "",
        term: ""
      },
      input: {
        subject: {},
        teachers: {},
        classSubject: "",
        classRoomLevel: "",
        classRoomName: "",
        teacher: []
      },
      classSubject: [],
      classRoomLevel: [],
      classRoomName: [],
      itemTeachers: [],
      department: []
    };
  },
  methods: {
    async getClass() {
      const conditions = {
        schoolYear: this.query.schoolYear,
        term: this.query.term
      };
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        conditions
      );
      console.log("class", response);
      return response.results;
    },
    async getTeacher() {
      var conditions = {
        type: "ครู"
      };
      const response = await this.$store.dispatch(
        `users/getUserByConditions`,
        conditions
      );
      return response.results;
    },
    async getSubjects() {
      var conditions = {
        type: "วิชาบังคับ",
        term: this.query.term
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
        type: "วิชาบังคับ"
      };
      const response = await this.$store.dispatch(
        `teach/getSubjectsByConditions`,
        condition
      );
      console.log("subject", response.results);
      return response.results;
    },
    async getClassesByConditions() {
      const condition = {
        schoolYear: this.query.schoolYear,
        term: this.query.term,
        classRoomLevel: this.input.classRoomLevel,
        classRoomName: this.input.classRoomName
      };
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        condition
      );
      console.log("getClassss ", response.results[0].objectId);
      return response.results[0].objectId;
      // console.log('getClass by con : ', response.results)
      // return response.results
    },
    async getDepartment() {
      const response = await this.$store.dispatch(`department/getDepartment`);
      this.department = this.mapDepartment(response.results);
      return response.results;
    },
    async addSubjectToTeach(data) {
      console.log("create teach data", data);
      const response = await this.$store.dispatch(`teach/createTeach`, data);
      console.log("response create teach", response);
    },
    async updateSubjectToTeach(data) {
      const response = await this.$store.dispatch(`teach/updateTeach`, data);
      await this.getSubjectsFromTeach().then(
        result => (this.subjectsInTerm = result)
      );
    },
    async save() {
      if (this.editedIndex > -1) {
        console.log("edit");
        const objectId = await this.getClassesByConditions();
        const data = {
          objectId: this.input.objectId,
          schoolYear: this.query.schoolYear,
          term: this.query.term,
          classRoomLevel: this.input.classRoomLevel,
          classRoomName: this.input.classRoomName,
          classId: objectId,
          send_score: false,
          subject: {
            __type: "Pointer",
            className: "Subjects",
            objectId: this.input.subject.objectId
          },
          teachers: {
            __type: "Pointer",
            className: "_User",
            objectId: this.input.teachers.objectId
          },
          department: this.input.department,
          type: "วิชาบังคับ"
        };
        console.log("teach data", data);
        await this.updateSubjectToTeach(data);
        this.resetForm();
        await this.getSubjectsFromTeach().then(result => (this.items = result));
        this.close();
      } else {
        console.log("save");
        const objectId = await this.getClassesByConditions();
        const data = {
          schoolYear: this.query.schoolYear,
          term: this.query.term,
          classRoomLevel: this.input.classRoomLevel,
          classRoomName: this.input.classRoomName,
          classId: objectId,
          send_score: false,
          rating: [],
          subject: {
            __type: "Pointer",
            className: "Subjects",
            objectId: this.input.subject.objectId
          },
          teachers: {
            __type: "Pointer",
            className: "_User",
            objectId: this.input.teachers.objectId
          },
          department: this.input.department,
          type: "วิชาบังคับ"
        };
        console.log("teach data", data);
        await this.addSubjectToTeach(data);
        this.resetForm();
        await this.getSubjectsFromTeach().then(result => (this.items = result));
        this.close();
      }
    },
    async deleteSubject(objectId) {
      const response = await this.$store.dispatch(
        `teach/deleteSubjectInTeach`,
        objectId
      );
      await this.getSubjectsFromTeach().then(result => (this.items = result));
      // console.log('response', response)
    },
    selectInputSubjects() {
      this.classSubject = [];
      this.subjects.forEach(subject => {
        var data = {
          text: subject.codet + " " + subject.sname,
          value: subject.objectId
        };
        this.classSubject.push(data);
      });
      console.log("classSubject index", this.classSubject, this.classSubject.length);
    },
    selectInputClasses() {
      // console.log("this classes", this.classes);
      for (var index = 0; index < this.classes.length; index++) {
        this.classRoomLevel.push(this.classes[index].classRoomLevel);
        this.classRoomName.push(this.classes[index].classRoomName);
      }
      console.log("classRoomLevel index", this.classRoomLevel);
    },
    selectInputTeacher() {
      this.itemTeachers = []
      for (var index = 0; index < this.teachers.length; index++) {
        const teacher = {
          name:
            this.teachers[index].title +
            " " +
            this.teachers[index].firstName +
            " " +
            this.teachers[index].lastName,
          value: this.teachers[index].objectId
        };
        this.itemTeachers.push(teacher);
      }
      console.log('option teacher : ', this.itemTeachers)
    },
    addClasses(item) {
      this.$router.push({
        name: "teach-add_classes",
        query: {
          classId: item.objectId,
          schoolYear: this.query.schoolYear,
          term: this.query.term
        }
      });
    },
    editSubjectName() {
      var subject_name = this.subjects.filter(
        subject => subject.objectId == this.input.subject.objectId
      );
      // this.subjectInfo = { codet: subject_name[0].codet,sname: subject_name[0].sname, credit: subject_name[0].credit, hour: subject_name[0].hour};
      this.subjectId = subject_name[0].objectId;
      console.log("subjectId", this.subjectId);
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      console.log('object assign to input item.teachers', Object.assign({}, item.teachers))
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
      item.forEach(item => {
        department.push(item.name);
      });
      // console.log('item deprt', department)
      return department;
    },
    back() {
      this.$router.go(-1);
    },
    resetForm() {
      this.$refs.form.reset();
    },
    close() {
      this.resetForm()
      this.dialog = false;
      this.editedIndex = -1;
    }
  }
};
</script>
