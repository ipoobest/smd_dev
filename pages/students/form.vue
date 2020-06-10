<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back" >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>       
            {{ title }}</v-card-title>
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab href="#personalData">ข้อมูลส่วนตัว</v-tab>
            <v-tab href="#addressData">ที่อยู่อาศัย</v-tab>
            <v-tab href="#familyData">ข้อมูลครอบครัว</v-tab>
            <v-tab href="#withdrawData">สิทธิการเบิกค่าเล่าเรียน</v-tab>
            <v-tab href="#healthData">ข้อมูลสุขภาพ</v-tab>

            <v-tab-item value="personalData"
              ><Personal :personalData="personal" @savePersonal="handlePersonalData"
            /></v-tab-item>
            <v-tab-item value="addressData"
              ><Address :addressData="address" @saveAddress="handleAddressData"
            /></v-tab-item>
            <v-tab-item value="familyData"
              ><Family :familyData="family" @saveFamily="handleFamilyData"
            /></v-tab-item>
            <v-tab-item value="withdrawData"
              ><Withdraw :withdrawData="withdraw" @saveWithdraw="handleWithdrawData"
            /></v-tab-item>
            <v-tab-item value="healthData"
              ><Health :healthData="health" @saveHealth="handleHealthData"
            /></v-tab-item>
          </v-tabs>
          <!-- <v-btn @click="changeTab('tab-2')">Go to item2</v-btn> -->
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import Address from '@/components/students/AddressForm.vue'
import Family from '@/components/students/FamilyForm.vue'
import Health from '@/components/students/HealthForm.vue'
import Personal from '@/components/students/PersonalForm.vue'
import Withdraw from '@/components/students/WithdrawForm.vue'


export default {
  components: {
    Address,
    Family,
    Health,
    Personal,
    Withdraw
  },
  data() {
    return {
      tab: '',
      title: 'ข้อมูลส่วนตัวนักเรียน',
      personal: {},
      family: {},
      address: {},
      withdraw: {},
      health: {},
      data: {}
    }
  },
  mounted() {},
  methods: {
    async createStudent(data) {
      const response = await this.$store.dispatch(`students/createStudent`, data)
      console.log('response', data)
      // this.createUser(data.idstd, data.idstd, 'student', data.objecId)
      this.$router.replace({name: 'students'})

    },
    async createUser(username, password, type, objecId) {
      const response = await this.$store.dispatch(`users/createUser`,{ username, password, type, objecId })
      console.log('response', response)
      this.$router.replace({name: 'students'})
    },
    async saveData() {
       this.data = {
          ...this.personal, 
          ...this.family, 
          ...this.address, 
          ...this.withdraw, 
          ...this.health 
      }
      console.log('data students', this.data)
      this.createStudent(this.data)
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
    changeTab(tab) {
      this.tab = tab
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
