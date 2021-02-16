<template>
  <v-card-text>
    <h3>ข้อมูลส่วนตัว</h3>
    <v-form ref="form" validation>
    <v-row>
      <v-col cols="12">
        <v-row justify="center">
              <v-col v-if="!personalData.profileBase64" class="pt-0 pb-0" cols="12">
                <v-row justify="center">
                  <v-col class="pt-0 pb-0" cols="4">
                    <v-file-input v-model="profile" @change="handleImage" label="รูป" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="!!personalData.profileBase64" class="pt-0" cols="4" offset="1">
               <v-row>
                  <v-col class="pt-0 pb-0 text-center" cols="6">
                    <v-img :src="personalData.profileBase64" max-width="200" />
                    <v-btn color="error" class="mt-5" @click="removeprofile" >ลบรูป</v-btn>
                  </v-col>
                </v-row>
              </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="3">
            <v-select
              v-model="personalData.tth"
              :items="itemsTiteThai"
              dense
              outlined
              label="คำนำหน้า (ภาษาไทย)"
              required
              :rules="[v => !!v || 'เลือกคำนำหน้า']"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="4">
            <v-text-field
              v-model="personalData.namet"
              dense
              outlined
              label="ชื่อ (ภาษาไทย)"
              required
              :rules="[v => !!v || 'กรุณากรอกชื่อภาษาไทย']"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="personalData.snamet"
              dense
              outlined
              label="นามสกุล (ภาษาไทย)"
              required
              :rules="[v => !!v || 'กรุณากรอกนามสกุลภาษาไทย']"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="3">
            <v-select
              v-model="personalData.ten"
              :items="itemsTiteEng"
              dense
              outlined
              label="คำนำหน้า (ภาษาอังกฤษ)"
              required
              :rules="[v => !!v || 'กรุณาเลือกคำนำหน้า (ภาษาอังกฤษ)']"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="4">
            <v-text-field
              v-model="personalData.namee"
              dense
              outlined
              label="ชื่อ (ภาษาอังกฤษ)"
              required
              :rules="[v => !!v || 'กรุณากรอกชื่อภาษาอังกฤษ']"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="personalData.snamee"
              dense
              outlined
              label="นามสกุล (ภาษาอังกฤษ)"
              required
              :rules="[v => !!v || 'กรุณากรอกนามสกุลภาษาอังกฤษ']"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="8">
            <v-text-field
              v-model="personalData.nickName"
              dense
              outlined
              label="ชื่อเล่น"
              required
              :rules="[v => !!v || 'กรุณากรอกชื่อเล่น']"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="4">
            <v-select
              v-model="personalData.sex"
              :items="itemsSex"
              dense
              outlined
              label="เพศ"
              required
              :rules="[v => !!v || 'กรุณาเลือกเพศ']"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="personalData.idstd"
          dense
          outlined
          label="รหัสนักเรียน (* รหัสประจำตัวใหม่จากประกาศ 6 หลัก)"
          required
          :rules="[v => !!v || 'กรุณากรอกรหัสนักเรียน']"
        />

        <v-row>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="personalData.course"
              dense
              outlined
              label="หลักสูตร"
              required
              :rules="[v => !!v || 'กรุณากรอกหลักสูตร']"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-select
              v-model="personalData.class"
              :items="itemsLevel"
              dense
              outlined
              label="ระดับชั้น"
              required
              :rules="[v => !!v || 'กรุณาเลือกระดับชั้น']"              
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="personalData.study"
          dense
          outlined
          label="จบชั้น ป.6 จากโรงเรียน"
          required
          :rules="[v => !!v || 'กรุณากรอกข้อมูล จบชั้น ป.6 จากโรงเรียน']"                   
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="personalData.idCard"
          dense
          outlined
          label="รหัสประจำตัวประชาชน"
          required
          :rules="[v => !!v || 'กรุณากรอกข้อมูล รหัสประจำตัวประชาชน']"     
        />
        <v-row>
          <v-col class="pt-0 pb-0" cols="3">
            <v-text-field
              v-model="personalData.stage"
              dense
              outlined
              label="อายุ (ปี)"
              required
              :rules="[v => !!v || 'กรุณากรอกข้อมูล อายุ']"   
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="3">
            <v-text-field
              v-model="personalData.stmonth"
              dense
              outlined
              label="เดือน"
              required
              :rules="[v => !!v || 'กรุณากรอกข้อมูล เดือน']"   
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="3">
            <v-text-field
              v-model="personalData.nation"
              dense
              outlined
              label="สัญชาติ"
              required
              :rules="[v => !!v || 'กรุณากรอกข้อมูล สัญชาติ']"   
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="3">
            <v-text-field
              v-model="personalData.race"
              dense
              outlined
              label="เชื้อสาย"
              required
              :rules="[v => !!v || 'กรุณากรอกข้อมูล เชื้อสาย']"   
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="personalData.religian"
              dense
              outlined
              label="ศาสนา"
              required
              :rules="[v => !!v || 'กรุณากรอกข้อมูล ศาสนา']"                 
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-menu
              v-model="fromDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  label="วัน/เดือน/ปี เกิด"
                  outlined
                  readonly
                  :value="fromDateDisp"
                  v-on="on"
                  required
                  :rules="[v => !!v || 'กรุณากรอกเลือก วัน/เดือน/ปี/ เกิด']"         
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="personalData.bday"
                locale="en-in"
                no-title
                @input="fromDateMenu = false"
              ></v-date-picker>
            </v-menu>
            <!-- <v-text-field dense outlined label="วัน/เดือน/ปีเกิด (พ.ศ.)" /> -->
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="personalData.badd"
              dense
              outlined
              label="สถานที่เกิด"
              required
              :rules="[v => !!v || 'กรุณากรอกกรอกข้อมูล สถานที่เกิด']"                    
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="personalData.bprovince"
              dense
              outlined
              label="จังหวัดที่เกิด"
              required
              :rules="[v => !!v || 'กรุณากรอกกรอกข้อมูล จังหวัดที่เกิด']"                        
            />
          </v-col>
        </v-row>
      </v-col>

      <v-row justify="end">
        <div class="mb-5 mr-7">
          <v-btn color="primary" depressed large @click="save">ถัดไป</v-btn>
        </div>
      </v-row>
    </v-row>
    </v-form>
  </v-card-text>
</template>

<script>

export default {
  name: 'PersonalFrom',
  props: {
    personalData: {
      type: Object
    }
  },
  mounted () {
    // console.log('props', this.personalData)
    // this.profileBase64 = this.personalData.this.profileBase64
  },
  data() {
    return {
      tab: 'addressData',
      itemsTiteThai: ['เด็กชาย', 'เด็กหญิง', 'นาย', 'นางสาว'],
      itemsTiteEng: ['Master', 'Miss', 'Mr'],
      itemsSex: ['ชาย', 'หญิง'],
      itemsLevel: ['ม.1', 'ม.2','ม.3','ม.4','ม.5','ม.6'],
      fromDateMenu: false,
      profile: {},
    }
  },
  computed: {
    fromDateDisp() {
      return this.personalData.bday
    }
  },
  methods: {
    async handleImage(e) {
      if(!!this.profile && this.profile.type) {
        const type = this.profile.type.split('/')[0]
        if(type === 'image') {
          const reader = new FileReader
          reader.readAsDataURL(this.profile)
          reader.onload = () => {
            // console.log('reader', reader.result)
            this.personalData.profileBase64 =  reader.result
          }
          reader.onerror = error => console.log(error)
        }
      }

    },
    async removeprofile() {
      if(confirm(`ต้องการลบโลโก้`)) {
        this.profile = ``
        // console.log('personalData', this.personalData.profileBase64)
        this.personalData.profileBase64 = ``
      }
    },
    save() {
      if(this.$refs.form.validate()){
        this.$emit('savePersonal', this.personalData, this.tab)
      }
      
    }
  }
}
</script>
