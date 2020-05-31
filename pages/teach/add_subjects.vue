<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back" >
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>  
            {{ title }} ของปีการศีกษา {{ query.schoolYear }} เทอม {{ query.term }}
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
                      <span class="headline" >เลือกวิชา</span>
                    </v-card-title>

                    <v-card-text>
                      <v-data-table
                        v-model="items"
                        :headers="headersAddSubjects"
                        :items="subjects"
                        :single-select="singleSelect"
                        item-key="objectId"
                        show-select
                        class="elevation-1"
                      >
                      </v-data-table>
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
                        @click="addSubjects"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog> 
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn color="info" @click="addStudent(item)">
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
    mounted() {
      this.query = this.$route.query
      this.getSubjectsFromTeach().then(result => (this.subjectsInTerm = result))
      this.getSubjects().then(result => (this.subjects = result))
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
          { text: 'รหัสวิชา', value: 'codet', align:'center'},
          { text: 'ชื่อวิขา', value: 'sname', align:'center' },
          { text: 'หน่วยกิจ', value: 'credit', align:'center' },
          // { text: 'จำนวนนักเรียน', value: 'teatherId', align:'center' },
          { text: 'Actions', value: 'actions', sortable: false, align:'center'}
        ],
        headersAddSubjects: [
          { text: 'รหัสวิชา', value: 'codet', align:'center'},
          { text: 'ชื่อวิขา', value: 'sname', align:'center' },
          { text: 'หน่วยกิจ', value: 'credit', align:'center' },
        ],
        dialogCreateTeach: false,
        singleSelect: false,
        items: [],
        subjects: [],
        subjectsInTerm: [],
        selectSubjects: [],
        query: {
          schoolYear: '', 
          term: ''
        }
      }
    },
    methods: {
      async getSubjects() {
        const response = await this.$store.dispatch(`subjects/getSubjects`)
        console.log('response get subject', response.results)
        return response.results
      },
      async getSubjectsFromTeach() {
        const condition = {
          schoolYears: this.query.schoolYear,
          term: this.query.term
        }
        const response = await this.$store.dispatch(`teach/getSubjectsByTerm`,condition)
        console.log('response get subject xxx ', response)
        return response.results
      },
      async addSubjectToTeach(data) {
        const response = await this.$store.dispatch(`teach/createTeach`, data)
        console.log('response get subject', response)
      },
       addSubjects() {
        console.log('add subject', this.items)
        for(var index = 0; index < this.items.length; index++) {
          console.log('add subject', this.items[index])
          const data = {
            schoolYears: this.query.schoolYear,
            term: this.query.term,
            code: this.items[index].code,
            codet: this.items[index].codet,
            sname: this.items[index].sname
          }
        this.addSubjectToTeach(data)
        this.subjectsInTerm.push(data)
        }
        // this.getSubjectsFromTeach().then(result => (this.subjectsInTerm = result))
        this.close()
      },
      async deleteSubject(objectId) {
        var response = await this.$store.dispatch(`teach/deleteSubjectInTeach`, objectId)
        console.log('response', response)
      },
      addStudent() {
        console.log('save')
      },
      deleteItem(item) {
        const index = this.subjectsInTerm.indexOf(item)
        confirm('ยืนยีนการวิชาเรียน') && this.deleteSubject(item.objectId) 
        this.subjectsInTerm.splice(index, 1)
      },
      back() {
        this.$router.go(-1)
      },
      close() {
        this.dialogCreateTeach = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>