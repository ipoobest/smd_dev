<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
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
          <v-simple-table>
            <template v-slot:top>
              <v-toolbar flat color="white">
                <h4>รายชื่อวิชา</h4>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="700px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="success"
                      dark
                      class="mb-2"
                      v-on="on"
                      @click="input_warning = false"
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
                                v-model="input.code"
                                outlined
                                label="รหัสวิชา"
                                required
                                :rules="[
                                  v => !!v || 'กรุณากรอกข้อมูล รหัสวิชา'
                                ]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="input.codet"
                                outlined
                                label="รหัสวิชาภาษาไทย"
                                required
                                :rules="[
                                  v => !!v || 'กรุณากรอกข้อมูล รหัสวิชาภาษาไทย'
                                ]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="input.sname"
                                outlined
                                label="ชื่อวิชา"
                                required
                                :rules="[
                                  v => !!v || 'กรุณากรอกข้อมูล ชื่อวิชา'
                                ]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="input.credit"
                                outlined
                                label="หน่วยกิต"
                                required
                                :rules="[
                                  v => !!v || 'กรุณากรอกข้อมูล หน่วยกิจ'
                                ]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="input.hour"
                                outlined
                                label="จำนวนชั่วโมงที่สอน"
                                required
                                :rules="[
                                  v =>
                                    !!v || 'กรุณากรอกข้อมูล จำนวนชั่วโมงที่สอน'
                                ]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="input.type"
                                :items="typeSubjects"
                                outlined
                                label="ประเภทวิชา"
                                required
                                :rules="[
                                  v => !!v || 'กรุณาเลือกข้อมูล ประเภทวิชา'
                                ]"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="input.department"
                                :items="department"
                                outlined
                                label="กลุ่มสาระวิชา"
                                required
                                :rules="[
                                  v => !!v || 'กรุณาเลือกข้อมูล กลุ่มสาระวิชา'
                                ]"
                              ></v-select>
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
                      <v-btn class="success" text @click="save">บันทึก</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template>
              <thead>
                <tr>
                  <th>รหัสวิชา</th>
                  <th>รหัสวิชาภาษาไทย</th>
                  <th>ชื่อวิชา</th>
                  <th>หน่วยกิต</th>
                  <th>จำนวนชั่วโมงที่สอน</th>
                  <th>ประเภทวิชา</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <th>{{ item.code }}</th>
                  <th>{{ item.codet }}</th>
                  <th>{{ item.sname }}</th>
                  <th>{{ item.credit }}</th>
                  <th>{{ item.hour }}</th>
                  <th>{{ item.type }}</th>
                  <th>
                    <v-btn small class="mr-2 info" @click="editItem(item)">
                      แก้ไข
                    </v-btn>
                    <v-btn class="error" small @click="deleteItem(item)">
                      ลบ
                    </v-btn>
                  </th>
                </tr>
              </tbody>
            </template>
            <template v-slot:no-input>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
          </v-simple-table>
        </v-card>
        <v-divider class="mt-5"></v-divider>
      </v-col>
      <v-col cols="5">
        <v-card>
          <v-simple-table>
            <template v-slot:top>
              <v-toolbar flat color="white">
                <h4>กลุ่มสาระการเรียนรู้</h4>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog_department" max-width="350px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="success"
                      dark
                      class="mb-2"
                      v-on="on"
                      @click="input_warning = false"
                      >เพิ่ม</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitleDepartment }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="form" validation>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="departmant"
                                outlined
                                label="กลุ่มสาระการเรียนรู้"
                                required
                                :rules="[v => !!v || 'กลุ่มสาระการเรียนรู้']"
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
                      <v-btn class="success" text @click="saveDepartments"
                        >บันทึก</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>กลุ่มสาระ</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, items) in items_depart" :key="items.index">
                  <th>{{ items + 1 }}</th>
                  <th>{{ item.name }}</th>
                  <th>
                    <!-- <v-btn small class="mr-2 info" @click="editItem(item)">
                      แก้ไข
                    </v-btn> -->
                    <v-btn class="error" small @click="deleteDepartment(item)">
                      ลบ
                    </v-btn>
                  </th>
                </tr>
              </tbody>
            </template>
            <template v-slot:no-input>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  // middleware: 'authentication',
  middleware: "admin",
  data() {
    return {
      formTitleDepartment: "สร้างกลุ่มสาระการเรียนรู้",
      dialog: false,
      dialog_department: false,
      input_warning: false,
      editedIndex: -1,
      items: [],
      items_depart: [],
      search: ``,
      title: `วิชา`,
      departmant: '',
      input: {
        code: "",
        codet: "",
        sname: "",
        credit: "",
        hour: "",
        type: ""
      },
      typeSubjects: ["วิชาบังคับ", "วิชาเลือก"],
      department: []
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "สร้างวิชา" : "แก้ไขวิชา";
    }
  },
  mounted() {
    this.getinputFromApi().then(result => (this.items = result));
    this.getDepartment().then(result=> (this.items_depart = result))
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    async getinputFromApi() {
      const response = await this.$store.dispatch(`subjects/getSubjects`);
      console.log('subject ', response)
      return response.results;
    },
    async createSubject(input) {
      const response = await this.$store.dispatch(
        `subjects/createSubject`,
        input
      );
      this.getinputFromApi().then(result => (this.items = result));
      // this.items = [...this.items, input]
    },
     async getDepartment() {
       const response = await this.$store.dispatch(
        `department/getDepartment`
      );
      this.department = this.mapDepartment(response.results)
      var item = this.sortDepartment(response.results)
      return item
    },
    async createDepartment() {
      const data = {
        name: this.departmant
      }
       const response = await this.$store.dispatch(
        `department/createDepartment`,
        data
      );
      this.getDepartment().then(result=> (this.items_depart = result))
    },
    async updateDepartment(id) {
      const data = {
        objectId: id,
        name: this.departmant
      }
       const response = await this.$store.dispatch(
        `department/updateDepartment`,
        data
      );
    },
    async updateSubject(input) {
      const response = await this.$store.dispatch(
        `subjects/updateSubject`,
        input
      );
      // console.log('updateSubject ', response)
      this.getinputFromApi().then(result => (this.items = result));
    },
    async deleteSubject(input) {
      const response = await this.$store.dispatch(
        `subjects/deleteSubject`,
        input
      );
    },
    async deleteDepartments(id) {
      const response = await this.$store.dispatch(
        `department/deleteDepartment`,
        id
      );
      this.getDepartment().then(result=> (this.items_depart = result))
    },
    addClasses(item) {
      this.$router.push({
        name: "subjects-id",
        params: { id: `${item.objectId}` }
      });
    },
    initialize() {
      this.getinputFromApi().then(result => (this.items = result));
    },
    sortDepartment(item) {
      return item.sort((a,b) => a.number - b.number)
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.input = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.items.indexOf(item);
      if (confirm("ยืนยีนการลบบัญชีผู้ใช้")) {
        this.deleteSubject(item.objectId);
        this.items.splice(index, 1);
      }
    },
    back() {
      this.$router.push({ name: "index" });
    },
    resetForm() {
      this.$refs.form.reset();
    },
    close() {
      this.dialog = false;
      this.dialog_department = false
      this.resetForm();
      setTimeout(() => {
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.input);
        console.log("put input user ", this.items);
        // this.items = [...this.input, input]
        const editinput = {
          objectId: this.input.objectId,
          code: this.input.code,
          codet: this.input.codet,
          sname: this.input.sname,
          credit: this.input.credit,
          hour: this.input.hour,
          type: this.input.type,
          department: this.input.department
        };
        this.updateSubject(editinput);
        this.close();
      } else {
        if (this.$refs.form.validate()) {
          const data = {
            // objectId: this.input.objectId,
            code: this.input.code,
            codet: this.input.codet,
            sname: this.input.sname,
            credit: this.input.credit,
            hour: this.input.hour,
            type: this.input.type,
            department: this.input.department
          };
          // console.log("input create", data);
          this.createSubject(data);
          this.items.push(data);
          this.close();
        }
      }
    },
    saveDepartments() {
      if (this.editedIndex > -1) {
        // update
        this.updateDepartment()
        this.close();
      } else {
        // create
        this.createDepartment()
        this.close();
      }
    },
    deleteDepartment(item){
      if(confirm('ยืนยันการลบ')) {
        console.log('delete item', item.objectId)
        this.deleteDepartments(item.objectId)
      }

    },
    mapDepartment(item) {
      var department = []
      item.forEach(item => {
        department.push(item.name)
      })
      // console.log('item deprt', department)
      return department
    }
  }
};
</script>
