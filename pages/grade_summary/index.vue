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
          </v-card-title>
          <v-simple-table>
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-row justify="center">
                  <v-form ref="form" validation>
                    <v-container>
                      <v-row>
                        <v-col
                          ><v-text-field
                            v-model="schoolYear"
                            label="ปีการศึกษา"
                            dense
                            outlined
                            required
                            :rules="[(v) => !!v || 'กรุณาเลือกปีการศึกษา']"
                          ></v-text-field
                        ></v-col>
                        <v-col
                          ><v-select
                            v-model="classRoomLevel"
                            label="ระดับชั้น"
                            :items="itemClassRoom"
                            dense
                            outlined
                            required
                            @change="getClasses()"
                            :rules="[(v) => !!v || 'ระดับชั้น']"
                          ></v-select
                        ></v-col>
                        <v-col><v-btn @click="search()">ค้นหา</v-btn></v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-row>
              </v-toolbar>
            </template>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">ชั้นเรียน</th>
                  <th class="text-center">ห้องเรียน</th>
                  <th class="text-center">ดูคะแนน</th>
                </tr>
              </thead>
              <tbody align="center">
                <tr v-for="item in classRoomNameList" :key="item.name">
                  <td>{{ classRoomLevel }}</td>
                  <td>{{ item }}</td>
                  <td>
                    <v-btn
                      color="success"
                      dark
                      class="mr-2"
                      @click="grade(item)"
                    >
                      ดูคะแนน</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </template>
            <!-- <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="success" dark class="mr-2" @click="grade(item)">
                ดูคะแนน</v-btn
              >
            </template> -->
            -->
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  middleware: "admin",
  mounted() {
    // this.getDataFromApi().then(result => (this.academicYearItems = result));
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  data() {
    return {
      // headers: [
      //   { text: "ชั้นเรียน", value: "classRoomLevel", align: "center" },
      //   { text: "ห้องเรียน", value: "classRoomName", align: "center  " },
      //   { text: "Actions", value: "actions", sortable: false, align: "center" },
      // ],
      dialogCreateYear: false,
      schoolYear: "",
      term: "",
      classRoomLevel: "",
      items: [],
      itemClassRoom: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      title: `เลือกชั้นเรียน`,
      classRoomNameList: "",
    };
  },
  methods: {
    async getClasses() {
      var condition = {
        schoolYear: this.schoolYear,
        classRoomLevel: this.classRoomLevel,
      };
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        condition
      );
      if (response.results.length == 0) {
        alert("ไม่พบข้อมูล");
        return;
      } else {
        var classRoomList = response.results;
        var classRoomName = classRoomList.map((item) => item.classRoomName);
        this.classRoomNameList = [...new Set(classRoomName)];
        console.log("classRoomList", this.classRoomNameList);
      }
    },
    search() {
      if (this.$refs.form.validate()) {
        this.getClasses().then((result) => (this.items = result));
      } else {
        return;
      }
    },
    grade(item) {
      console.log("item grade", this.classRoomLevel, item);
      // this.$router.push({
      //   name: "grade_summary-grade",
      //   query: {
      //     schoolYear: item.schoolYear,
      //     classRoomLevel: item.classRoomLevel,
      //     classRoomName: item.classRoomName,
      //   },
      // });
    },
    back() {
      this.$router.push({ name: "index" });
    },
    resetForm() {
      this.$refs.form.reset();
    },
    close() {
      setTimeout(() => {
        this.dialogCreateYear = false;
      }, 300);
    },
  },
};
</script>
