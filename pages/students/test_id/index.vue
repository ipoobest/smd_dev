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

          <v-tabs v-model="tab" fixed-tabs>
            <v-tab href="#personalData">ข้อมูลส่วนตัว</v-tab>
            <v-tab href="#addressData">ที่อยู่อาศัย</v-tab>
            <v-tab href="#familyData">ข้อมูลครอบครัว</v-tab>
            <v-tab href="#withdrawData">สิทธิการเบิกค่าเล่าเรียน</v-tab>
            <v-tab href="#healthData">ข้อมูลสุขภาพ</v-tab>

            <v-tab-item value="personalData"><Personal :personalData="data" @savePersonal="handlePersonalData"/></v-tab-item>
            <v-tab-item value="addressData"><Address :addressData="data" @saveAddress="handleAddressData"/></v-tab-item>
            <v-tab-item value="familyData"><Family :familyData="data" @saveFamily="handleFamilyData"/></v-tab-item>
            <v-tab-item value="withdrawData"><Withdraw :withdrawData="data" @saveWithdraw="handleWithdrawData"/></v-tab-item>
            <v-tab-item value="healthData"><Health :healthData="data" @saveHealth="handleHealthData"/></v-tab-item>
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
  async mounted () {
    await this.getStudentById(this.$route.params.id).then(result => (this.data = result))
    await this.mapPersonal()
    // this.personal = {...this.data}
    // 
  },
  data() {
    return {
      title: `แก้ไข ข้อมูลส่วนตัวนักเรียน`,
      tab: ``,
      // data: {
      //   profileBase64: ''
      // },
      data: '',
      personal: {
        tth: '',
        profileBase64: '',
        namet: '',
        snamet: '',
        itemsTiteEng: '',
        namee: '',
        snamee: '',
        nickName: '',
        sex: '',
        idstd: '',
        course: '',
        class: '',
        study: '',
        idCard: '',
        stage: '',
        stmonth: '',
        nation: '',
        race: '',
        religian: '',
        bday: '',
        badd: '',
        bprovince: ''
      },
      family: {},
      address: {},
      withdraw: {},
      health: {},
    }
  },
  methods: {
    async getStudentById(studentId) {
      const response = await this.$store.dispatch('students/getStudentById', studentId)
      // 
      return response
    },
    async updateStudents(data){
      
      const response = await this.$store.dispatch('students/updateStudent', data )
      
      this.$router.push({name: 'students'})
    },
     handlePersonalData(PersonalForm, tab) {
      //todo this kept in store
      this.personal = PersonalForm
      
      this.changeTab(tab)
    },
    handleAddressData(AdderessData, tab) {
      this.address = AdderessData
      
      this.changeTab(tab)
    },
    handleFamilyData(FamilyData, tab) {
      this.family = FamilyData
      
      this.tab = tab
      this.changeTab(this.tab)
    },
    handleWithdrawData(WithdrawData, tab) {
      this.withdraw = WithdrawData
      this.changeTab(tab)
    },
    handleHealthData(HealthData, tab) {
      this.health = HealthData
      
      this.updateData()
    },
    updateData() {
      const editData = {
        ...this.personal, 
        ...this.family, 
        ...this.address, 
        ...this.withdraw, 
        ...this.health,
      }

    // delete
     delete editData.data;
     delete editData.createdAt;
     delete editData.updatedAt;

      
      this.updateStudents(editData)
    },
    mapPersonal() {
        this.personal.profileBase64 = this.data.profileBase64,
        this.personal.tth = this.data.tth,
        this.personal.namet = this.data.namet,
        this.personal.snamet = this.data.snamet,
        this.personal.ten = this.data.ten,
        this.personal.namee = this.data.namee,
        this.personal.snamee = this.data.snamee,
        this.personal.nickName = this.data.nickName,
        this.personal.sex = this.data.sex,
        this.personal.idstd = this.data.idstd,
        this.personal.course = this.data.course,
        this.personal.class = this.data.class,
        this.personal.study = this.data.study,
        this.personal.idCard = this.data.idCard,
        this.personal.stage = this.data.stage,
        this.personal.stmonth = this.data.stmonth,
        this.personal.nation = this.data.nation,
        this.personal.race = this.data.race,
        this.personal.religian = this.data.religian,
        this.personal.bday = this.data.bday,
        this.personal.badd = this.data.badd,
        this.personal.bprovince = this.data.bprovince
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