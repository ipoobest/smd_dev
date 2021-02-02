<template ref="document">
  <v-container>
    <v-btn
      class="mr-5 btnBack"
      id="backButton"
      color="primary"
      fab
      small
      dark
      @click="back()"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <div id="pdfDom" class="page">
      <v-row justify="center">
        <img height="100" src="~/assets/logo-smd.png" />
      </v-row>
      <v-row justify="center">
        <h3>แบบบันทึกผลการพัฒนาคุณภาพผู้เรียน(ปพ.5)</h3>
      </v-row>
      <v-row justify="center">
        <h3>
          โรงเรียนสาธิตมหาวิทยาลัยขอนแก่น (มอดินแดง) ระดับมัธยมศึกษา
        </h3>
      </v-row>
      <v-row justify="center">
        <h3>อำเภอเมืองขอนแก่น จังหวัดขอนแก่น</h3>
      </v-row>
      <v-row justify="center" class="pt-5">
        ระดับมัธยมศึกษาตอน{{ getClasses() }}
      </v-row>
      <v-row justify="start" class="pt-10">
        <v-col cols="1">ชื่อวิชา</v-col>
        <v-col v-if="items.subject_info" cols="2">{{
          items.subject_info.sname
        }}</v-col>
        <v-col v-else cols="2">{{ items.subject.sname }}</v-col>
        <v-col cols="1">รหัสวิชา</v-col>
        <v-col v-if="items.subject_info" cols="2">{{
          items.subject_info.codet
        }}</v-col>
        <v-col v-else>{{ items.subject.codet }}</v-col>
        <v-col cols="2">ภาคเรียนที่</v-col>
        <v-col cols="1">{{ items.term }}</v-col>
        <v-col cols="2">ปีการศึกษา</v-col>
        <v-col cols="1">{{ items.schoolYear }}</v-col>
      </v-row>
      <v-row justify="start">
        <v-col cols="2">ชั้นมัธยมศึกษาปีที่</v-col>
        <v-col v-if="items.classRoomName != `รวม`" cols="1"
          >{{ items.classRoomLevel }}/{{ items.classRoomName }}
        </v-col>
        <v-col v-else cols="1">{{ items.classRoomLevel }} </v-col>
        <v-col cols="2">จำนวนหน่วยกิต</v-col>
        <v-col v-if="items.subject_info" cols="1">{{
          items.subject_info.credit
        }}</v-col>
        <v-col v-else>{{ items.subject.credit }}</v-col>
        <v-col cols="2">เวลาเรียน</v-col>
        <v-col cols="1">
          {{ getPeriod() }}
        </v-col>
        <v-col cols="2">คาบ/สัปดาห์</v-col>
      </v-row>
      <v-row justify="start">
        <v-col cols="2">ชื่อาอาจารย์ผู้สอน</v-col>
        <v-col v-if="items.teacher">{{ items.teacher.name }}</v-col>
        <v-col v-else
          >{{ items.teachers.title }} {{ items.teachers.firstName }}
          {{ items.teachers.lastName }}</v-col
        >
      </v-row>
      <v-row justify="center" class="pt-10 pb-5">
        สรุปผลการประเมิน
      </v-row>
      <v-row justify="center">
        <v-simple-table style="width:100%">
          <thead>
            <tr>
              <th>จำนวนนักเรียนที่ลงทะเบียน</th>
              <th colspan="10">ระดับผลการเรียน</th>
              <th colspan="3">คุณลักษณะอันพึงประสงค์</th>
              <th colspan="3">การอ่านคิดวิเคราะห์และเขียน</th>
            </tr>
            <tr>
              <th></th>
              <th>4.0</th>
              <th>3.5</th>
              <th>3.0</th>
              <th>2.5</th>
              <th>2.0</th>
              <th>1.5</th>
              <th>1.0</th>
              <th>0</th>
              <th>ร</th>
              <th>มส</th>
              <th>รส</th>
              <th>3</th>
              <th>2</th>
              <th>1</th>
              <th>3</th>
              <th>2</th>
              <th>1</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ total_students }}</td>
              <td v-for="grade_num in grade_num_list" :key="grade_num.index">
                {{ grade_num }}
              </td>
              <td
                v-for="grade_num_option in grade_option_num_list"
                :key="grade_num_option.index"
              >
                {{ grade_num_option }}
              </td>
              <td
                v-for="aptitude_score in aptitude_score_num"
                :key="aptitude_score.index"
              >
                {{ aptitude_score }}
              </td>
              <td
                v-for="analytical_score in analytical_score_num"
                :key="analytical_score.index"
              >
                {{ analytical_score }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-row>
      <v-row justify="center" class="pt-10">
        การอนุมัติผลการเรียน
      </v-row>
      <v-row justify="start" class="pt-5">
        <v-col cols="4">ลงชื่อ อาจารย์ผู้สอน</v-col>
        <v-col cols="3.5">( {{ items.teacher.name }} )</v-col>
        <v-col cols="1">วันที่</v-col>
        <v-col cols="2.5">{{ gatDate }}</v-col>
      </v-row>
      <v-row justify="start" class="pt-5">
        <v-col cols="4"
          >หัวหน้ากลุ่มสาระการเรียนรู้{{ items.department }}</v-col
        >
        <v-col cols="3.5"></v-col>
        <v-col cols="1">วันที่</v-col>
        <v-col cols="2.5">{{ gatDate }}</v-col>
      </v-row>
      <v-row justify="start" class="pt-5">
        <v-col cols="4">ผู้ช่วยผู้อำนวยการฝ่ายวิชาการและวิจัย</v-col>
        <v-col cols="3.5"> </v-col>
        <v-col cols="1">วันที่</v-col>
        <v-col cols="2.5">{{ gatDate }}</v-col>
      </v-row>
      <v-row justify="center" class="pt-10 pb-10">
        สำหรับงานทะเบียน
      </v-row>
      <div style="border-style: solid" class="pa-5">
        <v-row>
          <v-col cols="2">ตรวจสอบข้อมูล </v-col>
          <v-col cols="2">
            <v-radio-group v-model="items.approved">
              <v-radio label="อนุมัติ" value="true"></v-radio>
              <v-radio label="ไม่อนุมัติ" value="false"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="6" class="mt-8">
            <v-text-field
              v-model="items.approve_message"
              label="สาเหตุที่ไม่อนุมัติ"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="4">ลงชื่อ <v-text-field> </v-text-field></v-col>
        </v-row>
      </div>
    </div>
    <v-row justify="center" class="mt-5">
      <v-btn color="success" id="saveButton" @click="save">บันทึก</v-btn>
      <v-btn color="info" class="ml-5" id="printButton" @click="print()"
        >print</v-btn
      >
    </v-row>
  </v-container>
</template>

<script>
import jsPDF from "jspdf";
export default {
  layout: "assessment",
  middleware: "assessment",
  async mounted() {
    await this.getTechById(this.$route.query.id).then(
      result => (this.items = result)
    );
    await this.getGrade(this.items).then(result => (this.students = result));
    await this.summaryGrade(this.students);
  },
  computed: {
    gatDate() {
      var dt = new Date();
      var dateTime = `${dt
        .getDate()
        .toString()
        .padStart(2, "0")}/${(dt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${(dt.getFullYear() + 543)
        .toString()
        .padStart(4, "0")} `;
      return dateTime;
    }
  },
  data() {
    return {
      date: "",
      items: {
        subject_info: {
          sname: "",
          codet: "",
          credit: "",
          hour: ""
        },
        teacher: {
          name: "",
          value: ""
        },
        subject: {
          credit: ""
        },
        approved: false,
        approve_message: ""
      },

      students: [],
      total_students: "",
      grade_num_list: [],
      grade_option_num_list: [],
      aptitude_score_num: [],
      analytical_score_num: []
    };
  },
  methods: {
    async getTechById(id) {
      const response = await this.$store.dispatch("teach/getTeachById", id);
      console.log("this.item", response);
      return response;
    },
    async getGrade(item) {
      const conditions = {
        teachId: item.objectId
      };
      // 1 get stu array grade
      const response_grade = await this.$store.dispatch(
        "grade/getGradeByConditions",
        conditions
      );
      // console.log("response_grade", response_grade.results.length);
      return response_grade.results;
    },
    async updateTech(data) {
      const response = this.$store.dispatch(`teach/updateTeach`, data);
      console.log("update Teach", data, response);

      this.getTechById(this.$route.query.id).then(
        result => (this.items = result)
      );
    },
    getClasses() {
      var a = "ต้น";
      var b = "ปลาย";
      var classes = this.items.classRoomLevel;
      if (["ม.1", "ม.2", "ม.3"].includes(classes)) {
        return a;
      } else {
        return b;
      }
    },
    getPeriod() {
      var period = 0;
      console.log("get period :", this.items.subject.credit);
      if (this.items.subject.credit) {
        return this.items.subject.credit * 2;
      } else {
        period = this.items.subject_info.credit * 2;
        console.log("period", period);
        return period;
      }
    },
    summaryGrade(data) {
      this.total_students = data.length;

      var grade_list = ["4", "3.5", "3", "2.5", "2", "1.5", "1", "0"];
      var grade_option = ["ร", "มส", "รส"];
      var other_score = ["3", "2", "1"];

      this.special_score = [];
      this.grade_num_list = [];
      grade_list.forEach(grade => {
        var grade_filter = data.filter(
          student => student.grade == grade && !student.grade_option
        );
        this.grade_num_list.push(grade_filter.length);
      });

      // console.log("xxx", this.grade_num_list);
      this.grade_option_num_list = [];
      grade_option.forEach(grade => {
        var grade_filter = data.filter(
          student => student.grade_option == grade
        );
        this.grade_option_num_list.push(grade_filter.length);
      });
      console.log("grade options", this.grade_option_num_list);

      this.aptitude_score_num = [];
      this.analytical_score_num = [];

      other_score.forEach(score => {
        var aptitude_filter = data.filter(student => student.aptitude == score);
        this.aptitude_score_num.push(aptitude_filter.length);

        var analytical_filter = this.students.filter(
          student => student.analytical_thinking == score
        );
        this.analytical_score_num.push(analytical_filter.length);
      });
    },
    save() {
      console.log("approve, message", this.items.approved);
      var save_score = this.items.approved === "true" ? false : true;
      var send_score = this.items.approved === "true" ? true : false;
      if (confirm("ยืนยันการบันทึก")) {
        var data = {
          objectId: this.items.objectId,
          approved: this.items.approved,
          approve_message: this.items.approve_message,
          save_score: save_score,
          send_score: send_score
        };
        console.log("data update", data);
        this.updateTech(data);
      }
    },
    print() {
      window.print();
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
.page {
  width: 90%;
  margin: auto;
  size: A4 portrait;
}
@media print {
  header {
    visibility: hidden;
  }
  #saveButton {
    visibility: hidden;
  }
  #backButton {
    visibility: hidden;
  }
  #printButton {
    visibility: hidden;
  }
}
</style>
