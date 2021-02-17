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
          <v-data-table :headers="headers" :items="items">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-row justify="center">
                  <v-form ref="form" validation>
                    <v-container>
                      <v-row>
                        <v-col cols="4"
                          ><v-text-field
                            v-model="schoolYear"
                            label="ปีการศึกษา"
                            dense
                            outlined
                            required
                            :rules="[v => !!v || 'กรุณาเลือกปีการศึกษา']"
                          ></v-text-field
                        ></v-col>
                        <v-col cols="4"
                          ><v-text-field
                            v-model="term"
                            label="เทอม"
                            dense
                            outlined
                            required
                            :rules="[v => !!v || 'กรุณาเลือกเทอม']"
                          ></v-text-field
                        ></v-col>
                        <v-col><v-btn @click="search()">ค้นหา</v-btn></v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-row>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="success" dark class="mr-2" @click="grade(item)">
                ดูคะแนน</v-btn
              >
            </template>
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
    // this.getDataFromApi().then(result => (this.academicYearItems = result));
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  data() {
    return {
      headers: [
        { text: "ชั้นเรียน", value: "classRoomLevel", align: "center" },
        { text: "ห้องเรียน", value: "classRoomName", align: "center  " },
        { text: "Actions", value: "actions", sortable: false, align: "center" }
      ],
      dialogCreateYear: false,
      schoolYear: "",
      term: "",
      items: [],
      title: `เลือกชั้นเรียน`
    };
  },
  methods: {
    async getClasses() {
      var condition = {
        schoolYear: this.schoolYear,
        term: this.term
      };
      console.log("data request", condition);
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        condition
      );
      console.log("response getclasses", response.results);
      return response.results;
    },
    search() {
      if (this.$refs.form.validate()) {
        this.getClasses().then(result => (this.items = result));
      } else {
        return;
      }
    },
    sortRoom() {},
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
    }
  }
};
</script>
