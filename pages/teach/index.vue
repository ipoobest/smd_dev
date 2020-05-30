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
            :search="search">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }" >
              <v-btn  color="info" dark class="mr-2" @click="addSubject(item)">
                จัดการ</v-btn>
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
      console.log('response', response)
      return response.results
    },
    async addSubject(item) {
      // console.log('teach', item)
      this.$router.push({ name: 'teach-add_teach', query:{ schoolYear: item.schoolYear, term: item.term} })
    }
  }
}
</script>
