<template>
  <v-card-text>
    <h3>ข้อมูลส่วนตัว</h3>
    <v-row>
      <v-col cols="12">
        <v-row justify="center">
          <v-col class="pt-0 pb-0" cols="2">
            <UploadProfile v-model="personalData.profile">
              <div slot="activator">
                <v-avatar
                  v-if="!personalData.profile"
                  v-ripple
                  size="150px"
                  class="grey lighten-3 mb-3"
                >
                  <span>คลิกเพื่ออัพโหลดรูปภาพ</span>
                </v-avatar>
                <v-avatar v-else v-ripple size="150px" class="mb-3">
                  <img :src="personalData.profile.imageURL" alt="profile" />
                </v-avatar>
              </div>
            </UploadProfile>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="2">
            <v-select
              v-model="personalData.tth"
              :items="itemsTiteThai"
              dense
              outlined
              label="คำนำหน้า (ภาษาไทย)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="personalData.namet"
              dense
              outlined
              label="ชื่อ (ภาษาไทย)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="personalData.snamet"
              dense
              outlined
              label="นามสกุล (ภาษาไทย)"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <v-row>
          <v-col class="pt-0 pb-0" cols="2">
            <v-select
              v-model="personalData.ten"
              :items="itemsTiteEng"
              dense
              outlined
              label="คำนำหน้า (ภาษาอังกฤษ)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="personalData.namee"
              dense
              outlined
              label="ชื่อ (ภาษาอังกฤษ)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="5">
            <v-text-field
              v-model="personalData.snamee"
              dense
              outlined
              label="นามสกุล (ภาษาอังกฤษ)"
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
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="4">
            <v-select
              v-model="personalData.sex"
              :items="itemsSex"
              dense
              outlined
              label="เพศ"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="personalData.idstd"
          dense
          outlined
          label="รหัสนักเรียน (* รหัสประจำตัวใหม่จากประกาศ 6 หลัก)"
        />

        <v-row>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="personalData.course"
              dense
              outlined
              label="หลักสูตร"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-select
              v-model="personalData.class"
              :items="itemsLevel"
              dense
              outlined
              label="ระดับชั้น"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="personalData.study"
          dense
          outlined
          label="จบชั้น ป.6 จากโรงเรียน"
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="personalData.idCard"
          dense
          outlined
          label="รหัสประจำตัวประชาชน"
        />
        <v-row>
          <v-col class="pt-0 pb-0" cols="3">
            <v-text-field
              v-model="personalData.stage"
              dense
              outlined
              label="อายุ (ปี)"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="3">
            <v-text-field
              v-model="personalData.stmonth"
              dense
              outlined
              label="เดือน"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="3">
            <v-text-field
              v-model="personalData.nation"
              dense
              outlined
              label="สัญชาติ"
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="3">
            <v-text-field
              v-model="personalData.race"
              dense
              outlined
              label="เชื้อสาย"
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
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-menu
              v-model="fromDateMenu"
              :close-on-content-click="false"
              lazy
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
            />
          </v-col>
          <v-col class="pt-0 pb-0" cols="6">
            <v-text-field
              v-model="personalData.bprovince"
              dense
              outlined
              label="จังหวัดที่เกิด"
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
  </v-card-text>
</template>

<script>
import UploadProfile from './UploadProfile'
export default {
  name: 'PersonalFrom',
  components: {
    UploadProfile
  },
  data() {
    return {
      tab: 'addressData',
      personalData: {
        tth: '',
        namet: '',
        snamet: '',
        nickName: '',
        sex: '',
        idstd: '',
        course: '',
        class: '',
        study: '',
        ten: '',
        namee: '',
        snamee: '',
        idCard: '',
        stage: '',
        stmonth: '',
        nation: '',
        race: '',
        religian: '',
        bday: '',
        badd: '',
        bprovince: '',
        profile: null,
        saving: false,
        saved: false
      },
      itemsTiteThai: ['เด็กชาย', 'เด็กหญิง', 'นาย', 'นางสาว'],
      itemsTiteEng: ['Master', 'Miss', 'Mr'],
      itemsSex: ['ชาย', 'หญิง'],
      itemsLevel: ['ม.1', 'ม.2','ม.3','ม.4','ม.5','ม.6'],
      fromDateMenu: false
    }
  },
  computed: {
    fromDateDisp() {
      return this.personalData.bday
      // format date, apply validations, etc. Example below.
    }
  },
  watch: {
    avatar: {
      handler() {
        this.saved = false
      },
      deep: true
    }
  },
  methods: {
    uploadImage() {
      this.saving = true
      setTimeout(() => this.savedAvatar(), 1000)
    },
    savedAvatar() {
      this.saving = false
      this.saved = true
    },
    save() {
      // console.log('title ', this.personalData.birth)
      this.$emit('savePersonal', this.personalData, this.tab)
    }
  }
}
</script>
