<template>
  <v-card-text>
    <h3>ข้อมูลผู้ปกครอง</h3>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="FamilyData.father.fname"
              dense
              outlined
              label="ชื่อ (บิดา)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="FamilyData.father.fsername"
              dense
              outlined
              label="นามสกุล (บิดา)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="2">
            <v-text-field
              v-model="FamilyData.father.fage"
              dense
              outlined
              label="อายุ"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="6">
            <v-select
              v-model="FamilyData.mstatus"
              :items="itemsMstatus"
              dense
              outlined
              label="สถานะภาพ (*หากเสียชีวิตแล้วไม่ต้องตอบเรื่องอาชีพ)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-select
              v-model="FamilyData.father.feducation"
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
              v-model="FamilyData.father.fwork"
              :items="itemsWork"
              dense
              outlined
              label="ประเภทของงาน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="FamilyData.father.fcareer"
              dense
              outlined
              label="อาชีพ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.father.fpost"
              dense
              outlined
              label="ตำแหน่ง"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.father.fbeloin"
              dense
              outlined
              label="สังกัด"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="12">
            <v-textarea
              v-model="FamilyData.father.officeAddress.fatwork"
              label="สถานที่ทำงานของบิดา"
              auto-grow
              outlined
              rows="3"
              row-height="40"
            ></v-textarea
          ></v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.father.officeAddress.ftell"
              dense
              outlined
              label="เบอร์โทรศัพท์ที่ทำงาน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.father.fphone"
              dense
              outlined
              label="เบอร์โทรศัพท์มือถือ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.father.fsalary"
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
              v-model="FamilyData.mather.mname"
              dense
              outlined
              label="ชื่อ (มารดา)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="FamilyData.mather.msername"
              dense
              outlined
              label="นามสกุล (มารดา)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="2">
            <v-text-field
              v-model="FamilyData.mather.mage"
              dense
              outlined
              label="อายุ"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="6">
            <v-select
              v-model="FamilyData.mather.meducation"
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
              v-model="FamilyData.mather.mwork"
              :items="itemsWork"
              dense
              outlined
              label="ประเภทของงาน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="FamilyData.mather.mcareer"
              dense
              outlined
              label="อาชีพ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.mather.mpost"
              dense
              outlined
              label="ตำแหน่ง"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.mather.mbeloin"
              dense
              outlined
              label="สังกัด"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="12">
            <v-textarea
              v-model="FamilyData.mather.officeAddress.matwork"
              label="สถานที่ทำงานของมารดา"
              auto-grow
              outlined
              rows="3"
              row-height="40"
            ></v-textarea
          ></v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.mather.officeAddress.mtell"
              dense
              outlined
              label="เบอร์โทรศัพท์ที่ทำงาน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.mather.mphone"
              dense
              outlined
              label="เบอร์โทรศัพท์มือถือ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="FamilyData.mather.msalary"
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
              v-model="FamilyData.sibling"
              dense
              outlined
              label="พี่น้องร่วมบิดา/มารดาที่เรียนโรงเรียนสาธิต(มอดินแดง)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="8">
            <v-text-field
              v-model="FamilyData.sibling1"
              dense
              outlined
              label="ประกอบกด้วย 1"
            />
            <v-text-field
              v-model="FamilyData.sibling2"
              dense
              outlined
              label="ประกอบกด้วย 2"
            />
            <v-text-field
              v-model="FamilyData.sibling3"
              dense
              outlined
              label="ประกอบกด้วย 2"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="4">
            <v-text-field
              v-model="FamilyData.sbclass1"
              dense
              outlined
              label="จำนวน"
            />
            <v-text-field
              v-model="FamilyData.sbclass2"
              dense
              outlined
              label="จำนวน"
            />
            <v-text-field
              v-model="FamilyData.sbclass3"
              dense
              outlined
              label="จำนวน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="12">
            <v-text-field
              v-model="FamilyData.contact"
              dense
              outlined
              label="กรณีฉุกเฉินติดต่อ"
            />
            <v-text-field
              v-model="FamilyData.related"
              dense
              outlined
              label="เกี่ยวข้องเป็น"
            />
            <v-text-field
              v-model="FamilyData.ctell"
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
  data() {
    return {
      tab: '',
      FamilyData: {
        father: {
          fname: '',
          fsername: '',
          fage: '',
          feducation: '',
          fwork: '',
          fcareer: '',
          fpost: '',
          fbeloin: '',
          officeAddress: {
            fatwork: '',
            ftell: ''
          },
          fphone: '',
          fsalary: ''
        },
        mather: {
          mname: '',
          msername: '',
          mage: '',
          meducation: '',
          mwork: '',
          mcareer: '',
          mpost: '',
          mbeloin: '',
          officeAddress: {
            matwork: '',
            mtell: ''
          },
          mphone: '',
          msalary: ''
        },
        mstatus: '',
        sibling: '',
        sibling1: '',
        sibling2: '',
        sibling3: '',
        sbclass1: '',
        sbclass2: '',
        sbclass3: '',
        contact: '',
        related: '',
        ctell: ''
      },
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
      console.log('black', this.tab)
      this.$emit('saveFamily', this.FamilyData, this.tab)
    },
    save() {
      console.log('go')
      this.tab = 'withdrawData'
      this.$emit('saveFamily', this.FamilyData, this.tab)
    }
  }
}
</script>

<style lang="scss" scoped></style>
