<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
          <v-btn class="mr-5" color="primary" fab small dark @click="back" >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>    
            {{ title }}
          </v-card-title>
          <v-tabs fixed-tabs >
            <v-tab>ข้อมูลส่วนตัว</v-tab>
            <v-tab>ที่อยู่อาศัย</v-tab>
            <v-tab>ข้อมูลครอบครัว</v-tab>
            <v-tab>ข้อมูลสุขภาพ</v-tab>
            <v-tab>สิทธิการเบิกค่าเล่าเรียน</v-tab>


            <v-tab-item><Personal :personalData="data" @savePersonal="handlePersonalData"/></v-tab-item>
            <v-tab-item><Address :addressData="data" @saveAddress="handleAddressData"/></v-tab-item>
            <v-tab-item><Family :familyData="data" @saveFamily="handleFamilyData"/></v-tab-item>
            <v-tab-item><Health :healthData="data" @saveHealth="handleHealthData"/></v-tab-item>
            <v-tab-item><Withdraw :withdrawData="data" @saveWithdraw="handleWithdrawData"/></v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import Address from '~/components/students/AddressForm.vue';
import Family from '~/components/students/FamilyForm.vue';
import Health from '~/components/students/HealthForm.vue';
import Personal from '~/components/students/PersonalForm.vue';
import Withdraw from '~/components/students/WithdrawForm.vue';

export default {
  components: {
    Address,
    Family,
    Health,
    Personal,
    Withdraw
  },
  mounted() {
    this.getStudentById(this.$route.params.id).then(result => (this.data = result))
    console.log('data xx', this.data)
    this.mapPersonalData()
  },
  data() {
    return {
      title: `แก้ไข ข้อมูลส่วนตัวนักเรียน`,
      data: {},
      personal: {},
      family: {},
      address: {},
      withdraw: {},
      health: {}
    }
  },
  methods: {
    async getStudentById(studentId) {
      const response = await this.$store.dispatch('students/getStudentById', studentId)
      console.log('response', response)
      return response
    },
     handlePersonalData(PersonalForm, tab) {
      //todo this kept in store
      this.personal = PersonalForm
      this.changeTab(tab)
      console.log('main ', this.personal)
    },
    handleAddressData(AdderessData, tab) {
      this.address = AdderessData
      console.log('tab address ', this.address)
      this.changeTab(tab)
    },
    handleFamilyData(FamilyData, tab) {
      this.family = FamilyData
      console.log('tab FamilyData ', this.family)
      this.tab = tab
      this.changeTab(this.tab)
    },
    handleWithdrawData(WithdrawData, tab) {
      this.withdraw = WithdrawData
      this.changeTab(tab)
    },
    handleHealthData(HealthData, tab) {
      this.health = HealthData
      console.log('main handleHealthData ', this.health)
      this.saveData()
    },
    mapPersonalData() {
     this.personal = {
        tth: this.data.tth,
        namet: this.data.namet,
        snamet: this.data.snamet,
        nickName: this.data.nickName,
        sex: this.data.sex,
        idstd: this.data.idstd,
        course: this.data.course,
        class: this.data.class,
        study: this.data.study,
        ten: this.data.ten,
        namee: this.data.namee,
        snamee: this.data.snamee,
        idCard: this.data.idCard,
        stage: this.data.stage,
        stmonth: this.data.stmonth,
        nation: this.data.nation,
        race: this.data.race,
        religian: this.data.religian,
        bday: this.data.bday,
        badd: this.data.badd,
        bprovince: this.data.bprovince,
        profile: this.data.profile,
        saving: false,
        saved: false
      }
    },
    changeTab(tab) {
      this.tab = tab
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>