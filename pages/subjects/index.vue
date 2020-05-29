<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ title }}
            <v-spacer> </v-spacer>
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
                <v-dialog v-model="dialog" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on"
                      >เพิ่ม</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">สร้าง/แก้ไข</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="datas.code"
                              outlined
                              label="รหัสวิชา"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="datas.codet"
                              outlined
                              label="รหัสวิชาภาษาไทย"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="datas.sname"
                              outlined
                              label="ชื่อวิชา"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="datas.credit"
                              outlined
                              label="หน่วยกิต"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="datas.hour"
                              outlined
                              label="จำนวนชั่วโมงที่สอน"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <!-- <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close"
                        >Cancel</v-btn
                      >
                      <v-btn color="blue darken-1" text @click="save"
                        >Save</v-btn
                      >
                    </v-card-actions> -->
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn color="success" @click="addClasses(item)">
                เพิ่มห้องเรียน
              </v-btn>
              <v-btn small class="mr-2" @click="editItem(item)">
                แก้ไข
              </v-btn>
              <v-btn small @click="deleteItem(item)">
                ลบ
              </v-btn>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import * as SubjectApi from '@/utils/subjects'
export default {
  // middleware: 'authentication',
  data() {
    return {
      dialog: false,
      editedIndex: -1,
      headers: [
        { text: 'รหัสวิชา', value: 'code' },
        { text: 'รหัสวิชาภาษาไทย', value: 'codet' },
        { text: 'ชื่อวิชา', value: 'sname' },
        { text: 'หน่วยกิต', value: 'credit' },
        // { text: 'จำนวนชั่วโมงที่สอน', value: 'hour' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      items: [],
      search: ``,
      title: `วิชา`,
      datas: {
        code: '',
        codet: '',
        sname: '',
        credit: '',
        hour: ''
      }
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'สร้างวิชา' : 'แก้ไขวิชา'
    }
  },
  mounted(){
    this.getdataFromApi().then(result => (this.items = result))
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  methods: {
    async getdataFromApi(limit = 50, skip = 0) {
    const variable = await this.$store.dispatch(`subjects/getSubjects`)
    console.log('variable', variable)
    return variable.results
    },
    async createSubject(data) {
      const variable = await this.$store.dispatch(`subjects/createSubject`, data)
      console.log('createSubject ', variable)
    },
    async updateSubject(data) {
      console.log('data put subjest ', data.objectId)
      const response = await this.$store.dispatch(`subjects/updateSubject`, data)
      console.log('updateSubject ', response)
    },
    async deleteSubject(data) {
      console.log('object id', data)
      const response = await this.$store.dispatch(`subjects/deleteSubject`, data)
      console.log('deleteSubject ', response)
    },
    addClasses(item){
      this.$router.push({name: 'subjects-id', params: { id: `${item.objectId}`}})
    },
    initialize() {
      console.log('initialize')
    },
    editItem(item) {
      console.log('item id ', item)
      this.editedIndex = this.items.indexOf(item)
      this.datas = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      const index = this.items.indexOf(item)
      confirm('ยืนยีนการลบบัญชีผู้ใช้') && this.deleteSubject(item.objectId) 
      this.items.splice(index, 1)
    },
    close() {
      console.log('closd')
      this.dialog = false
      setTimeout(() => {
        this.editedIndex = -1
      }, 300)
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.datas)
        console.log('put xx ', this.items)
        const editdatas = {
          objectId: this.datas.objectId,
          code: this.datas.code,
          codet: this.datas.codet,
          sname: this.datas.sname,
          credit: this.datas.credit,
          hour: this.datas.hour,
        }
        this.updateSubject(editdatas)
      } else {
        this.createSubject(this.datas)
        this.items.push(this.datas)
      }
      this.close()
    },
  }
}
</script>
