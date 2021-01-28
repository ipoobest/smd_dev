<template>
  <v-card>
    <v-row>
      <v-col cols="4">
        <v-btn @click="getOldClass()">get classes</v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn @click="updateTeacher()">update teacher</v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn @click="updateTeacherNextTerm()">update teacher nextTerm</v-btn>
      </v-col></v-row>
    <v-card-title>
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
    ></v-data-table>
  </v-card>
</template>

<script>
  export default {
    layout: 'fix_data',
    data () {
      return {
        search: '',
        headers: [
          { text: 'ปีการศึกษา', value: 'schoolYear' },
          { text: 'ชั้นเรียน', value: 'classRoomLevel' },
          { text: 'ห้องเรียน', value: 'classRoomName' },
          { text: 'ครูประจำชั้น 1 (เก่า)', value: 'teatherName.teather1' },
          { text: 'ครูประจำชั้น 2 (เก่า)', value: 'teatherName.teather2' },
          { text: 'ครูประจำชั้น 1', value: 'advisoryTeacher.teacher1' },
          { text: 'ครูประจำชั้น 2', value: 'advisoryTeacher.teacher2' },
        ],
        items: []
      }
    },
    methods: {
      async getClasses(data) {
        var query = {
          schoolYear: data.schoolYear,
          term: data.term,
        }
        const response = await this.$store.dispatch(
          "classes/getClassesByConditins",
          query
        );
        console.log('get classes : ' ,response.results)
        this.items = response.results
        },
      async updateTeacherInClasses(data) {
        console.log('this data teacher', data)
        const response = await this.$store.dispatch(
          "classes/updateClasses",
          data
        );
        console.log('response', response.results)
      },
      getOldClass(){
        var data = {
          schoolYear: '2563',
          term: '1'
        }
        this.getClasses(data)
      },
      async updateTeacher() {
        this.items.forEach(async item => {
          var data = {
            objectId: item.objectId,
            advisoryTeacher: {
              teacher1: item.teatherName.teather1,  
              teacher2: item.teatherName.teather2  
            } 
          }
          console.log('teacher : ', data)
          // await this.updateTeacherInClasses(data)
        })
      },
      async updateTeacherNextTerm(){
        //get classes
        var data = {
          schoolYear: '2563',
          term: '2' 
        }
        var newClass = this.getClasses(data)
        
      } 
    }
  }
</script>