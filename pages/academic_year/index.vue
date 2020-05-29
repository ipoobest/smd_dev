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
                <v-dialog v-model="dialogCreateYear" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="info" dark class="mr-2" v-on="on"
                      >เพิ่มปีการศึกษา</v-btn
                    >
                  </template>

                  <v-card>
                    <v-card-title>
                      <span class="headline">เพิ่มปีการศึกษา</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="academicYear.schoolYear"
                              outlined
                              label="ปีการศึกษา"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="academicYear.term"
                              outlined
                              label="เทอม"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="black darken-1" text @click="close"
                        >ยกเลิก</v-btn
                      >
                      <v-btn
                        class="success"
                        color="darken-1"
                        text
                        @click="addAcademicYear"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }" >
              <v-btn  color="success" dark class="mr-2" @click="addClasses(item)">
                เพิ่มชั้นเรียน</v-btn>
              <v-btn color="error" @click="deleteItem(item)">
                ลบ
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
    async createAcademicYear(data) {
      const response = await this.$store.dispatch(`academic_year/createAcademicYear`, data)
      console.log('res create', response)
    },
    async deteleAcademicYear(itemId) {
      const response = await this.$store.dispatch(`academic_year/deleteAcademicYear`, itemId)
      console.log('res ', response)
    },
    addClasses(item) {
      this.$router.push({
        name: 'classes',
        query: { schoolYear: item.schoolYear, term: item.term}
      })
    },
    deleteItem(item) {
      const index = this.items.indexOf(item)
      confirm('ยืนยีนการลบปีการศึกษา')
      this.deteleAcademicYear(item.objectId)
      this.items.splice(index, 1)
    },
    addAcademicYear() {
      this.createAcademicYear(this.academicYear)
      this.items.push(this.academicYear)
      this.academicYear = {}
      this.close()

    },
    close() {
      setTimeout(() => {
        this.dialogCreateYear = false
      }, 300)
    },    
  }
}
</script>
