<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back" >
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>  
            {{ title }} ของปีการศีกษา {{query.schoolYear }} เทอม {{ query.term }}
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
            :items="subjectsInTerm"
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
                      <span class="headline" >สร้างการเรียน</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="form" validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="input.classSubject"
                              :items="classSubject"
                              outlined
                              label="วิชา"
                              required
                              :rules="[v => !!v || 'กรุณาเลือกวิชา']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="input.teacher"
                              :items="itemTeachers"
                              item-text="name"
                              return-object
                              outlined
                              label="ครูผู้สอน"
                              require
                              :rules="[v => !!v || 'กรุณาเลือกครูผู้สอน']"
                            ></v-select>
                            </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="input.classRoomLevel"
                              :items="classRoomLevel"
                              outlined
                              label="ระดับชั้น"
                              required
                              :rules="[v => !!v || 'กรุณาเลือกระดับชั้น']"
                            ></v-select>
                          </v-col>
                          <!-- <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="input.classRoomName"
                              :items="classRoomName"
                              outlined
                              label="ห้องเรียน"
                              required
                              :rules="[v => !!v || 'กรุณาเลือกระดับชั้น']" 
                            ></v-select>
                          </v-col> -->
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
                        @click="addSubject"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog> 
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn color="info" @click="addStudent(item)">
                เพิ่มรายชื่อนักเรียน
              </v-btn>
              <v-btn color="error"  @click="deleteItem(item)">
                ลบวิชา
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
    async mounted() {
      this.query = this.$route.query
      await this.getSubjectsFromTeach().then(result => (this.subjectsInTerm = result))

      await this.getSubjects().then(result => (this.subjects = result))
      await this.getClass().then(result => (this.classes = result))
      await this.getTeacher().then(result => (this.teachers = result))

      await this.selectInputSubjects()
      await this.selectInputClasses()
      await this.selectInputTeacher()
    },
    computed: {
      selectSubject() {
        for (var i = 0; i < this.subjects.length; i++) {
          this.selectSubjects.push(this.subjects[i].sname)
        }
        console.log('looper', this.selectSubjects)
      }
    },
    data() {
      return {
        title: 'การจัดการวิชา',
        search: '',
        headers:  [
          { text: 'รหัส/ชื่อวิขา', value: 'sname', align:'center' },
          { text: 'ระดับชั้น', value: 'classRoomLevel', align:'center'},
          { text: 'ครูผู้สอน', value: 'teacher.name', align:'center' },
          { text: 'Actions', value: 'actions', sortable: false, align:'center'}
        ],
        dialogAddStudents: false,
        dialogCreateTeach: false,
        singleSelect: false,
        items: [],
        subjects: [],
        subjectsInTerm: [],
        selectSubjects: [],
        query: {
          schoolYear: '', 
          term: ''
        },
        input: {
          classSubject: '',
          classRoomLevel: '',
          classRoomName: '',
          teacher: []
        },
        classSubject: [],
        classRoomLevel: [],
        classRoomName: [],
        itemTeachers: [],
      }
    },
    methods: {
      async getClass() {
        const conditions = {
          schoolYear: this.query.schoolYear,
          term: this.query.term
        }
        const response = await  this.$store.dispatch(`classes/getClassesByAcademicYears`, conditions)
        return response.results
      },
      async getTeacher() {
        var conditions = {
          type: "ครู"
        }
        const response = await this.$store.dispatch(`users/getUserByConditions`, conditions)
        return response.results
      },      
      async getSubjects() {
         var conditions = {
          type: "วิชาเลือก"
        }
        const response = await this.$store.dispatch(`subjects/getSubjectsByConditions`, conditions)
        return response.results
      },
      async getSubjectsFromTeach() {
        const condition = {
          schoolYear: this.query.schoolYear,
          term: this.query.term,
          type: "วิชาเลือกเสรี"
        }
        const response = await this.$store.dispatch(`teach/getSubjectsByConditions`,condition)
        return response.results
      },
      async getClassesByAcademicYears() {
        const condition = {
          schoolYear: this.query.schoolYear,
          term: this.query.term,
          classRoomLevel: this.input.classRoomLevel,   
          classRoomName: this.input.classRoomName,   
        }
        const response = await this.$store.dispatch(`classes/getClassesByAcademicYears`, condition)
        return response.results[0].studentId
      },
      async addSubjectToTeach(data) {
        const response = await this.$store.dispatch(`teach/createTeach`, data)
        await this.getSubjectsFromTeach().then(result => (this.subjectsInTerm = result))
      },
      async addSubject() {
        const data = {
          schoolYear: this.query.schoolYear,
          term: this.query.term,
          sname: this.input.classSubject,   
          classRoomLevel: this.input.classRoomLevel,   
          classRoomName: "รวม",
          rating: [],
          students: [],
          teacher: this.input.teacher,
          type: "วิชาเลือกเสรี"
        }
        console.log('teach data', data)
        this.addSubjectToTeach(data)
        this.resetForm()
        this.close()
      },
      async deleteSubject(objectId) {
        const response = await this.$store.dispatch(`teach/deleteSubjectInTeach`, objectId)
        // console.log('response', response)
      },
      selectInputSubjects() {
        for (var index = 0; index < this.subjects.length; index++) {
          this.classSubject.push(this.subjects[index].codet + " " + this.subjects[index].sname )
        }
        console.log('classSubject index', this.classSubject)
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
          const teacher = {
            name: this.teachers[index].title + " " +
                  this.teachers[index].firstName + " " +
                  this.teachers[index].lastName ,
            value: this.teachers[index].objectId
          }
          this.itemTeachers.push(teacher)
        }
      },    
      addClasses(item) {
        this.$router.push({name:'teach-add_classes', 
        query:{ 
          classId: item.objectId, 
          schoolYear: this.query.schoolYear,
          term: this.query.term
          }
        })
      },
      addStudent(item) {
      console.log('item id ', item.objectId)
      this.$router.push({
        name: 'teach-add_students_to_elective_subject',
        query: { id: item.objectId }
      })
      },
      deleteItem(item) {
        const index = this.subjectsInTerm.indexOf(item)
        if (confirm('ยืนยีนการวิชาเรียน')){
          this.subjectsInTerm.splice(index, 1)  
          this.deleteSubject(item.objectId)
        }
      },
      back() {
        this.$router.go(-1)
      },
      resetForm() {
        this.$refs.form.reset()
      },
      close() {
        this.dialogCreateTeach = false
      }
    }
  }
</script>
