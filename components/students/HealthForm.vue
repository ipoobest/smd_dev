<template>
  <v-card-text>
    <h3>ข้อมูลสุขภาพ</h3>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col class="pt-0 pb-0" cols="2">
            <v-text-field
              v-model="healthData.blood"
              dense
              outlined
              label="หมู่เลือด"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="4">
            <v-textarea
              v-model="healthData.disease"
              dense
              auto-grow
              outlined
              rows="3"
              row-height="40"
              label="โรคประจำตัว / แพ้ยา"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="4">
            <v-textarea
              v-model="healthData.treatment"
              dense
              auto-grow
              outlined
              rows="3"
              row-height="40"
              label="วิธีบำบัดเมื่อเกิดอาการ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="4">
            <v-textarea
              v-model="healthData.healthpb"
              dense
              auto-grow
              outlined
              rows="3"
              row-height="40"
              label="ปัญหาสุขภาพอื่นๆ"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="end">
      <div class="mb-5 mr-7">
        <v-btn color="orange" depressed large @click="back">ย้อนกลับ</v-btn>
        <v-btn color="success" depressed large @click="save">{{ buttonTitle }}</v-btn>
      </div>
    </v-row>
  </v-card-text>
</template>

<script>
export default {
  name: 'AddressForm',
  props: {
    healthData: {
      type: Object
    }
  },
  computed: {
    buttonTitle() {
      return this.healthData.objectId ? 'อัพเดท' : 'สร้าง'
    }
  },
  data() {
    return {
      // healthData: {
      //   blood: '',
      //   disease: '',
      //   treatment: '',
      //   healthpb: ''
      // }
    }
  },

  methods: {
    back() {
      this.tab = 'withdrawData'
      console.log('black', this.tab)
      this.$emit('saveHealth', this.healthData, this.tab)
    },
    save() {
      console.log('go')
      this.tab = 'healthData'
      this.$emit('saveHealth', this.healthData, this.tab)
    }
  }
}
</script>
