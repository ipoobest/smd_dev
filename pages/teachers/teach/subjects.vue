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
            :search="search"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="form" validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4" align-self="center">
                            <h3>การเก็บคะแนน</h3>
                          </v-col>
                          <v-col cols="12" sm="6" md="3" align-self="center">
                            <v-text-field
                              v-model="part_num"
                              type="number"
                              required
                              :rules="[v => !!v || 'กรุณากรอก จำนวนการเก็บคะแนน']"
                            />
                          </v-col>
                          <v-col cols="12" sm="6" md="2" align-self="center">
                            <h3>ส่วน</h3>
                          </v-col>
                          <v-col cols="12" sm="6" md="2" align-self="center">
                            <v-btn class="info" @click="addPartNumber">ตกลง</v-btn>
                          </v-col>
                        </v-row>
                        <v-row>
                            <div v-for="item in part_point" :key="item">
                              <!-- {{ item.sname }} -->
                              <v-col cols="12" align-self="center">
                                <v-text-field
                                  v-model="part_rating[item]"
                                  outlined
                                  type="number"
                                />
                              </v-col>
                            </div>
                          <!-- <div v-for="index in part_point" :key="index">
                            <v-col cols="12" sm="6" md="4" >
                              <v-text-field
                                outlined
                                v-model="part_point[index]"
                                required
                                label="%"
                              />
                            </v-col>
                          </div> -->
                        </v-row>
                      </v-container>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close"
                        >ยกเลิก</v-btn
                      >
                      <v-btn class="success" text @click="save"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn  class="info" @click="addRating(item)">
                เกณฑ์การให้คะแนน
              </v-btn>
              <v-btn class="success" @click="addScore(item)" >
                ให้คะแนน
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
      this.teacherId = this.$store.state.auth.auth.teacherObjectId
      // conslode.log('route params', this.$route.query)
      console.log(this.teacherId)
      this.getTeachByTeacherId(this.teacherId).then(result => (this.items = result))
    },
    watch: {
      dialog(val) {
        val || this.close()
      }  
    },
    data() {
      return {
        dialog: false,
        formTitle: 'เกณฑ์การให้คะแนน',
        title: '',
        search: '',
        params: '',
        teacherId: '',
        teachId: '',
        dialogCreateTeach: 'false',
        part_num: '',
        part_point: [],
        part_rating: [],
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
      addPartNumber() {
        console.log('add part', this.part_num)
        // this.part_point = new Array(this.part_num)
        // console.log('part_point', this.part_point)
        this.part_point = []
        for (var index = 0; index < this.part_num; index++) {
          this.part_point.push(index)
        }
        console.log('length', this.part_point)
      },
      addRating(item) {
        this.dialog = true
        this.teachId = item.objectId
        console.log('add raing', this.teachId)
      },
      addScore(item) {
        // console.log('add score', item)
        this.$router.push({name: 'teachers-teach-add_score', params: {data: item}})
      },
      save() {
        // console.log('data model', this.part_rating)
        var result = this.part_rating.map(Number)
        // console.log('result', result.length)
        var sum = 0
        for (var index = 0; index < result.length; index++ ) {
          sum += result[index]
          // console.log('sum xx', result[index])
        }
        // console.log('sum xxxxx', sum)
        if ( sum != 100) {
          alert('กรุณาทำให้ผลรวม = 100')
        }
        console.log('item ob', this.teacherId, result)

      },
      close() {
        this.dialog = false
        // this.resetForm()
        setTimeout(() => {
        }, 300)
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