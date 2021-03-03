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
            item-text="sname"
            item-value="objectId"
            :items="itemSubjectList"
            dense
            outlined
            label="วิชา"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-btn class="success" @click="exportXmls()"> export </v-btn>
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
    this.getAcademicYear();
  },
  data() {
    return {
      grade: [],
      schoolYear: "",
      term: "",
      classRoomLevel: "",
      classRoomName: "",
      subject: "",
      itesm: "",
      itemSchoolYear: [],
      itemSchoolTerm: [],
      itemSubjectList: [],
      itemClassRoom: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      itemClassName: ["ทั้งหมด", "1", "2", "3", "4"],
    };
  },
  methods: {
    async getGradebyConditions() {
      console.log("this subject", this.subject);
      var data;
      var result;
      if (this.classRoomName == "ทั้งหมด") {
        console.log("xxx");
        data = {
          schoolYear: this.schoolYear,
          term: this.term,
          classRoomLevel: this.classRoomLevel,
          teachId: this.subject,
        };
      } else {
        data = {
          schoolYear: this.schoolYear,
          term: this.term,
          classRoomLevel: this.classRoomLevel,
          classRoomName: this.classRoomName,
          teachId: this.subject,
        };
      }

      console.log("request grade", data);

      var response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        data
      );
      result = response.results;

      console.log("result length", result.length);
      if (result.length == 0) {
        if (this.classRoomName == "ทั้งหมด") {
          data = {
            schoolYear: this.schoolYear,
            term: this.term,
            classRoomLevel: this.classRoomLevel,
            // "teachInfo.sname": this.subject.objectId,
            teach: {
              __type: "Pointer",
              className: "Teach",
              objectId: this.subject,
            },
          };
        } else {
          data = {
            schoolYear: this.schoolYear,
            term: this.term,
            classRoomLevel: this.classRoomLevel,
            classRoomName: this.classRoomName,
            subject: {
              __type: "Pointer",
              className: "Subjects",
              objectId: this.subject,
            },
          };
        }
        console.log("data get grade", data);
        var response = await this.$store.dispatch(
          `grade/getGradeByConditions`,
          data
        );
        return response.results;
      } else {
        return result;
      }
    },
    async getAcademicYear() {
      var response = await this.$store.dispatch(
        `academic_year/getAcademicYear`
      );
      //
      this.mapSchoolYear(response.results);
    },
    async getSubject() {
      var data;
      if (this.classRoomName == "ทั้งหมด") {
        data = {
          classRoomLevel: this.classRoomLevel,
          schoolYear: this.schoolYear,
          term: this.term,
        };
      } else {
        data = {
          classRoomLevel: this.classRoomLevel,
          classRoomName: this.classRoomName,
          schoolYear: this.schoolYear,
          term: this.term,
        };
      }

      //
      var response = await this.$store.dispatch(
        `teach/getSubjectsByConditions`,
        data
      );
      console.log("response data subject", response.results);
      this.mapSubject(response.results);
    },
    async getSubjectByName(data) {
      console.log("data query", data);
      var response = await this.$store.dispatch(
        `subjects/getSubjectsByConditions`,
        data
      );
      console.log("get subject", response.results);
      return response.results[0];
    },
    mapSchoolYear(data) {
      data.forEach((item) => {
        this.itemSchoolYear.push(item.schoolYear),
          this.itemSchoolTerm.push(item.term);
      });
    },
    mapSubject(data) {
      console.log("data".data);
      const map = new Map();
      for (var item of data) {
        if (!map.has(item.subject.sname)) {
          map.set(item.subject.sname, true);
          this.itemSubjectList.push({
            objectId: `${item.objectId}`,
            sname: `${item.teachInfo}`
              ? `${item.teachInfo.sname}`
              : `${item.subject.sname}`,
          });
        }
      }
      console.log("itemSubjectList", this.itemSubjectList);
    },
    keyRename(obj, old_key, new_key) {
      obj[new_key] = obj[old_key];
      delete obj[old_key];
      return obj;
    },
    async exportXmls() {
      var newData = [];
      var perfixTerm = this.schoolYear.substring(2);
      // var perfixLev = this.getClassLevel()
      var grade = await this.getGradebyConditions();
      // console.log("grade", grade);
      // var perfixLev = this.getClassLevel(grade[0]);
      var data;
      if (this.classRoomName == "ทั้งหมด") {
        data = grade.sort((a, b) => b.total_score - a.total_score);
      } else {
        data = grade.sort((a, b) => a.studentNumber - b.studentNumber);
      }
      console.log("data", data);
      var code;
      var codeT;
      var subjectName;
      data.forEach((item) => {
        if (item.subject) {
          code = item.subject.code;
          codeT = item.subject.codet;
          subjectName = item.subject.sname;
        } else {
          code = item.teachInfo.code;
          codeT = item.teachInfo.codet;
          subjectName = item.teachInfo.sname;
        }
        var newJson = {
          id: item.studentId,
          studentNumber: item.studentNumber,
          fullname: item.studentName,
          code: code,
          codeth: codeT,
          subject: subjectName,
          year: item.schoolYear,
          term: perfixTerm + item.term,
          class: item.classRoomLevel,
          sec: item.classRoomName,
          score: item.total_score,
          grd: item.grade,
          s10: item.aptitude,
          s11: item.analytical_thinking,
          lev: "3" + item.classRoomLevel.substring(2) + item.classRoomName,
        };
        // console.log("new json", newJson);
        newData.push(newJson);
      });
      // console.log("new data", newData);
      if (newData.length == 0) {
        alert("ยังไม่มีข้อมูลของวิชานี้");
      } else {
        var dataWS = XLSX.utils.json_to_sheet(newData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, dataWS);
        XLSX.writeFile(
          wb,
          `${this.subject}-${this.schoolYear}-${this.term}-${this.classRoomLevel}.xlsx`
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
