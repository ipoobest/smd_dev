<template>
  <div>
    <v-card>
      <v-card-title>
        แก้ไขการเรียนการสอน
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-select :items="items" v-model="pointer" label="pointer"></v-select>
        </v-col>
        <v-btn @click="update"> update</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="100"
        class="elevation-1"
      >
        <!-- <template #item.fullName="{ item }" > -->
        <!-- <template v-slot:[`item.fullName`]="{ item }">{{ item.teachers.title }} {{ item.teachers.firstName }} {{ item.teachers.lastName }}</template> -->
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: "fix_data",
  async mounted() {
    await this.getTeach().then((result) => (this.data = result));
    console.log("items : ", this.data);
  },
  data() {
    return {
      headers: [
        { text: "ชั้นเรียน", value: "classRoomLevel" },
        { text: "ห้องเรียน", value: "classRoomName" },
        { text: "ชื่อวิชา", value: "teachInfo.sname" },
        { text: "วิชา(pointer)", value: "subject.sname" },
        { text: "ครูผู้สอน", value: "teacher.name" },
        { text: "ครูผู้สอน(pointer)", value: "teachers.firstName" },
        { text: "กลุ่มสาระ", value: "department" },
        // { text: "นักเรียน(pointer)", value: "classRoomName" }
      ],
      data: [],
      pointer: "",
      items: ["วิชา", "ครู", "นักเรียน"],
    };
  },
  methods: {
    async getTeach() {
      const response = await this.$store.dispatch(`teach/getSubjectsPointer`);
      console.log("response getTeach", response.results[0]);
      return response.results;
    },
    async getSubjectId(code) {
      const data = {
        codet: code,
      };
      const response = await this.$store.dispatch(
        `subjects/getSubjectsByConditions`,
        data
      );
      // console.log("subjectId", response.results);
      return response.results;
    },
    async updateTeach(item) {
      console.log("update item", item);
      var subject_objectId = item.subject.objectId;
      var subject_name = item.subject_info
        ? item.subject_info.sname
        : item.subject.sname;
      var code_thai = item.subject_info
        ? item.subject_info.codet
        : item.subject.codet;
      var credit_subject = item.subject_info
        ? item.subject_info.credit
        : item.subject.credit;

      const data = {
        objectId: item.objectId,
        teachInfo: {
          objectId_subject: subject_objectId,
          sname: subject_name,
          codet: code_thai,
          credit: credit_subject,
        },
      };
      // console.log("update teach", data);
      const response = await this.$store.dispatch(`teach/updateTeach`, data);
      console.log("response", response);
      return;
    },
    async updateTeacher(classId, pointerId) {
      const data = {
        objectId: classId,
        teachers: {
          __type: "Pointer",
          className: "_User",
          objectId: pointerId,
        },
      };
      const response = await this.$store.dispatch(`teach/updateTeach`, data);
      console.log("response", response);
    },
    async updateStudent(data) {
      const response = await this.$store.dispatch(`teach/updateTeach`, data);
      console.log("success");
    },
    update() {
      console.log("this.pointer", this.pointer);
      switch (this.pointer) {
        case "วิชา":
          // console.log("this data, ", this.data);
          this.data.forEach(async (item) => {
            await this.updateTeach(item);
          });
          this.getTeach();
          break;
        case "ครู":
          console.log("teacher");
          this.data.forEach(async (item) => {
            // console.log('teacherId', item.teacher.value)
            await this.updateTeacher(item.objectId, item.teacher.value);
          });
          break;
        case "นักเรียน":
          console.log("นักเรียน");
          this.data.forEach(async (item) => {
            var studentPointer = [];
            if (item.students) {
              var studentId = item.students;
              studentId.forEach((id) => {
                var students = {
                  __type: "Pointer",
                  className: "Students",
                  objectId: id,
                };
                studentPointer.push(students);
              });
              var data = {
                objectId: item.objectId,
                student: {
                  __op: "AddRelation",
                  objects: studentPointer,
                },
              };
              console.log("studenId นักเรียน", data);
              // await this.updateStudent(data)
            }
            console.log("-------------------");
          });
          break;
        default:
          alert("กรุณาเลือก pointer");
      }
    },
  },
};
</script>
