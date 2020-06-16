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
            @click:row="subjectList">

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
    layout: 'teacher',
    mounted () {
      this.params = this.$route.params.id
      this.getDataFromApi().then(result => (this.items = result))
    },
    data() {
      return {
        params: '',
        headers: [
        { text: 'ปีการศึกษา', value: 'schoolYear' ,align: 'center',},
        { text: 'เทอม', value: 'term', align: 'center  '},
        // { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],
        dialogCreateYear: false,
        items: [],
        search: ``,
        title: `ปีการศึกษา`,
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
    subjectList(item) {
      console.log(item)
      this.$router.push({
        name: 'teachers-teach-subjects',
        params: { schoolYear: item.schoolYear, term: item.term, id: this.params}
      })
    }
  }
}
</script>
