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
              ><Personal @savePersonal="handlePersonalData"
            /></v-tab-item>
            <v-tab-item value="addressData"
              ><Address @saveAddress="handleAddressData"
            /></v-tab-item>
            <v-tab-item value="familyData"
              ><Family @saveFamily="handleFamilyData"
            /></v-tab-item>
            <v-tab-item value="withdrawData"
              ><Withdraw @saveWithdraw="handleWithdrawData"
            /></v-tab-item>
            <v-tab-item value="healthData"
              ><Health @saveHealth="handleHealthData"
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
  async asyncData() {},
  data() {
    return {
      tab: '',
      title: 'ข้อมูลส่วนตัวนักเรียน',
      personal: [],
      family:[],
      address:[],
      withdraw:[],
      health:[]
    }
  },
  mounted() {},
  methods: {
    async createStudent(data) {
      const response = await this.$store.dispatch(`students/createStudent`, data)
      console.log('response', data)
      this.createUser(data.idstd, data.idstd, 'student', data.objecId)
      // this.$router.replace({name: 'students'})

    },
    async createUser(username, password, type, objecId) {
      const response = await this.$store.dispatch(`users/createUser`,{ username, password, type, objecId })
      console.log('response', response)
      this.$router.replace({name: 'students'})
    },
    async saveData() {
      const data = {
        tth: this.personal.tth,
        namet: this.personal.namet,
        snamet: this.personal.snamet,
        nickName: this.personal.nickName,
        sex: this.personal.sex,
        idstd: this.personal.idstd,
        course: this.personal.course,
        class: this.personal.class,
        study: this.personal.study,
        ten: this.personal.ten,
        namee: this.personal.namee,
        snamee: this.personal.snamee,
        idCard: this.personal.idCard,
        stage: this.personal.stage,
        stmonth: this.personal.stmonth,
        nation: this.personal.nation,
        race: this.personal.race,
        religian: this.personal.religian,
        bday: this.personal.bday,
        badd: this.personal.badd,
        bprovince: this.personal.bprovince,
        profile: this.personal.profile.imageURL,
        fname: this.family.father.fname,
        fsername: this.family.father.fsername,
        fage: this.family.father.fage,
        feducation: this.family.father.feducation,
        fwork: this.family.father.fwork,
        fcareer: this.family.father.fcareer,
        fpost: this.family.father.fpost,
        fbeloin: this.family.father.fbeloin,
        fatwork: this.family.father.fatwork,
        ftell: this.family.father.ftell,
        fphone: this.family.father.fphone,
        fsalary: this.family.father.fsalary,
        mname: this.family.mather.mname,
        msername: this.family.mather.msername,
        mage: this.family.mather.mage,
        meducation: this.family.mather.meducation,
        mwork: this.family.mather.mwork,
        mcareer: this.family.mather.mcareer,
        mpost: this.family.mather.mpost,
        mbeloin: this.family.mather.mbeloin,
        matwork: this.family.mather.matwork,
        mtell: this.family.mather.mtell,
        mphone: this.family.mather.mphone,
        msalary: this.family.mather.msalary,
        residential: this.address.residential,
        domicile: this.address.domicile,
        addres: this.address.addres,
        dorm: this.address.dorm,
        stell: this.address.stell,
        privileage: this.withdraw.privileage,
        welfare: this.withdraw.welfare,
        blood: this.health.blood,
        disease: this.health.disease,
        treatment: this.health.treatment,
        healthpb: this.health.healthpb
      }
      console.log('data students', data.fname)
      this.createStudent(data)
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
