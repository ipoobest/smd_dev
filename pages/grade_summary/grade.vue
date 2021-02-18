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
            ปีการศึกษา 2563 เทอม 1 ชั้น ม.1 ห้อง 1
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
  mounted() {
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
        { text: "เลขที่", value: "classRoomLevel", align: "center" },
        { text: "รหัส", value: "classRoomName", align: "center  " },
        {
          text: "ชื่อ-นามสกุล",
          value: "actions",
          sortable: false,
          align: "center",
        },
        {
          text: "GPA เทอม 1",
          value: "actions",
          sortable: false,
          align: "center",
        },
        {
          text: "GPA เทอม 2",
          value: "actions",
          sortable: false,
          align: "center",
        },
        { text: "GPA รวม", value: "actions", sortable: false, align: "center" },
      ],
      dialogCreateYear: false,
      schoolYear: "",
      term: "",
      items: [],
      title: `เกรดรวม`,
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
