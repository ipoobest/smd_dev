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
                            <v-text-field
                              v-model="editedItem.teacherPosition"
                              outlined
                              label="ตำแหน่ง"
                              required
                              :rules="[v => !!v || 'กรุณากรอกตำแหน่ง']"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.teacherTitle"
                              outlined
                              label="คำนำหน้า"
                              required
                              :rules="[v => !!v || 'กรุณากรอกคำนำหน้า']"
                            ></v-text-field>
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
                        >Cancel</v-btn
                      >
                      <v-btn color="blue darken-1" text @click="save"
                        >Save</v-btn
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
              <v-btn class="error" @click="editItemDialog = true" >
                ลบ
              </v-btn>
              <v-dialog
                v-model="editItemDialog"
                max-width="290"
              >
                <v-card>
                  <v-card-title class="headline">ยืนยันการลบ</v-card-title>
                  <v-card-text>
                   ยืนยันการลบ
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      class="info"
                      text
                      @click="editItemDialog = false"
                    >
                      ยกเลิก
                    </v-btn>
                    <v-btn
                      class="error"
                      text
                      @click="deleteItem(item)">
                      ยืนยัน
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>              
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
// import { validationMixin } from 'vuelidate'
// import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {
  middleware: 'authentication',
  data() {
    return {
      dialog: false,
      submitted: false,
      editItemDialog: false,
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
      }
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
      console.log('create user teacher', data)
      const response = await this.$store.dispatch(`users/createUser`, data)
      if(response){
        console.log('error create user', response)
      }
      console.log('create result', response)
    },
    async createTeacher(data) {
      console.log('create teacher ', data)
      const response = await this.$store.dispatch(`teachers/createTeacher`, data)
      console.log('res create', response)
      this.createUser(data)
    },
    async updateTeacher(data) {
      console.log('data update ', data)
      // const response = await TeachersApi.update(data)
      const response = await this.$store.dispatch(`teachers/updateTeacher`, data)
      console.log('res ', response)
      return
    },
    async deleteTeacher(itemId) {
      console.log('delete update ', itemId)
      const response = await this.$store.dispatch(`teachers/deleteTeacher`, itemId)
      console.log('res ', response)
      return
    },
    editItem(item) {
      console.log('item id ', item)
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.dialog = true
    },
    deleteItem(item) {

    const index = this.items.indexOf(item)
    // this.deleteTeacher(item.objectId)
        //delete user ด้วย
    this.items.splice(index, 1)
    this.editItemDialog = false
    },
    back() {
      this.$router.push({name: 'index'})
    },
    close() {
      console.log('closd')
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
        console.log('put xx ', this.editedItem)
        const editData = {
          objectId: this.editedItem.objectId,
          teacherId: this.editedItem.teacherId,
          teacherPosition: this.editedItem.teacherPosition,
          title: this.editedItem.teacherTitle,
          firstName: this.editedItem.firstName,
          lastName: this.editedItem.lastName
        }
        this.updateTeacher(editData)
      } else {
        if(this.$refs.form.validate()){
          this.createTeacher(this.editedItem)
          this.items.push(this.editedItem)
          this.editedItem = {}
          this.close()
        }
        //  alert('กรุณากรอกข้อมูลให้ครบทุกช่อง')
      }
      // this.close()
    }
  }
}
</script>
