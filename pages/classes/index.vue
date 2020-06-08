<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back" >
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>  
            {{ title }} ของปีการศีกษา {{ classItem.schoolYear }} เทอม {{ classItem.term }}
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
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            align="center"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">              
                <v-spacer></v-spacer>
                <v-dialog  v-model="dialogAddClass" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mr-2" v-on="on"
                      >เพิ่มชั้นเรียน</v-btn
                    >
                  </template>

                  <v-card>
                    <v-card-title>
                      <span class="headline" >{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="form" validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="classItem.classRoomId"
                              outlined
                              label="รหัสห้อง"
                              required
                              :rules="[v => !!v || 'กรุณากรอก รหัสห้อง']"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="classItem.classRoomLevel"
                              :items="itemLevel"
                              outlined
                              label="ระดับชั้น"
                              required
                              :rules="[v => !!v || 'กรุณากรอก ระดับชั้น']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="classItem.classRoomName"
                              outlined
                              label="ห้อง"
                              required
                              :rules="[v => !!v || 'กรุณากรอก ห้องเรียน']"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="classItem.teatherName"
                              :items="selectItemTeacher"
                              outlined
                              label="อาจารย์ประจำชั้น"
                              required
                              :rules="[v => !!v || 'กรุณาเลือก อาจารย์ประจำชั้น']"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close"
                        >ยกเลิก</v-btn
                      >
                      <v-btn
                        class="success"
                        color=" darken-1"
                        text
                        @click="save"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog> 
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn color="info" @click="addStudent(item)">
                รายชื่อนักเรียน
              </v-btn>
              <!-- <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon> -->
              <v-btn color="error"  @click="deleteItem(item)">
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
  middleware: 'authentication',
  async mounted() {
    this.classItem = this.$route.query
    // console.log('route params', this.$route.query)
    await this.getListClass(this.classItem).then(result => (this.items = result))
    await this.getListTeacher().then(result => (this.teachers = result))
    await this.selectItemTeachers()
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'เพิ่มชั้นเรียน' : 'แก้ไข'
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },      
  data() {
    return {
      dialogAddClass: false,
      dialogCreateYear: false,
      headers: [
        { text: 'รหัสห้อง', value: 'classRoomId', align:'center'},
        { text: 'ระดับชั้น', value: 'classRoomLevel', align:'center' },
        { text: 'ห้อง', value: 'classRoomName', align:'center' },
        // { text: 'จำนวนนักเรียน', value: 'teatherId', align:'center' },
        { text: 'Actions', value: 'actions', sortable: false, align:'center'}
      ],
      items: [],
      search: ``,
      title: `ห้องเรียน`,
      editedIndex: -1,
      classItem: {
        schoolYear: '',
        term: '',
        classRoomId: '',
        classRoomLevel: '',
        classRoomName: '',
        studentId: [],
        teatherName: ''
      },
      academicYear: {
        schoolYear: '',
        term: ''
      },
      selectAcademic: [],
      teachers: [],
      year: [],
      schoolYear: '',
      term: '',
      itemLevel: ['ม.1','ม.2','ม.3','ม.4','ม.5','ม.6',],
      selectItemTeacher: []
    }
  },
  methods: {
    async getListClass(classItem) {
      console.log('classItem', classItem)
      const response = await this.$store.dispatch(`classes/getClassesByAcademicYears`, classItem)
      console.log(response.results)
      return response.results
    },
    async getListTeacher(){
      const response = await this.$store.dispatch(`teachers/getTeacher`)
      return response.results
    },
    async createClasses(data) {
      console.log('create Classes ', data)
       const response = await this.$store.dispatch(`classes/createClasses`, data)
      console.log('res create', response)
    },
    async updateClasses(data) {
      // console.log('data update ', data)
      // console.log('res ', response)
    },
    async deteleClasses(itemId) {
      console.log('delete ', itemId)
      const response = await this.$store.dispatch(`classes/deleteClass`, itemId)
      // console.log('res ', response)
    },
    async getAcademicYear() {
      const response = await this.$store.dispatch(`academic_year/getAcademicYear`)
      // console.log('response academicYear', response.results)
      return response.results
    },    
    async createAcademicYear(object) {
      const response = await this.$store.dispatch(
        `academic_year/createAcademicYear`, object)
      // console.log('create years reuslt', response)
      this.getListClass(this.classItem).then(result => (this.items = result))
    },
    selectItemTeachers() {
      console.log('select item teacher', this.teachers)
      for(var index = 0; index < this.teachers.length; index++){
        this.selectItemTeacher.push(this.teachers[index].teacherTitle + " " + 
        this.teachers[index].firstName + " " + 
        this.teachers[index].lastName)
      }
      console.log('resss', this.selectItemTeacher)
    },
    editItem(item) {
      // console.log('item id ', item)
      this.editedIndex = this.items.indexOf(item)
      this.classItem = Object.assign({}, item)

      this.dialog = true
    },
    deleteItem(item) {
      const index = this.items.indexOf(item)
      if(confirm('ยืนยีนการลบข้อมูล')) {
        this.deteleClasses(item.objectId)
        this.items.splice(index, 1)
      } 
    },
    back() {
      this.$router.go(-1)
    },
    close() {
      console.log('closd')
      if(this.dialogAddClass) {
        this.dialogAddClass = false 
      } else if(this.dialogCreateYear) {
        this.dialogCreateYear = false
      }
      setTimeout(() => {
        this.classItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.classItem)
        console.log('put xx ', this.classItem)
        const editData = {
          objectId: this.classItem.objectId,
          ClassesId: this.classItem.ClassesId,
          ClassesPosition: this.classItem.ClassesPosition,
          title: this.classItem.title,
          firstName: this.classItem.firstName,
          lastName: this.classItem.lastName
        }
        this.updateClasses(editData)
      } else {
        if(this.$refs.form.validate()){
          this.createClasses(this.classItem)
          this.items.push(this.classItem)
          this.classItem = {}
          this.close()
        }
      }
    },
    addYears() {
      this.createAcademicYear(this.academicYear)
      // this.selectAcademic.push(`${this.academicYear.schoolYear} เทอม  ${this.academicYear.term}`)
      this.close()

    },
    addStudent(item) {
      console.log('item id ', item.objectId)
      this.$router.push({
        name: 'classes-add_student',
        query: { id: item.objectId }
      })
    }
  }
}
</script>
