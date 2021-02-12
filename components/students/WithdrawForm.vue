<template>
  <v-card-text>
    <h3>สิทธิ์การเบิกค่าเล่าเรียน</h3>
    <v-row>
      <v-col cols="12">
        <v-row justify="center">
          <v-col class="pt-0 pb-0" cols="8">
            <v-select
              v-model="withdrawData.privileage"
              :items="itemsPrivileage"
              dense
              outlined
              label="สิทธิ์การเบิกค่าเล่าเรียน"
            />
            <v-select
              v-model="withdrawData.welfare"
              :items="itemsWelfare"
              dense
              outlined
              label="ประเภท"
            />
            <v-row justify="end">
              <div class="mb-5 mr-5">
                <v-btn color="orange" depressed large @click="back"
                  >ย้อนกลับ</v-btn
                >
                <v-btn color="primary" depressed large @click="save"
                  >ถัดไป</v-btn
                >
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
export default {
  props: {
    withdrawData: {
      type: Object
    }
  },
  data() {
    return {
      tab: '',
      // withdrawData: {
      //   privileage: '',
      //   welfare: ''
      // },
      itemsPrivileage: ['เบิกค่าเล่าเรียนได้', 'เบิกค่าเล่าเรียนไม่ได้'],
      itemsWelfare: [
        '*สวัสดิการ มข. (บุตรข้าราชราช มข.)',
        'บุคคลทั่วไป (รวมทั้งบุตรพนักงานมหาวิทยาลัยขอนแก่น เงินงบประมาณ, พนักงานมหาวิทยาลัยขอนแก่น เงินรายได้)'
      ]
    }
  },
  methods: {
    back() {
      this.tab = 'familyData'
      console.log('black', this.tab)
      this.$emit('saveWithdraw', this.withdrawData, this.tab)
    },
    save() {
      console.log('go')
      this.tab = 'healthData'
      this.$emit('saveWithdraw', this.withdrawData, this.tab)
    }
  }
}
</script>

<style lang="scss" scoped></style>
