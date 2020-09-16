<template>
  <v-container>
    <v-btn class="mr-5" color="primary" fab small dark @click="back">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-col cols="12" >
      <!-- <v-row justify="center">
        <img height="150" src="~/assets/logo-smd.png" />
      </v-row> -->
      <!-- <v-row justify="center">
        <h3>แบบบันทึกผลการพัฒนาคุณภาพผู้เรียน(ปพ.5)</h3>
      </v-row>
      <v-row justify="center">
        <h3>โรงเรียนสาธิตมหาวิทยาลัยขอนแก่น (มอดินแดง) ระดับมัธยมศึกษา</h3>
      </v-row>
      <v-row justify="center">
        <h3>อำเภอเมืองขอนแก่น  จังหวัดขอนแก่น</h3>
      </v-row>
      <v-row justify="center" class="pt-5">
        ระดับมัธยมศึกษาตอน.......
      </v-row> -->
    </v-col>
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
