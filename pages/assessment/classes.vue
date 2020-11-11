<template>
  <v-layout>
    <v-row >
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }} ของปีการศีกษา {{ this.$route.query.schoolYear }} เทอม
            {{ this.$route.query.term }}
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
            <v-simple-table :search="search" style="width:100%">
              <template>
                <thead >
                  <tr >
                    <th class="text-center">รหัสห้อง</th>
                    <th class="text-center">ระดับชั้น</th>
                    <th class="text-center">ห้อง</th>
                    <th class="text-center">action</th>
                  </tr>
                </thead>
                <tbody align="center">
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{ item.classRoomId }}</td>
                    <td>{{ item.classRoomLevel }}</td>
                    <td>{{ item.classRoomName }}</td>
                    <td>
                      <v-btn color="info" @click="listStudent(item)">
                        ดูข้อมูล
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
          
            </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  middleware: "assessment",
  layout: 'assessment',
  async mounted() {
    // this.classItem = this.$route.query
    console.log("route params", this.$route.query);
    await this.getListClass(this.$route.query).then(
      result => (this.items = result)
    );
    // await this.getListTeacher().then(result => (this.teachers = result));
    // await this.selectItemTeachers();
  },
  computed: {
   
  },
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
      classItem: {
        schoolYear: "",
        term: "",
        classRoomId: "",
        classRoomLevel: "",
        classRoomName: "",
        studentId: [],
        teatherName: ""
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
    };
  },
  methods: {
    async getListClass(classItem) {

      const response = await this.$store.dispatch(
        `classes/getClassesByAcademicYears`,
        classItem
      );
      console.log("getListClass", response);
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
      console.log("item id ", item);
      this.$router.push({
        name: "assessment-students",
        query: { id: item.objectId }
      });
    },
    resetForm() {
      this.$refs.form.reset();
    }
  }
};
</script>
