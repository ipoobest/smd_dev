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
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :items="items" :search="search" :headers="headers">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <h4>ข้อมูลผู้ใช้</h4>
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
                            <v-col cols="12" sm="4" md="4">
                              <v-text-field
                                v-model="editedItem.username"
                                outlined
                                label="username"
                                required
                                :rules="[(v) => !!v || 'กรุณากรอก username']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                              <v-text-field
                                v-model="editedItem.password"
                                outlined
                                type="password"
                                label="password"
                                required
                                :rules="[(v) => !!v || 'กรุณากรอก password']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                              <v-text-field
                                v-model="editedItem.rePassword"
                                outlined
                                type="password"
                                label="re-password"
                                required
                                :rules="[
                                  (v) => !!v || 'กรุณากรอก password อีกครั้ง',
                                ]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.id"
                                outlined
                                label="รหัสประจำตัว"
                                required
                                :rules="[(v) => !!v || 'กรุณากรอกรหัสประจำตัว']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="editedItem.position"
                                :items="selectItemPosition"
                                outlined
                                label="ตำแหน่ง"
                                required
                                :rules="[(v) => !!v || 'กรุณากรอกตำแหน่ง']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="editedItem.title"
                                :items="selectItemTitle"
                                outlined
                                label="คำนำหน้า"
                                required
                                :rules="[(v) => !!v || 'กรุณากรอกคำนำหน้า']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.firstName"
                                outlined
                                label="ชื่อ"
                                required
                                :rules="[(v) => !!v || 'กรุณากรอกชื่อ']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.lastName"
                                outlined
                                label="นามสกุล"
                                required
                                :rules="[(v) => !!v || 'กรุณากรอกนามสกุล']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="editedItem.type"
                                :items="selectItemUserType"
                                outlined
                                label="ประเภทผู้ใช้งาน"
                                required
                                :rules="[
                                  (v) => !!v || 'กรุณาเลือกประเภทผู้ใช้งาน',
                                ]"
                              ></v-select>
                            </v-col>
                            <v-col
                              v-if="editedItem.type == `หัวหน้ากลุ่มสาระ`"
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-select
                                v-model="editedItem.staffType"
                                :items="selectItemStaffType"
                                outlined
                                label="หัวหน้ากลุ่มสาระวิชา"
                                required
                                :rules="[
                                  (v) =>
                                    !!v ||
                                    'กรุณาเลือกประเภทหัวหน้ากลุ่มสาระวิชา',
                                ]"
                              ></v-select>
                            </v-col>
                            <v-col
                              v-if="editedItem.type == `หัวหน้ากลุ่มสาระ`"
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-select
                                v-model="editedItem.classes"
                                :items="selectItemClasses"
                                outlined
                                label="ระดับชั้น"
                                required
                                :rules="[(v) => !!v || 'กรุณาเลือกระดับชั้น']"
                              ></v-select>
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
                      <v-btn class="success" text @click="save">บันทึก</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.userName`]="{ item }"
              >{{ item.title }} {{ item.firstName }}
              {{ item.lastName }}</template
            >
            <template v-slot:[`item.userType`]="{ item }">
              {{ item.type }} {{ item.staffType }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="info" @click="editItem(item)"> แก้ไข </v-btn>
              <v-btn color="error" @click="deleteItem(item)"> ลบ </v-btn>
            </template>
            <!-- <thead>
              <tr>
                <th>หมายเลขประจำตัว</th>
                <th>ตำแหน่ง</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>ประเภทผู้ใช้งาน</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <th>{{ item.userId }}</th>
                <th>{{ item.position }}</th>
                <th>{{ item.title }}</th>
                <th>{{ item.firstName }}</th>
                <th>{{ item.lastName }}</th>
                <th v-if="item.type == 'หัวหน้ากลุ่มสาระ'">
                  {{ item.type }} {{ item.staffType }}
                </th>
                <th v-else>{{ item.type }}</th>
                <th>
                  <v-btn class="mr-2 info" @click="editItem(item)">
                    แก้ไข
                  </v-btn>
                  <v-btn class="error" @click="deleteItem(item)"> ลบ </v-btn>
                </th>
              </tr>
            </tbody> -->
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  middleware: "admin",
  mounted() {
    // get user not in type student
    this.getDataFromApi().then((result) => (this.items = result));
    this.getDepartment().then((result) => (this.selectItemStaffType = result));
  },
  data() {
    return {
      headers: [
        { text: "หมายเลขประจำตัว", value: "userId" },
        { text: "ตำแหน่ง", value: "position" },
        { text: "ชื่อ-นามสกุล", value: "userName" },
        { text: "ประเภทผู้ใช้งาน", value: "userType" },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
      dialog: false,
      submitted: false,
      user: "",
      items: [],
      search: ``,
      title: `การจัดการผู้ใช้`,
      desserts: [],
      editedIndex: -1,
      editedItem: {
        username: "",
        password: "",
        rePassword: "",
        id: "",
        position: "",
        title: "",
        firstName: "",
        lastName: "",
        type: "",
        staffType: "",
        // type: 'teacher'
      },
      selectItemPosition: [
        "ครูอัตราจ้าง",
        "ครูผู้ช่วย",
        "อาจารย์",
        "ครู ค.ศ 1",
        "ครูชำนาญการ",
        "ครูชำนาญการพิเศษ",
        "ครูเชี่ยวชาญ",
        "ครูเชียวชาญพิเศษ",
        "ผู้ช่วยศาสตราจารย์",
        "รองสาสตราจารย์",
        "ศาสตราจารย์",
        "ศาสตราจารย์เกียรติคุณ",
        "ผู้ช่วยศาสตราจารย์",
        "รองสาสตราจารย์",
        "ศาสตราจารย์",
      ],
      selectItemTitle: ["ดร.", "อาจารย์", "นาย", "นาง", "นางสาว"],
      selectItemUserType: [
        "ครู",
        "หัวหน้ากลุ่มสาระ",
        "หัวหน้ากลุ่มประเมิน",
        "กลุ่มงานทะเบียน",
      ],
      selectItemStaffType: [],
      selectItemClasses: [
        { text: "ม.ต้น", value: ["ม.1", "ม.2", "ม.3"] },
        { text: "ม.ปลาย", value: ["ม.4", "ม.5", "ม.6"] },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "สร้าง" : "แก้ไข";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    async getDataFromApi() {
      const conditions = {
        type: {
          $ne: "นักเรียน",
        },
      };
      const response = await this.$store.dispatch(
        `users/getUserByConditions`,
        conditions
      );
      //
      return response.results;
    },
    async getDepartment() {
      const response = await this.$store.dispatch(`department/getDepartment`);
      var data = this.mapDepartments(response.results);
      return data;
    },
    async getUserById(id) {
      //
      const response = await this.$store.dispatch(`users/getUserById`, id);
      return response;
    },
    async createUser(data) {
      const response = await this.$store.dispatch(`users/createUser`, data);
      this.getDataFromApi().then((result) => (this.items = result));
    },
    async checkUser(username) {
      const condition = {
        username,
      };
      const user = await this.$store.dispatch(
        `users/getUserByConditions`,
        condition
      );
      if (user.results.length != 0) {
        return false;
      } else {
        return true;
      }
    },
    async updateUser(data) {
      const user = {
        username: data.username,
        password: data.password,
        objectId: data.userId,
      };
      const response = await this.$store.dispatch(`users/updateUser`, data);
      this.getDataFromApi().then((result) => (this.items = result));
    },
    async deleteUser(itemId) {
      const response = await this.$store.dispatch(`users/deleteUser`, itemId);
    },
    editItem(item) {
      this.user = item;
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItem(item) {
      const index = this.items.indexOf(item);
      //
      if (confirm("ยืนยีนการลบข้อมูล")) {
        await this.deleteUser(item.objectId);
        this.items.splice(index, 1);
      }
    },
    async save() {
      if (this.editedItem.password != this.editedItem.rePassword) {
        alert("password และ re-password ไม่ตรงกัน");
        return;
      }
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
        //
        const userId = await this.getUserById(this.user.objectId);
        //
        const objectId = userId.objectId;
        //

        const editData = {
          objectId: this.editedItem.objectId,
          id: this.editedItem.id,
          position: this.editedItem.position,
          title: this.editedItem.title,
          firstName: this.editedItem.firstName,
          lastName: this.editedItem.lastName,
          username: this.editedItem.username,
          password: this.editedItem.password,
          type: this.editedItem.type,
          staffType: this.editedItem.staffType,
          classes: this.editedItem.classes,
          objectId: objectId,
        };

        //
        this.updateUser(editData);
        this.close();
      } else {
        if (this.$refs.form.validate()) {
          const user = await this.checkUser(this.editedItem.username);
          //
          if (user) {
            const user = {
              userId: this.editedItem.id,
              position: this.editedItem.position,
              title: this.editedItem.title,
              firstName: this.editedItem.firstName,
              lastName: this.editedItem.lastName,
              username: this.editedItem.username,
              password: this.editedItem.password,
              type: this.editedItem.type,
              staffType: this.editedItem.staffType,
              classes: this.editedItem.classes,
            };
            //
            this.createUser(user);
            this.editedItem = {};
            this.close();
          } else {
            alert("username นี้ถูกใช้แล้วกรุณาเปลี่ยน username");
          }
        }
      }
    },
    mapDepartments(item) {
      var items = [];
      item.forEach((item) => {
        items.push(item.name);
      });

      return items;
    },
    resetForm() {
      this.$refs.form.reset();
    },
    back() {
      this.$router.push({ name: "index" });
    },
    close() {
      this.dialog = false;
      this.resetForm();
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
};
</script>
