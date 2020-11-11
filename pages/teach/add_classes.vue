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
                <v-dialog  v-model="dialogCreateTeach" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mr-2" v-on="on"
                      >เพิ่ม</v-btn
                    >
                  </template>

                  <v-card>
                    <v-card-title>
                      <span class="headline" >เพิ่มห้องเรียน/ครูผู้สอน</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="input.classRoomLevel"
                              :items="classRoomLevel"
                              outlined
                              label="ระดับชั้น"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="input.classRoomName"
                              :items="classRoomName"
                              outlined
                              label="ห้องเรียน"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="input.teacherId"
                              :items="imtemTeachers"
                              outlined
                              label="ครูผู้สอน"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>    
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
              <v-btn color="info" @click="addClasses(item)">
                เพิ่มห้องเรียน/ครูผู้สอน
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
    middleware: 'admin',
    async mounted() {
    //  this.params = this.$store.state.teach.classId
    this.query = this.$route.query
    await this.getClass().then(result => (this.classes = result))
    await this.getTeacher().then(result => (this.teachers = result))
    await this.selectInputClasses()
    await this.selectInputTeacher()
    },
    data() {
      return {
        title: 'เพิ่มห้องเรียน',
        dialogCreateTeach: false,
        singleSelect: false,
        search: '',
        params: '',
        items: [],
        classes: [],
        teachers: [],
        headers: [
          { text: 'รหัสห้อง', value: 'classRoomId', align:'center'},
          { text: 'ระดับชั้น', value: 'classRoomLevel', align:'center'},
          { text: 'ห้อง', value: 'classRoomName', align:'center' },
          { text: 'ครูผู้สอน', value: 'credit', align:'center' },
        ],
        query: {
          classId: '',
          schoolYear: '',
          term: ''
        },
        input: {
          classRoomLevel: '',
          classRoomName: '',
          teacherId: ''
        },
        classRoomLevel: [],
        classRoomName: [],
        imtemTeachers: []
      }
    },
    methods: {
      async getDataFromTeach(teacjId) {
        const response = await  this.$store.dispatch(`teach/getClassesByAcademicYears`, conditions)
        console.log('classes', response.results)
        return response.results
      },
      async getClass() {
        const conditions = {
          schoolYear: this.query.schoolYear,
          term: this.query.term
        }
        const response = await  this.$store.dispatch(`classes/getClassesByAcademicYears`, conditions)
        console.log('classes', response.results)
        return response.results
      },
      async getTeacher() {
        const response = await this.$store.dispatch(`teachers/getTeacher`)
        console.log('teacher', response.results)
        return response.results
      },
      async addClassToTeach(){
        // const response = await  this.$store.dispatch(`teach/updateClasses`, object)
        // console.log('classes', response.results)
      },
      async addTeacherToTeach() {
        // const response = await  this.$store.dispatch(`teach/updateTeacher`, object)
        // console.log('classes', response.results)
      },
      selectInputClasses() {
        console.log('this classes', this.classes)
        for (var index = 0; index < this.classes.length; index++) {
          this.classRoomLevel.push(this.classes[index].classRoomLevel)
          this.classRoomName.push(this.classes[index].classRoomName)
        }
          console.log('classRoomLevel index', this.classRoomLevel)
      },
      selectInputTeacher() {
        for (var index = 0; index < this.teachers.length; index++) {
          this.imtemTeachers.push(this.teachers[index].title + " " +
          this.teachers[index].firstName + " " +
          this.teachers[index].lastName )
        }
      },
      addClasses() {},
      back() {
        this.$router.go(-1)
      },
      close() {
        this.dialogCreateTeach = false
      },
      save() {
        console.log('item save', this.input)
        this.close()
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>