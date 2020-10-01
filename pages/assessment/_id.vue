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
            <!-- <template v-slot:item.actions="{ item }" >
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
  mounted() {
    this.params = this.$route.params.id;
    this.class = this.$route.query.class;
    this.getDataFromApi().then(result => (this.items = result));
    console.log("this.params",  this.class);
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
      console.log("response", response);
      return response.results;
    },

    subjectList(item) {
      console.log(item);
      if (this.class === "true") {
        this.$router.push({
          name: "assessment-classes",
          query: { schoolYear: item.schoolYear, term: item.term }
      });
      } else {
        this.$router.push({
          name: "assessment-subjects",
          query: { schoolYear: item.schoolYear, term: item.term }
        });
      }
    }
  }
};
</script>
