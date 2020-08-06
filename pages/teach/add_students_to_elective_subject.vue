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
          <v-data-table :headers="headers" :items="items" :search="search">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-divider class="mx-4" inset vertical></v-divider>
                <p>วิชา {{ classInfo.sname }} ชั้น {{ classInfo.classRoomLevel }} </p>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on"
                      >เพิ่มนักเรียน</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">เพิ่มรายชื่อนักเรียน</span>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        v-model="items"
                        :headers="headerStudents"
                        :items="students"
                        :single-select="singleSelect"
                        item-key="objectId"
                        show-select
                        class="elevation-1"
                      >
                      </v-data-table>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <!-- <v-btn color="blue darken-1" text @click="close"
                        >Cancel</v-btn
                      > -->
                      <v-btn color="error" @click="close">ยกเลิก</v-btn>
                      <v-btn color="info" @click="save">เพิ่ม</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn class="error" small @click="deleteItem(item)">
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
  async mounted() {
    await this.getTeachById(this.$route.query.id).then(result => (this.classInfo = result))
    
    await this.getStudent().then(result => (this.students = result))
    await this.getStudents(this.classInfo.students).then(result => (this.items = result))
  },
  data() {
    return {
      xxx: [],
      index: -1,
      title: 'รายชื่อนักเรียน',
      id: '',
      search: '',
      dialog: false,
      classes: '',
      headers: [
        { text: 'รหัสประจำตัว', value: 'idstd' },
        { text: 'ชื่อ', value: 'namet' },
        { text: 'นามสกุล', value: 'snamet' },
        { text: 'actions', value: 'actions', sortable: false }
      ],
      headerStudents: [
        { text: 'รหัสประจำตัว', value: 'idstd' },
        { text: 'ชื่อ', value: 'namet' },
        { text: 'นามสกุล', value: 'snamet' }
      ],
      items: [],
      singleSelect: false,
      selectItems: [],
      students: [],
      studentId: [],
      // studentInClassLevel: [],
      student: {
        classId: '',
        classRoomLevel: '',
        classRoomName: '',
        term: ''

      },
      classInfo: ''
    }
  },
  methods: {
    async getTeachById(classId) {
      const response = await this.$store.dispatch(`teach/getTeachById`, classId)
      console.log('response xxxid', response)
      return response
    },
    async getStudent() {
      const conditions = {
        class : this.classInfo.classRoomLevel
      }
      const response = await this.$store.dispatch(`students/getStudentByConditions`, conditions)
      console.log('response', response)
      return response.results
    },
    async getStudents(items) {
      console.log('items', items)
      const objectId = {
        $in: items,
      }
      const response = await this.$store.dispatch(`students/getStudents`, {
        objectId
      })
      console.log('response student', response)
      return response.results
    },
    async getStudentsNotIn(items) {
      console.log('items not in', items)
      // const objectId = {
      //   $nin: items
      // }
      const query = {
        class: this.student.classRoomLevel,
        objectId: {
          $nin: items
        }
      }
      const response = await this.$store.dispatch(`students/getStudents`, 
        query
      )
      console.log('response', response)
      return response.results
    },
    async addStudents() {
      const object = {
        objectId: this.$route.query.id,
        students: this.studentId
      }
      console.log('object put', object)
      const response = await this.$store.dispatch(
        `teach/updateTeach`,
        object
      )
    },
    async deleteItem(item) {
      // console.log('delete id', item.objectId)
      const index = this.items.indexOf(item)
      if(confirm('ยืนยีนการลบนักเรียนออกจากชั้นเรียน')){
        this.items.splice(index, 1)
        // console.log('item delete', this.items.length, this.items)
        for (var i = 0; i < this.items.length; i++) {
          this.studentId.push(this.items[i].objectId)
        }
        // console.log('item push', this.studentId)
        this.addStudents(this.studentId)
      }
    },
    back() {
      this.$router.go(-1)
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.index = -1
      }, 300)
    },
    save() {
      console.log('save',this.items)
      for (var index = 0; index < this.items.length; index++) {
        this.studentId.push(this.items[index].objectId)
      }
      console.log('looper', this.studentId)
      this.addStudents(this.studentId)
      this.close()
    }
  }
}
</script>
