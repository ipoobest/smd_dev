<template>
  <v-container>
    <v-col cols="12" >
      <v-row justify="center" class="mt-5 mb-5"><h3>ใบแจ้งผลการเรียน</h3></v-row>
      <v-row justify="center"><h4>โรงเรียนสาธิตมหาวิทยาลัยขอนแก่น(มอดินแดง) ระกับมัธยมศึกษาตอนต้น</h4></v-row>
      <v-row class="mt-3">
        <v-col cols="2">ชื่อ-นามสกุล</v-col>
        <v-col cols="3">เด็กชาย ทดสอบ ทดสอบ</v-col>
        <v-col cols="2">เลขประจำตัว</v-col>
        <v-col cols="2">604001</v-col>
        <v-col cols="1">ชั้น</v-col>
        <v-col cols="2">มัธยมศึกษาปีที่ 1/1</v-col>
      </v-row>
      <v-row class="mt-5">
        <v-simple-table style="width:100%">
         <template>
           <thead>
             <tr>
               <th>ภาคการเรียนที่</th>
               <th>รหัสวิชา</th>
               <th>รหัสวิชา</th>
               <th>ชื่อวิชา</th>
               <th>หน่วย</th>
               <th>ระดับ</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td></td>
             </tr>
           </tbody>
         </template>
        </v-simple-table>
      </v-row>
    </v-col>    
  </v-container>
</template>

<script>
  export default {
    async mounted() {
      this.getGradeByConditions().then(result => {this.items = result})
      console.log('this.query', this.$route.query)
    },
    data() {
      return {
        items: ''
      }
    },
    methods: {
    
    async getGradeByConditions() {
      var conditions = {
        studentObjectId: this.$route.query.id,
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term
      }
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );
      console.log('grade id', response.results)
      return response.results
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>