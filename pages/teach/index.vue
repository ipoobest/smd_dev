<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back" >
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>                     
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
            :search="search">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn  color="success" dark class="mr-2" @click="addSubject(item)">
                จัดการวิชาบังคับ
              </v-btn>
              <v-btn  color="info" dark class="mr-2" @click="addElevtiveSubject(item)">
                จัดการวิชาเลือกเสรี
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  // middleware: 'authentication',
  middleware: 'admin',
  mounted() {
    this.getDataFromApi().then(result => (this.items = result))
  },  
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  data() {
    return {
      headers: [
        { text: 'ปีการศึกษา', value: 'schoolYear' ,align: 'center',},
        { text: 'เทอม', value: 'term', align: 'center  '},
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],
      dialogCreateYear: false,
      items: [],
      search: ``,
      title: `การจัดการเรียนการสอน`,
      academicYear: {
        schoolYear: '',
        term: ''
      }
    }
  },
  methods: {
    async getDataFromApi() {
      const response = await this.$store.dispatch(`academic_year/getAcademicYear`)
      
      return response.results
    },
    back() {
      this.$router.push({name: 'index'})
    },
    async addSubject(item) {
      // 
      // this.$store.commit('academic_year/setSchoolYear', item.schoolYear)
      // this.$store.commit('academic_year/setTerm', item.term)
      // 
      this.$router.push({ name: 'teach-add_subjects', query: { schoolYear: item.schoolYear, term: item.term} })
    },
    async addElevtiveSubject(item) {
      this.$router.push({ name: 'teach-add_elective_subjects', query: { schoolYear: item.schoolYear, term: item.term} })

    }
  }
}
</script>
