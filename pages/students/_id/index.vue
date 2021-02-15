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
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
export default {
  layout: "student",
  mounted() {
  // get students by idcard
    
    this.getStudets(this.$store.state.auth.auth.idstd).then(result => (this.student = result))
    this.getDataFromApi().then(result => (this.items = result));
    
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
      class: "",
      student: '',
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
      
      return response.results;
    },
    async getStudets(id) {
      const data = {
        idstd: id
      }
      const response = await this.$store.dispatch(
        "students/getStudents",
        data
      );
      
      return response.results[0]
    },
    subjectList(item) {
      // 
        this.$router.push({
          name: "students-grade",
          query: { id: this.student.idstd ,schoolYear: item.schoolYear, term: item.term }
          // query: { id: item.idstd, schoolYear: this.student.schoolYear, term: this.student.term }
      });
    }
  }
};
</script>
