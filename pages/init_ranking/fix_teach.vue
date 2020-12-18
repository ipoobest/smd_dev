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
  async mounted() {
    await this.getTeach().then(result => (this.data = result));
    // console.log('items : ', this.data )
  },
  data() {
    return {
      headers: [
        { text: "ชั้นเรียน", value: "classRoomLevel" },
        { text: "ห้องเรียน", value: "classRoomName" },
        { text: "ชื่อวิชา",value: "subject_info.sname"},
        { text: "วิชา(pointer)", value: "subject.sname" },
        { text: "ครูผู้สอน", value: "teacher.name" },
        { text: "ครูผู้สอน(pointer)", value: "teachers.firstName" },
        { text: "กลุ่มสาระ", value: "department" },

        // { text: "นักเรียน(pointer)", value: "classRoomName" }
      ],
      data: [],
      pointer: "",
      items: ["วิชา", "ครู", "นักเรียน"]
    };
  },
  methods: {
    async getTeach() {
      const response = await this.$store.dispatch(`teach/getSubjectsPointer`);
      // console.log("response xx", response.results[0]);
      return response.results;
    },
    async getSubjectId(code) {
      const data = {
        codet: code
      };
      const response = await this.$store.dispatch(
        `subjects/getSubjectsByConditions`,
        data
      );
      // console.log("subjectId", response.results);
      return response.results;
    },
    async updateTeach(classId, pointerId) {
      const data = {
        objectId: classId,
        subject: {
          __type: "Pointer",
          className: "Subjects",
          objectId: pointerId
        }
      };
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
          objectId: pointerId
        }
      };
      const response = await this.$store.dispatch(`teach/updateTeach`, data);
      console.log("response", response);
    },
    update() {
      console.log("this.pointer", this.pointer);
      switch (this.pointer) {
        case "วิชา":
          this.data.forEach(async item => {
            const subjectId = await this.getSubjectId(item.subject_info.codet);
            // console.log('classesId , subjectId ', item.objectId, subjectId[0].objectId)
            await this.updateTeach(item.objectId, subjectId[0].objectId);
          });
          this.getTeach();
          break;
        case "ครู":
          console.log("teacher");
          this.data.forEach(async item => {
            // console.log('teacherId', item.teacher.value)
            await this.updateTeacher(item.objectId, item.teacher.value)
          })
          break;
        case "นักเรียน":
          console.log("นักเรียน");
          break;
        default:
          alert("กรุณาเลือก pointer");
      }
    }
  }
};
</script>
