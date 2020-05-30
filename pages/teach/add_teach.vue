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
                      <span class="headline" >เลือกวิชา</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              :items="selectSubjects"
                              outlined
                              label="วิชา"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              outlined
                              label="ระดับชั้น"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              outlined
                              label="ห้อง"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              outlined
                              label="อาจารย์ผู้สอน"
                            ></v-text-field>
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
    mounted() {
      this.query = this.$route.query
      this.getSubjects().then(result => (this.subjects = result))
    },
    computed: {
      subject() {
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
          { text: 'รหัสห้อง', value: 'classRoomId', align:'center'},
          { text: 'ระดับชั้น', value: 'classRoomLevel', align:'center' },
          { text: 'ห้อง', value: 'classRoomName', align:'center' },
          // { text: 'จำนวนนักเรียน', value: 'teatherId', align:'center' },
          { text: 'Actions', value: 'actions', sortable: false, align:'center'}
        ],
        dialogCreateTeach: false,
        items: [],
        subjects: [],
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
      save() {
        console.log('save')
      },
      back() {
        console.log('back')
      },
      close() {
        this.dialogCreateTeach = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>