<template>
  <v-card>
    <v-row>
      <v-col cols="4">
        <v-btn @click="getOldClass()">get classes</v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn @click="updateTeacher()">update teacher</v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn @click="updateTeacherNextTerm()">update teacher nextTerm</v-btn>
      </v-col></v-row
    >
    <v-card-title>
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
    ></v-data-table>
  </v-card>
</template>

<script>
export default {
  layout: "fix_data",
  data() {
    return {
      search: "",
      headers: [
        { text: "ปีการศึกษา", value: "schoolYear" },
        { text: "ชั้นเรียน", value: "classRoomLevel" },
        { text: "ห้องเรียน", value: "classRoomName" },
        { text: "ครูประจำชั้น 1 (เก่า)", value: "teatherName.teather1" },
        { text: "ครูประจำชั้น 2 (เก่า)", value: "teatherName.teather2" },
        { text: "ครูประจำชั้น 1", value: "advisoryTeacher.teacher1" },
        { text: "ครูประจำชั้น 2", value: "advisoryTeacher.teacher2" },
      ],
      items: [],
    };
  },
  methods: {
    async getClasses(data) {
      var query = {
        schoolYear: data.schoolYear,
        term: data.term,
        classRoomLevel: data.classRoomLevel,
        classRoomName: data.classRoomName,
      };
      const response = await this.$store.dispatch(
        "classes/getClassesByConditions",
        query
      );
      //
      // this.items = response.results
      console.log("response getclass", response.results);
      return response.results;
    },
    async getNewClasses(data) {
      var query = {
        schoolYear: data.schoolYear,
        term: data.term,
        classRoomLevel: data.classRoomLevel,
        classRoomName: data.classRoomName,
      };
      const response = await this.$store.dispatch(
        "classes/getClassesByConditions",
        query
      );
      //
      // this.items = response.results
      return response.results[0];
    },
    async updateTeacherInClasses(data) {
      console.log("dataxx", data);
      const response = await this.$store.dispatch(
        "classes/updateClasses",
        data
      );
    },
    async getOldClass() {
      var data = {
        schoolYear: "2563",
        term: "1",
      };
      this.items = await this.getClasses(data);
    },
    async updateTeacher() {
      this.items.forEach(async (item) => {
        var data = {
          objectId: item.objectId,
          advisoryTeacher: {
            teacher1: item.teatherName.teather1,
            teacher2: item.teatherName.teather2,
          },
        };
        console.log("date upadte", data);

        await this.updateTeacherInClasses(data);
      });
    },
    async updateTeacherNextTerm() {
      // for (var i = 0; i < this.items.length; i++) {
      //   var data = {
      //     schoolYear: "2563",
      //     term: "2",
      //     classRoomLevel: this.items[i].classRoomLevel,
      //     classRoomName: this.items[i].classRoomName,
      //     advisoryTeacher: this.items[i].advisoryTeacher,
      //   };
      //   console.log("date upadte", data);
      //   // await this.getNewClasses(data);
      // }
      // alert("success");
      this.items.forEach(async (item) => {
        console.log("itemssss", item);
        var data = {
          schoolYear: "2563",
          term: "2",
          classRoomLevel: item.classRoomLevel,
          classRoomName: item.classRoomName,
          // advisoryTeacher: {
          //   teacher1: item.teatherName.teacher1,
          //   teacher2: item.teatherName.teather2,
          // },
        };

        var newItem = await this.getNewClasses(data);
        console;
        var newData = {
          objectId: newItem.objectId,
          classRoomLevel: newItem.classRoomLevel,
          classRoomName: newItem.classRoomName,
          advisoryTeacher: item.advisoryTeacher,
          // advisoryTeacher: {
          //   teacher1: newItem.advisoryTeacher.teacher1,
          //   teacher2: newItem.advisoryTeacher.teacher2,
          // },
        };
        // console.log("newdata", newData);
        await this.updateTeacherInClasses(newData);
      });
      // get classes

      // var newClass = this.getClasses(data);
    },
  },
};
</script>
