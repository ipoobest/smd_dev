<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
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
            @click:row="addStudent"
            @pagination="handlePagination"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
            <v-col class="d-flex" cols="4">
              <v-select
                :items="years"
                label="ปีการศึกษา"
                dense
                outlined
              ></v-select>
            </v-col>                
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
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.schoolYear"
                              outlined
                              label="ปีการศึกษา"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.classRoomId"
                              outlined
                              label="รหัสห้อง"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.classRoomName"
                              outlined
                              label="ชื่อห้อง"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.teatherId"
                              outlined
                              label="อาจารย์ประจำชั้น"
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
            <!-- <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template> -->
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'ปีการศึกษา', value: 'schoolYear' },
        { text: 'รหัสห้อง', value: 'classRoomId'},
        { text: 'ห้องเรียน', value: 'classRoomName' },
        { text: 'อาจารย์ประจำชั้น', value: 'teatherId' }
        // { text: 'Actions', value: 'actions', sortable: false }
      ],
      id: '',
      items: [],
      search: ``,
      title: `ชั้นเรียน`,
      editedIndex: -1,
      editedItem: {
        schoolYear: '',
        classRoomId: '',
        classRoomName: '',
        studentId: [],
        teatherId: ''
      },
      years: []
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'สร้างห้องใหม่' : 'แก้ไข'
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  mounted(){
    this.id = this.$route.params.id
    console.log('id', this.id)
    this.getDataFromApi().then((result) => (this.items = result))
  },
  methods: {
    async getDataFromApi(limit = 50, skip = 0) {
      // const response = await ClassesApi.get(limit, skip)
      const response = await this.$store.dispatch(`classes/getClasses`, this.id)
      // console.log('res ', response.data.results)
      this.items = response.data.results
    },
    async createClasses(data) {
      console.log('create Classes ', data)
      const response = await ClassesApi.create(data)
      console.log('res create', response)
    },
    async updateClasses(data) {
      console.log('data update ', data)
      const response = await ClassesApi.update(data)
      console.log('res ', response)
    },
    async deteleClasses(itemId) {
      console.log('delete update ', itemId)
      const response = await ClassesApi.deleteClasses(itemId)
      console.log('res ', response)
    },
    async handlePagination(e) {
      if (e.page === e.pageCount) {
        const result = await this.getDataFromApi(50, e.itemsLength)

        if (result) {
          this.items = [...this.items, ...result]
        }
      }
    },

    editItem(item) {
      console.log('item id ', item)
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.dialog = true
    },
    deleteItem(item) {
      const index = this.items.indexOf(item)
      confirm('ยืนยีนการลบบัญชีผู้ใช้')
      this.deteleClasses(item.objectId)
      this.items.splice(index, 1)
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
          ClassesId: this.editedItem.ClassesId,
          ClassesPosition: this.editedItem.ClassesPosition,
          title: this.editedItem.title,
          firstName: this.editedItem.firstName,
          lastName: this.editedItem.lastName
        }
        this.updateClasses(editData)
      } else {
        this.createClasses(this.editedItem)
        this.items.push(this.editedItem)
      }
      this.close()
    },
    addStudent(item) {
      console.log('item id ', item)
      this.$router.push({
        name: 'classes-id',
        params: { id: item.objectId }
      })
    }
  }
}
</script>
