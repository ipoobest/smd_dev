<template>
  <v-card-text>
    <h3 align="center">ข้อมูลที่อยู่อาศัย</h3>
    <v-row>
      <v-col cols="12">
        <v-row justify="center">
          <v-col class="pt-0 pb-0" cols="8">
            <v-select
              v-model="addressData.residential"
              :items="itemResidence"
              dense
              outlined
              label="ประเภทที่อยู่อาศัย"
            />
            <v-textarea
              v-model="addressData.domicile"
              label="ภูมิลำเนา"
              auto-grow
              outlined
              rows="3"
              row-height="25"
            ></v-textarea>
            <v-textarea
              v-model="addressData.dorm"
              label="หอพัก"
              auto-grow
              outlined
              rows="3"
              row-height="25"
            ></v-textarea>
            <v-text-field
              v-model="addressData.stell"
              dense
              outlined
              label="หมายเลขโทรศัพท์"
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
  name: 'AddressForm',
  props: {
    addressData: {
      type: Object
    }
  },
  data() {
    return {
      tab: '',
      itemResidence: ['บ้าน', 'หอพัก']
    }
  },
  methods: {
    back() {
      this.tab = 'personalData'
      // 
      this.$emit('saveAddress', this.addressData, this.tab)
    },
    save() {
      // 
      this.tab = 'familyData'
      this.$emit('saveAddress', this.addressData, this.tab)
    }
  }
}
</script>

<style lang="scss" scoped></style>
