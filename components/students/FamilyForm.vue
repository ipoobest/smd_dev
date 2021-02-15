<template>
  <v-card-text>
    <h3>ข้อมูลผู้ปกครอง</h3>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="familyData.fname"
              dense
              outlined
              label="ชื่อ (บิดา)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="familyData.fsername"
              dense
              outlined
              label="นามสกุล (บิดา)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="2">
            <v-text-field
              v-model="familyData.fage"
              dense
              outlined
              label="อายุ"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="6">
            <v-select
              v-model="familyData.mstatus"
              :items="itemsMstatus"
              dense
              outlined
              label="สถานะภาพ (*หากเสียชีวิตแล้วไม่ต้องตอบเรื่องอาชีพ)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-select
              v-model="familyData.feducation"
              :items="itemsEducation"
              dense
              outlined
              label="คุณวุติทางการศึกษา"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="7">
            <v-select
              v-model="familyData.fwork"
              :items="itemsWork"
              dense
              outlined
              label="ประเภทของงาน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="familyData.fcareer"
              dense
              outlined
              label="อาชีพ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.fpost"
              dense
              outlined
              label="ตำแหน่ง"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.fbeloin"
              dense
              outlined
              label="สังกัด"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="12">
            <v-textarea
              v-model="familyData.fatwork"
              label="สถานที่ทำงานของบิดา"
              auto-grow
              outlined
              rows="3"
              row-height="40"
            ></v-textarea
          ></v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.ftell"
              dense
              outlined
              label="เบอร์โทรศัพท์ที่ทำงาน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.fphone"
              dense
              outlined
              label="เบอร์โทรศัพท์มือถือ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.fsalary"
              dense
              outlined
              label="รายได้เฉลี่ย/เดือน"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="familyData.mname"
              dense
              outlined
              label="ชื่อ (มารดา)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="familyData.msername"
              dense
              outlined
              label="นามสกุล (มารดา)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="2">
            <v-text-field
              v-model="familyData.mage"
              dense
              outlined
              label="อายุ"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="6">
            <v-select
              v-model="familyData.meducation"
              :items="itemsEducation"
              dense
              outlined
              label="คุณวุติทางการศึกษา"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="7">
            <v-select
              v-model="familyData.mwork"
              :items="itemsWork"
              dense
              outlined
              label="ประเภทของงาน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="familyData.mcareer"
              dense
              outlined
              label="อาชีพ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.mpost"
              dense
              outlined
              label="ตำแหน่ง"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.mbeloin"
              dense
              outlined
              label="สังกัด"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="12">
            <v-textarea
              v-model="familyData.matwork"
              label="สถานที่ทำงานของมารดา"
              auto-grow
              outlined
              rows="3"
              row-height="40"
            ></v-textarea
          ></v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.mtell"
              dense
              outlined
              label="เบอร์โทรศัพท์ที่ทำงาน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.mphone"
              dense
              outlined
              label="เบอร์โทรศัพท์มือถือ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="familyData.msalary"
              dense
              outlined
              label="รายได้เฉลี่ย/เดือน"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="12">
            <v-text-field
              v-model="familyData.sibling"
              dense
              outlined
              label="พี่น้องร่วมบิดา/มารดาที่เรียนโรงเรียนสาธิต(มอดินแดง)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="8">
            <v-text-field
              v-model="familyData.sibling1"
              dense
              outlined
              label="ประกอบกด้วย 1"
            />
            <v-text-field
              v-model="familyData.sibling2"
              dense
              outlined
              label="ประกอบกด้วย 2"
            />
            <v-text-field
              v-model="familyData.sibling3"
              dense
              outlined
              label="ประกอบกด้วย 2"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="4">
            <v-text-field
              v-model="familyData.sbclass1"
              dense
              outlined
              label="จำนวน"
            />
            <v-text-field
              v-model="familyData.sbclass2"
              dense
              outlined
              label="จำนวน"
            />
            <v-text-field
              v-model="familyData.sbclass3"
              dense
              outlined
              label="จำนวน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="12">
            <v-text-field
              v-model="familyData.contact"
              dense
              outlined
              label="กรณีฉุกเฉินติดต่อ"
            />
            <v-text-field
              v-model="familyData.related"
              dense
              outlined
              label="เกี่ยวข้องเป็น"
            />
            <v-text-field
              v-model="familyData.ctell"
              dense
              outlined
              label="หมายเลขโทรศัพท์"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="end">
      <div class="mb-5 mr-7">
        <v-btn color="orange" depressed large @click="back">ย้อนกลับ</v-btn>
        <v-btn color="primary" depressed large @click="save">ถัดไป</v-btn>
      </div>
    </v-row>
  </v-card-text>
</template>

<script>
export default {
  name: 'FamilyForm',
  props: {
    familyData: {
      type: Object
    }
  },
  data() {
    return {
      tab: '',
      // familyData: {
      //   father: {
      //     fname: '',
      //     fsername: '',
      //     fage: '',
      //     feducation: '',
      //     fwork: '',
      //     fcareer: '',
      //     fpost: '',
      //     fbeloin: '',
      //     officeAddress: {
      //       fatwork: '',
      //       ftell: ''
      //     },
      //     fphone: '',
      //     fsalary: ''
      //   },
      //   mather: {
      //     mname: '',
      //     msername: '',
      //     mage: '',
      //     meducation: '',
      //     mwork: '',
      //     mcareer: '',
      //     mpost: '',
      //     mbeloin: '',
      //     officeAddress: {
      //       matwork: '',
      //       mtell: ''
      //     },
      //     mphone: '',
      //     msalary: ''
      //   },
      //   mstatus: '',
      //   sibling: '',
      //   sibling1: '',
      //   sibling2: '',
      //   sibling3: '',
      //   sbclass1: '',
      //   sbclass2: '',
      //   sbclass3: '',
      //   contact: '',
      //   related: '',
      //   ctell: ''
      // },
      itemsEducation: ['ปริญาตรี', 'ปริญาโท', 'ปริญาเอก', 'ตำกว่าปริญาตรี'],
      itemsMstatus: [
        'อยู่ด้วยกัน',
        'หย่าร้าง',
        'แยกกันอยู่',
        'แต่งงานใหม่',
        'เสียชีวิต'
      ],
      itemsWork: ['อาจารย์', 'ข้าราชการ', 'ลูกจ้างประจำ']
    }
  },
  methods: {
    back() {
      this.tab = 'addressData'
      // 
      this.$emit('saveFamily', this.familyData, this.tab)
    },
    save() {
      // 
      this.tab = 'withdrawData'
      this.$emit('saveFamily', this.familyData, this.tab)
    }
  }
}
</script>

<style lang="scss" scoped></style>
