<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="1">ปีการศึกษา</v-col>
        <v-col cols="2">
          <v-select
            v-model="schoolYear"
            :items="itemSchoolYear"
            dense
            outlined
            label="ปีการศึกษา"
          ></v-select>
        </v-col>
        <v-col cols="1">เทอม</v-col>
        <v-col cols="2">
          <v-select
            v-model="term"
            :items="itemSchoolTerm"
            dense
            outlined
            label="เทอม"
          ></v-select
        ></v-col>
        <v-col cols="1">ชั้นเรียน</v-col>
        <v-col cols="2">
          <v-select
            v-model="classRoomLevel"
            :items="itemClassRoom"
            dense
            outlined
            label="ชั้นเรียน"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1">ห้องเรียน</v-col>
        <v-col cols="2">
          <v-select
            v-model="classRoomName"
            :items="itemClassName"
            @change="getSubject()"
            dense
            outlined
            label="ห้องเรียน"
          ></v-select>
        </v-col>
        <v-col cols="1">วิชา</v-col>
        <v-col cols="3">
          <v-select
            v-model="subject"
            :items="itemSubjectList"
            dense
            outlined
            label="วิชา"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-btn class="success" @click="exportXmls()">
            export
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import XLSX from "xlsx";
export default {
  layout: "assessment",
  middleware: "assessment",
  async mounted() {
    // await this.getGradebyConditions().then(result => (this.grade = result))
    this.getAcademicYear();
    // this.getSubject();
  },
  data() {
    return {
      grade: [],
      schoolYear: "",
      term: "",
      classRoomLevel: "",
      classRoomName: "",
      subject: "",
      itemSchoolYear: [],
      itemSchoolTerm: [],
      itemSubjectList: [],
      itemClassRoom: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      itemClassName: ["ทั้งหมด", "1", "2", "3", "4"]
    };
  },
  methods: {
    async getGradebyConditions() {
      var data;
      if (this.classRoomName == "ทั้งหมด") {
        data = {
          schoolYear: this.schoolYear,
          term: this.term,
          classRoomLevel: this.classRoomLevel,
          "teachInfo.sname": this.subject
        };
      } else {
        data = {
          schoolYear: this.schoolYear,
          term: this.term,
          classRoomLevel: this.classRoomLevel,
          classRoomName: this.classRoomName,
          "teachInfo.sname": this.subject
        };
      }

      console.log("data request", data);
      var response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        data
      );
      "response grade", response.results;
      return response.results;
    },
    async getAcademicYear() {
      var response = await this.$store.dispatch(
        `academic_year/getAcademicYear`
      );
      // console.log("response getAcademicYear", response.results);
      this.mapSchoolYear(response.results);
    },
    async getSubject() {
      var data;
      if (this.classRoomName == "ทั้งหมด") {
        data = {
          classRoomLevel: this.classRoomLevel,
          schoolYear: this.schoolYear,
          term: this.term
        };
      } else {
        data = {
          classRoomLevel: this.classRoomLevel,
          classRoomName: this.classRoomName,
          schoolYear: this.schoolYear,
          term: this.term
        };
      }

      // console.log("data get subject", data);
      var response = await this.$store.dispatch(
        `teach/getSubjectsByConditions`,
        data
      );
      // console.log("response getSubjects", response.results);
      this.mapSubject(response.results);
    },
    async getSubjectByName(data) {
      var response = await this.$store.dispatch(
        `subjects/getSubjectsByConditions`,
        data
      );
      // console.log("getSubjectByName", response.results[0]);
      return response.results[0];
    },
    mapSchoolYear(data) {
      data.forEach(item => {
        this.itemSchoolYear.push(item.schoolYear),
          this.itemSchoolTerm.push(item.term);
      });
    },
    mapSubject(data) {
      // console.log("map data", data);
      data.forEach(item => {
        this.itemSubjectList.push(`${item.subject.sname}`);
      });
    },
    keyRename(obj, old_key, new_key) {
      obj[new_key] = obj[old_key];
      delete obj[old_key];
      return obj;
    },
    // getClassLevel(item) {
    //   var lev = "2";
    //   if (item.classRoomLevel.includes("ม.4", "ม.5", "ม.6")) {
    //     lev = "3";
    //     return lev;
    //   }
    //   return lev;
    // },
    async exportXmls() {
      var newData = [];
      var perfixTerm = this.schoolYear.substring(2);
      // var perfixLev = this.getClassLevel()
      var grade = await this.getGradebyConditions();
      // var perfixLev = this.getClassLevel(grade[0]);
      console.log("grade", grade);
      var data;
      if (this.classRoomName == "ทั้งหมด") {
        data = grade.sort((a, b) => b.total_score - a.total_score);
      } else {
        data = grade.sort((a, b) => a.studentNumber - b.studentNumber);
      }
      console.log("data clean : ", data);
      var querySubject = {
        sname: this.subject,
        // codet: data[0].teachInfo.codet
      };
      var codeSubject = await this.getSubjectByName(querySubject);
      data.forEach(item => {
        var newJson = {
          id: item.studentId,
          studentNumber: item.studentNumber,
          fullname: item.studentName,
          code: codeSubject.code,
          codeth: item.teachInfo.codet,
          subject: item.teachInfo.sname,
          year: item.schoolYear,
          term: perfixTerm + item.term,
          class: item.classRoomLevel,
          sec: item.classRoomName,
          score: item.total_score,
          grd: item.grade,
          s10: item.aptitude,
          s11: item.analytical_thinking,
          lev: "3" + item.classRoomLevel.substring(2) + item.classRoomName
        };
        newData.push(newJson);
      });
      // console.log("new data", newData);
      // var dataWS = XLSX.utils.json_to_sheet(newData);
      // var wb = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, dataWS);
      // XLSX.writeFile(
      //   wb,
      //   `${this.subject}-${this.schoolYear}-${this.term}-${this.classRoomLevel}.xlsx`
      // );
    }
  }
};
</script>

<style lang="scss" scoped></style>
