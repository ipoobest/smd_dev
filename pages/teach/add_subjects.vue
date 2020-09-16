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
          <v-simple-table :search="search" align="center">
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
                                v-model="input.subject_id"
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
                                v-model="input.dapartment"
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
                                v-model="input.teacher"
                                :items="itemTeachers"
                                item-text="name"
                                return-object
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
                        @click="save1"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <thead>
              <tr>
                <th>รหัส/ชื่อ</th>
                <th>ระดับชั้น</th>
                <th>ห้องเรียน</th>
                <th>ครูผู้สอน</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in subjectsInTerm" :key="index">
                <td v-if="item.subject_info">
                  {{ item.subject_info.codet }} {{ item.subject_info.sname }}
                </td>
                <td v-else>{{ item.sname }}</td>
                <th>{{ item.classRoomLevel }}</th>
                <th>{{ item.classRoomName }}</th>
                <th>{{ item.teacher.name }}</th>
                <th>
                  <v-btn color="info" @click="editItem(item)">
                    แก้ไข
                  </v-btn>
                  <v-btn color="error" @click="deleteItem(item)">
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
  async mounted() {
    this.query = this.$route.query;
    await this.getSubjectsFromTeach().then(
      result => (this.subjectsInTerm = result)
    );

    await this.getSubjects().then(result => (this.subjects = result));
    await this.getClass().then(result => (this.classes = result));
    await this.getTeacher().then(result => (this.teachers = result));
    await this.getDepartment().then(result=> (this.items_depart = result))
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
    },
    // watch: {
    //   dialog(val) {
    //     val || this.close();
    //   }
    // },
  },
  data() {
    return {
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
        `classes/getClassesByAcademicYears`,
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
        type: "วิชาบังคับ"
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
      console.log('this xxx', response.results)
      return response.results;
    },
    async getClassesByAcademicYears() {
      const condition = {
        schoolYear: this.query.schoolYear,
        term: this.query.term,
        classRoomLevel: this.input.classRoomLevel,
        classRoomName: this.input.classRoomName
      };
      const response = await this.$store.dispatch(
        `classes/getClassesByAcademicYears`,
        condition
      );
      console.log("getClassss ", response.results[0].objectId);
      return response.results[0].objectId;
    },
    async getDepartment() {
      const response = await this.$store.dispatch(
        `department/getDepartment`
      );
      this.department = this.mapDepartment(response.results)
      return response.results
    },
    async addSubjectToTeach(data) {
      const response = await this.$store.dispatch(`teach/createTeach`, data);
      await this.getSubjectsFromTeach().then(
        result => (this.subjectsInTerm = result)
      );
    },
    async updateSubjectToTeach(data) {
      const response = await this.$store.dispatch(`teach/updateTeach`, data);
      await this.getSubjectsFromTeach().then(
        result => (this.subjectsInTerm = result)
      );
    },
    async save() {
      // query studets id เอาแต่ students id
      const objectId = await this.getClassesByAcademicYears();
      var subjectInfo = await this.input.classSubject;
      const data = {
        schoolYear: this.query.schoolYear,
        term: this.query.term,
        classRoomLevel: this.input.classRoomLevel,
        classRoomName: this.input.classRoomName,
        classId: objectId,
        teacher: this.input.teacher,
        send_score: false,
        rating: [],
        subject_id: this.input.subject_id,
        subject_info: subjectInfo,
        dapartment: this.input.dapartment,
        type: "วิชาบังคับ"
      };
      console.log("teach data", data);
      this.addSubjectToTeach(data);
      this.resetForm();
      this.close();
    },
    async save1() {
      if(this.editedIndex > -1) {
        console.log('edit')
         const objectId = await this.getClassesByAcademicYears();
        const data = {
          objectId: this.input.objectId ,
          schoolYear: this.query.schoolYear,
          term: this.query.term,
          classRoomLevel: this.input.classRoomLevel,
          classRoomName: this.input.classRoomName,
          classId: objectId,
          teacher: this.input.teacher,
          send_score: false,
          rating: [],
          subject_id: this.input.subject_id,
          // subject_info: this.subjectInfo,
          dapartment: this.input.dapartment,
          type: "วิชาบังคับ"
      };
      console.log("teach data", data);
      this.updateSubjectToTeach(data);
      this.resetForm();
      this.close();
      } else {
        console.log('save')
         const objectId = await this.getClassesByAcademicYears();
        const data = {
          schoolYear: this.query.schoolYear,
          term: this.query.term,
          classRoomLevel: this.input.classRoomLevel,
          classRoomName: this.input.classRoomName,
          classId: objectId,
          teacher: this.input.teacher,
          send_score: false,
          rating: [],
          subject_id: this.input.subject_id,
          subject_info: this.subjectInfo,
          dapartment: this.input.dapartment,
          type: "วิชาบังคับ"
      };
      console.log("teach data", data);
      this.addSubjectToTeach(data);
      this.resetForm();
      this.close();
      }
    },
    async deleteSubject(objectId) {
      const response = await this.$store.dispatch(
        `teach/deleteSubjectInTeach`,
        objectId
      );
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
      console.log("classSubject index", this.classSubject);
    },
    selectInputClasses() {
      console.log("this classes", this.classes);
      for (var index = 0; index < this.classes.length; index++) {
        this.classRoomLevel.push(this.classes[index].classRoomLevel);
        this.classRoomName.push(this.classes[index].classRoomName);
      }
      console.log("classRoomLevel index", this.classRoomLevel);
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
          value: this.teachers[index].objectId
        };
        this.itemTeachers.push(teacher);
      }
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
      var subject_name = this.subjects.filter(subject => subject.objectId == this.input.subject_id);
      this.subjectInfo = { codet: subject_name[0].codet,sname: subject_name[0].sname};
      console.log('subject infoxx', this.subjectInfo )
    },
    editItem(item) {

      this.editedIndex = this.subjectsInTerm.indexOf(item);
      this.input = Object.assign({}, item);
      console.log("item edit", this.input);
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
      var department = []
      item.forEach(item => {
        department.push(item.name)
      })
      // console.log('item deprt', department)
      return department
    },
    back() {
      this.$router.go(-1);
    },
    resetForm() {
      this.$refs.form.reset();
    },
    close() {
      this.dialog = false;
      this.editedIndex = -1;
    }
  }
};
</script>
