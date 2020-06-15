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
                <v-dialog v-model="dialog" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on"
                      >เพิ่ม</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="form" validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.username"
                              outlined
                              label="username"
                              required
                              :rules="[v => !!v || 'กรุณากรอก username']"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.password"
                              outlined
                              type="password"
                              label="password"
                              required
                              :rules="[v => !!v || 'กรุณากรอก password']"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.teacherId"
                              outlined
                              label="รหัสประจำตัว"
                              required
                              :rules="[v => !!v || 'กรุณากรอกรหัสประจำตัว']"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="editedItem.teacherPosition"
                              :items="selectItemPosition"
                              outlined
                              label="ตำแหน่ง"
                              required
                              :rules="[v => !!v || 'กรุณากรอกตำแหน่ง']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="editedItem.teacherTitle"
                              :items="selectItemTitle"
                              outlined
                              label="คำนำหน้า"
                              required
                              :rules="[v => !!v || 'กรุณากรอกคำนำหน้า']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.firstName"
                              outlined
                              label="ชื่อ"
                              required
                              :rules="[v => !!v || 'กรุณากรอกชื่อ']"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.lastName"
                              outlined
                              label="นามสกุล"
                              required
                              :rules="[v => !!v || 'กรุณากรอกนามสกุล']"
                            ></v-text-field>
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
                      <v-btn class="success" text @click="save"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn  class="mr-2 info" @click="editItem(item)">
                แก้ไข
              </v-btn>
              <v-btn class="error" @click="deleteItem(item)" >
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
  data() {
    return {
      dialog: false,
      submitted: false,
      headers: [
        {
          text: 'หมายเลขประจำตัว',
          value: 'teacherId'
        },
        { text: 'ตำแหน่ง', value: 'teacherPosition' },
        { text: 'คำนำหน้า', value: 'teacherTitle' },
        { text: 'ชื่อ', value: 'firstName' },
        { text: 'นามสกุล', value: 'lastName' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      items: [],
      search: ``,
      title: `ครู`,
      desserts: [],
      editedIndex: -1,
      editedItem: {
        username: '',
        password: '',
        teacherId: '',
        teacherPosition: '',
        teacherTitle: '',
        firstName: '',
        lastName: '',
        type: 'teacher'
      },
      selectItemPosition: [
        'ครูอัตราจ้าง' ,
        'ครูผู้ช่วย',
        'ครู ค.ศ 1' ,
        'ครูชำนาญการ' ,
        'ครูชำนาญการพิเศษ' ,
        'ครูเชี่ยวชาญ' ,
        'ครูเชียวชาญพิเศษ' ,
        'ผู้ช่วยศาสตราจารย์', 
        'รองสาสตราจารย์' ,
        'ศาสตราจารย์' ,
        'ศาสตราจารย์เกียรติคุณ' ,
        'ผู้ช่วยศาสตราจารย์' ,
        'รองสาสตราจารย์' ,
        'ศาสตราจารย์' 
      ],
      selectItemTitle:[
        'ดร.',
        'นาย',
        'นาง',
        'นางสาว'
      ]
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'สร้าง' : 'แก้ไข'
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  mounted() {
    this.getDataFromApi().then((result) => (this.items = result))
  },
  methods: {
    async getDataFromApi() {
      const response = await this.$store.dispatch(`teachers/getTeacher`)
      console.log('teacher response', response)
      return response.results

    },
    async createUser(data){
      console.log('create user teacher', data.username, data.password)
      const user = {
        username: data.username,
        password: data.password,
        type: 'teacher',
        teacherId: data.teacherId
      }
      // const response = await this.$store.dispatch(`users/createUser`, user)
      console.log('create result', response)
    },
    async createTeacher(data) {
      const response = await this.$store.dispatch(`teachers/createTeacher`, data)
      console.log('res create teacher', response)
      this.getDataFromApi().then((result) => (this.items = result))
    },
    async updateTeacher(data) {
      const response = await this.$store.dispatch(`teachers/updateTeacher`, data)
     this.getDataFromApi().then((result) => (this.items = result))
    },
    async deleteTeacher(itemId) {
      const response = await this.$store.dispatch(`teachers/deleteTeacher`, itemId)
    },
    editItem(item) {
      console.log('item id ', item)
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.dialog = true
    },
    deleteItem(item) {

    const index = this.items.indexOf(item)
        //delete user ด้วย
      if (confirm('ยืนยีนการลบข้อมูลครู')) {
        this.deleteTeacher(item.objectId)
        this.items.splice(index, 1)   
      }
    },
    resetForm () {
      this.$refs.form.reset()
    },
    back() {
      this.$router.push({name: 'index'})
    },
    close() {
      this.dialog = false
      this.resetForm()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
        const editData = {
          objectId: this.editedItem.objectId,
          teacherId: this.editedItem.teacherId,
          teacherPosition: this.editedItem.teacherPosition,
          title: this.editedItem.teacherTitle,
          firstName: this.editedItem.firstName,
          lastName: this.editedItem.lastName
        }
        this.updateTeacher(editData)
        this.close()
      } else {
        if(this.$refs.form.validate()){
          this.createTeacher(this.editedItem)
          this.editedItem = {}
          this.close()
        }
      }
    }
  }
}
</script>
