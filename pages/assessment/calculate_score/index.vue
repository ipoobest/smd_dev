<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ title }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            @click:row="subjectList"
          >
            <!-- <template v-slot:[`item.actions`]="{ item }" >
              <v-btn  color="success" dark class="mr-2" @click="addClasses(item)">
                เพิ่มชั้นเรียน</v-btn>
              <v-btn color="error" @click="deleteItem(item)">
                ลบ
              </v-btn>
            </template> -->
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
export default {
  layout: "assessment",
  middleware: "assessment",
  mounted() {
    this.params = this.$route.params.id;
    this.getDataFromApi().then(result => (this.items = result));
    // 
  },

  data() {
    return {
      params: "",
      headers: [
        { text: "ปีการศึกษา", value: "schoolYear", align: "center" },
        { text: "เทอม", value: "term", align: "center  " }
        // { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],
      title: 'ปีการศึกษา',
      dialogCreateYear: false,
      items: [],
      search: ``,
      academicYear: {
        schoolYear: "",
        term: ""
      }
    };
  },
  methods: {
    async getDataFromApi() {
      const response = await this.$store.dispatch(
        `academic_year/getAcademicYear`
      );
      // 
      return response.results;
    },

    subjectList(item) {
      // 
        this.$router.push({
          name: "assessment-calculate_score-subjects",
          query: { schoolYear: item.schoolYear, term: item.term }
        });
    }
  }
};
</script>
