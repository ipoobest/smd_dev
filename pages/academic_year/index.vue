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
                      <v-form ref="form" validation>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="academicYear.schoolYear"
                                outlined
                                label="ปีการศึกษา"
                                required
                                :rules="[v => !!v || 'กรุณากรอกข้อมูล ปีการศึกษา']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="academicYear.term"
                                outlined
                                label="เทอม"
                                required
                               :rules="[v => !!v || 'กรุณากรอกข้อมูล เทอม']"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
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
                        @click="save"
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
              <v-btn color="error" @click="deleteItemDialog = true">
                ลบ
              </v-btn>
              <v-dialog
                v-model="deleteItemDialog"
                max-width="360"
              >
                <v-card>
                  <v-card-title class="headline">ยืนยันการลบ</v-card-title>
                  <v-card-text>
                   ยืนยันการลบข้อมูลปีการศึกษา  {{ item.schoolYear + " เทอม " + item.term }}
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      class="info"
                      text
                      @click="deleteItemDialog = false"
                    >
                      ยกเลิก
                    </v-btn>
                    <v-btn
                      class="error"
                      text
                      @click="deleteItem(item)">
                      ยืนยัน
                    </v-btn>
                  </v-card-actions>
                </v-card>       
              </v-dialog>       
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
      deleteItemDialog: false,
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
        this.deteleAcademicYear(item.objectId)
        console.log('delete log')
        this.items.splice(index, 1)
        this.deleteItemDialog = false
    },
    save() {
      if(this.$refs.form.validate()){
        this.createAcademicYear(this.academicYear)
        this.items.push(this.academicYear)
        this.academicYear = {}
      }
    },
    back() {
      this.$router.push({name: 'index'})
    },    
    close() {
      setTimeout(() => {
        this.dialogCreateYear = false
      }, 300)
    },    
  }
}
</script>
