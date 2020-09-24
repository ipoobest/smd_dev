<template>
  <v-container>
    <v-btn class="mr-5" color="primary" fab small dark @click="back">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-row justify="center">
      <img height="150" src="~/assets/logo-smd.png" />
    </v-row>
    <v-row justify="center">
      <h3>แบบบันทึกผลการพัฒนาคุณภาพผู้เรียน(ปพ.5)</h3>
    </v-row>
    <v-row justify="center">
      <h3>โรงเรียนสาธิตมหาวิทยาลัยขอนแก่น (มอดินแดง) ระดับมัธยมศึกษา</h3>
    </v-row>
    <v-row justify="center">
      <h3>อำเภอเมืองขอนแก่น จังหวัดขอนแก่น</h3>
    </v-row>
    <v-row justify="center" class="pt-5">
      ระดับมัธยมศึกษาตอน
    </v-row>
    <v-row justify="start" class="pt-10">
      <v-col cols="1">ชื่อวิชา</v-col>
      <v-col v-if="items.subject_info" cols="2">{{
        items.subject_info.sname
      }}</v-col>
      <v-col v-else cols="2">{{ items.sname }}</v-col>
      <v-col cols="1">รหัสวิชา</v-col>
      <v-col v-if="items.subject_info" cols="2">{{
        items.subject_info.codet
      }}</v-col>
      <v-col cols="2">ภาคเรียนที่</v-col>
      <v-col cols="1">{{ items.term }}</v-col>
      <v-col cols="2">ปีการศึกษา</v-col>
      <v-col cols="1">{{ items.schoolYear }}</v-col>
    </v-row>
    <v-row justify="start">
      <v-col cols="2">ชั้นมัธยมศึกษาปีที่</v-col>
      <v-col cols="1"
        >{{ items.classRoomLevel }}/{{ items.classRoomName }}</v-col
      >
      <v-col cols="2">จำนวนหน่วยกิจ</v-col>
      <v-col v-if="items.subject_info" cols="1">{{
        items.subject_info.credit
      }}</v-col>
      <v-col cols="2">เวลาเรียน</v-col>
      <v-col v-if="items.subject_info" cols="1">{{
        items.subject_info.hour
      }}</v-col>
      <v-col cols="2">คาบ/สัปดาห์</v-col>
    </v-row>
    <v-row justify="start">
      <v-col cols="2">ชื่อาอาจารย์ผู้สอน</v-col>
      <v-col>{{ items.teacher.name }}</v-col>
    </v-row>
    <v-row justify="center" class="pt-10 pb-5">
      สรุปผลการประเมิน
    </v-row>
    <v-row>
      <v-simple-table style="width:100%;">
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
      <v-col cols="5">ลงชื่อ อาจารย์ผู้สอน</v-col>
      <v-col cols="3.5">( {{ items.teacher.name }} )</v-col>
      <v-col cols="1">วันที่</v-col>
      <v-col cols="1.5">{{ gatDate }}</v-col>
    </v-row>
    <v-row justify="start" class="pt-5">
      <v-col cols="5">หัวหน้าหลุ่มสาระการเรียนรู้{{ items.department }}</v-col>
      <v-col cols="3.5">( {{this.$store.state.auth.auth.title}} {{this.$store.state.auth.auth.firstName}} {{this.$store.state.auth.auth.lastName}} )</v-col>
      <v-col cols="1">วันที่</v-col>
      <v-col cols="1.5">{{ gatDate }}</v-col>
    </v-row>
    <v-row justify="start" class="pt-5">
      <v-col cols="5">ผู้ช่วยรองผู้อำนวยการฝ่ายวิชาการ</v-col>
      <v-col cols="3.5"> </v-col>
      <v-col cols="1">วันที่</v-col>
      <v-col cols="1.5">{{ gatDate }}</v-col>
    </v-row>
    <v-row justify="center" class="pt-10 pb-10">
      สำหรับงานทะเบียน
    </v-row>
    <div style="border-style: solid" class="pa-5">
      <v-row>
        <v-col cols="2">ตรวจสอบข้อมูล </v-col>
        <v-col cols="2">
           <v-radio-group v-model="items.approved" >
              <v-radio
                label="อนุมัติ"
                value=ture
              ></v-radio>
             <v-radio
                label="ไม่อนุมัติ"
                value=false
              ></v-radio>
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
    <v-row justify="center" class="pt-5">
      <v-col cols="4">
        <v-btn color="success" @click="save">บันทึก</v-btn>
        <v-btn color="info">export pdf</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "teacher",
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
        approved: null,
        approve_message: '',
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
    summaryGrade(data) {
      this.total_students = data.length;

      var grade_list = ["4", "3.5", "3", "2.5", "2", "1.5", "1", "0"];
      var grade_option = ["ร", "มส"];
      var other_score = ["3", "2", "1"];

      this.special_score = [];
      this.grade_num_list = [];
      grade_list.forEach(grade => {
        var grade_filter = data.filter(student => student.grade == grade && ! student.grade_option);
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
      console.log('approve, message', this.approved, this.approve_message)
      var data = {
        objectId: this.items.objectId,
        approved: this.items.approved,
        approve_message: this.items.approve_message
      }
      console.log('data update', data)
      this.updateTech(data)
      
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped></style>
