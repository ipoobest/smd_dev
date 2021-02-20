<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }}
            <v-spacer></v-spacer>
            ปีการศึกษา {{ query.schoolYear }} เทอม {{ query.term }} ชั้น
            {{ query.classRoomLevel }} ห้อง {{ query.classRoomName }}
          </v-card-title>
          <v-data-table :headers="headers" :items="items">
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="success" dark class="mr-2" @click="grade(item)">
                ดูคะแนน</v-btn
              >
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
    this.query = await this.$route.query;
    await this.getRanking().then((result) => {
      this.items = result;
    });
    console.log("query", this.query);
    // this.getDataFromApi().then(result => (this.academicYearItems = result));
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  data() {
    return {
      headers: [
        { text: "เลขที่", value: "", align: "center" },
        { text: "รหัส", value: "studentId", align: "center  " },
        {
          text: "ชื่อ-นามสกุล",
          value: "studentName",
          sortable: false,
          align: "center",
        },
        {
          text: "GPA เทอม 1",
          value: "gpa",
          sortable: false,
          align: "center",
        },
        {
          text: "GPA เทอม 2",
          value: "",
          sortable: false,
          align: "center",
        },
        { text: "GPA รวม", value: "", sortable: false, align: "center" },
      ],
      dialogCreateYear: false,
      schoolYear: "",
      term: "",
      items: [],
      title: `เกรดรวม`,
      query: "",
    };
  },
  methods: {
    async getClasses() {
      var condition = {
        schoolYear: this.schoolYear,
        term: this.term,
      };
      console.log("data request", condition);
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        condition
      );
      console.log("response getclasses", response.results);
      if (response.results.length == 0) {
        alert("ไม่พบข้อมูล");
        return;
      }
      return response.results;
    },
    async getRanking() {
      var condition = {
        schoolYear: this.query.schoolYear,
        classRoomLevel: this.query.classRoomLevel,
        classRoomName: this.query.classRoomName,
      };
      const response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        condition
      );
      console.log("response result", response.results);
      return response.results;
    },
    search() {
      if (this.$refs.form.validate()) {
        this.getClasses().then((result) => (this.items = result));
      } else {
        return;
      }
    },
    grade(item) {
      console.log("item grade", item);
      // this.$router.push({
      //   name: "grade_summary-grade",
      //   query: { id: item.objectId },
      // });
    },
    back() {
      this.$router.push({ name: "index" });
    },
    resetForm() {
      this.$refs.form.reset();
    },
    close() {
      setTimeout(() => {
        this.dialogCreateYear = false;
      }, 300);
    },
  },
};
</script>
