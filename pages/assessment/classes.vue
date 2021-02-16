<template>
  <v-layout>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }} ของปีการศีกษา {{ this.$route.query.schoolYear }} เทอม
            {{ this.$route.query.term }}
            <v-spacer></v-spacer>
            <v-col cols="2">
              <v-select
                v-model="classesExport"
                :items="classes"
                label="ระดับชั้น"
              ></v-select>
            </v-col>
            <v-col cols="3" sm="6" md="3">
              <v-btn class="success" @click="exportXml()">Export</v-btn>
            </v-col>
          </v-card-title>
          <v-data-table
            style="width:100%"
            :search="search"
            :items="items"
            :headers="headers"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="info" @click="listStudent(item)">
                ดูข้อมูล
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import XLSX from "xlsx";

export default {
  middleware: "assessment",
  layout: "assessment",
  async mounted() {
    // this.classItem = this.$route.query
    // 
    await this.getListClass(this.$route.query).then(
      result => (this.items = result)
    );
    // await this.getListTeacher().then(result => (this.teachers = result));
    // await this.selectItemTeachers();
  },
  computed: {},
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
        { text: "รหัสห้อง", value: "classRoomId", align: "center" },
        { text: "ระดับชั้น", value: "classRoomLevel", align: "center" },
        { text: "ห้อง", value: "classRoomName", align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" }
      ],
      items: [],
      search: ``,
      title: `ห้องเรียน`,
      editedIndex: -1,
      ranking: "",
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
      term: "",
      classesExport: "0",
      classes: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      listSize: [10, 15, 20, 50, 100]
    };
  },
  methods: {
    async getListClass(classItem) {
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        classItem
      );
      // 
      return response.results;
    },
    async getRanking() {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.classesExport
      };
      const response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        condition
      );
      // 
      return response.results;
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

    listStudent(item) {
      // 
      this.$router.push({
        name: "assessment-students",
        query: { id: item.objectId }
      });
    },
    resetForm() {
      this.$refs.form.reset();
    },
    async exportXml() {
      // 
      if (this.classesExport == "0") {
        alert("กรุณาเลือกระดับชั้น");
      } else {
        this.ranking = await this.getRanking();
        var data = this.ranking.sort(
          (a, b) => a.rankingInClasses - b.rankingInClasses
        );
        // 
        const dataWS = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, dataWS);
        XLSX.writeFile(wb, "export.xlsx");
      }
    }
  }
};
</script>
