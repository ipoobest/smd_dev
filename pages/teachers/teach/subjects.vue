<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back" >
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>  
            {{ title }} ของปีการศีกษา {{params.schoolYear }} เทอม {{ params.term }}
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
         
            <template v-slot:item.actions="{ item }">
              <!-- <v-btn color="info" @click="addClasses(item)">
                แก้ไข
              </v-btn> -->
              <!-- <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon> -->
              <v-btn color="info"  @click="addScore(item)">
                เกณฑ์การให้คะแนน
              </v-btn>
              <v-btn color="success"  @click="addScore(item)">
                เพิ่มคะแนน
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
    layout: 'teacher',
    mounted () {
      this.params = this.$route.params
      this.teachObjectId = this.$store.state.auth.auth.teacherObjectId
      // conslode.log('route params', this.$route.query)
      console.log(this.teachObjectId)
      this.getTeachByTeacherId(this.teachObjectId).then(result => (this.items = result))
    },
    data() {
      return {
        title: '',
        search: '',
        params: '',
        teachObjectId: '',
        dialogCreateTeach: 'false',

        headers: [
          { text: 'รหัส/ชื่อวิขา', value: 'sname', align:'center' },
          { text: 'ระดับชั้น', value: 'classRoomLevel', align:'center'},
          { text: 'ห้องเรียน', value: 'classRoomName', align:'center'},
          { text: 'ครูผู้สอน', value: 'teacher.name', align:'center' },
          { text: 'Actions', value: 'actions', sortable: false, align:'center'}
        ],
        items: [],
      }
    },
    methods: {
      async getTeachByTeacherId (teacherId) {
       const data = {
           'schoolYear': this.$route.params.schoolYear,
           'term': this.$route.params.term,
           'teacher.value': teacherId
        }
        const response = await this.$store.dispatch(`teach/getTeachByTeacherId`, data )
        console.log('response', response)
        return response.results
      },
      addScore(item) {
        console.log('add score', item)
      },
      back() {
        this.$router.go(-1)
        console.log('back')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>