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
      <v-row justify="start" class="pt-5">
        <v-col cols="1">ชื่อวิชา</v-col>
        <v-col cols="2"></v-col>
        <v-col cols="1">รหัสวิชา</v-col>
        <v-col cols="2"></v-col>
        <v-col cols="2">ภาคเรียนที่</v-col>
        <v-col cols="1"></v-col>
        <v-col cols="2">ปีการศึกษา</v-col>
        <v-col cols="1"></v-col>
      </v-row>
      <v-row justify="start">
        <v-col cols="2">ชั้นมัธยมศึกษาปีที่</v-col>
        <v-col cols="1"> </v-col>
        <v-col cols="2">จำนวนหน่วยกิจ</v-col>
        <v-col cols="1"></v-col>
        <v-col cols="1">เวลาเรียน</v-col>
        <v-col cols="1"></v-col>
        <v-col cols="2">คาบ/สัปดาห์</v-col>
      </v-row>
      <v-row justify="start">
        <v-col cols="2">ชื่อาอาจารย์ผู้สอน</v-col>
        <v-col>อาจารย์ ทดสอบ ทดสอบ</v-col>
      </v-row>
      <v-row justify="center" class="pt-5">
        สรุปผลการประเมิน
      </v-row>
      <v-row>
        <v-simple-table>
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
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
              <th>10</th>
            </tr>
          </tbody>
        </v-simple-table>
      </v-row>
      <v-row justify="center" class="pt-10">
        การอนุมัติผลการเรียน
      </v-row>
      <v-row justify="start" class="pt-5">
        <v-col cols="5">ชั้นมัธยมศึกษาปีที่</v-col>
        <v-col cols="7"></v-col>
      </v-row>
      <v-row justify="start" class="pt-5">
        <v-col cols="5">หัวหน้าหลุ่มสาระการเรียนรู้</v-col>
        <v-col cols="3.5"> </v-col>
        <v-col cols="1">วันที่</v-col>
        <v-col cols="2.5"></v-col>
      </v-row>
      <v-row justify="start" class="pt-5">
        <v-col cols="5">ผู้ช่วยรองผู้อำนวยการฝ่ายวิชาการ</v-col>
        <v-col cols="3.5"> </v-col>
        <v-col cols="1">วันที่</v-col>
        <v-col cols="2.5"></v-col>
      </v-row>
       <v-row justify="center" class="pt-10">
         สำหรับงานทะเบียน
      </v-row>
      <div>
      <v-row>
        <v-col cols="2">ตรวจสอบข้อมูล</v-col>
        <v-col cols="2"><v-checkbox label="เรียบร้อย"></v-checkbox></v-col>
      </v-row>
        <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="2"><v-checkbox label="ไม่เรียบร้อย"></v-checkbox></v-col>
        <v-col cols="8"><v-text-field > </v-text-field></v-col>
      </v-row>
      <v-row justify="center"><v-col cols="4">ลงชื่อ <v-text-field > </v-text-field></v-col> </v-row>
      </div>
  </v-container>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped></style>
