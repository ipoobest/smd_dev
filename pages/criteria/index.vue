<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <!-- {{ title }}   -->
            <!-- วิชา {{items[0].sname}}  ปีการศึกษา {{items[0].schoolYear}}  เทอม {{items[0].term}} -->
            <v-spacer></v-spacer>
          </v-card-title>
          <v-row justify="center">
            <h3>เกณฑ์ตัดเกรด</h3>
          </v-row>
          <v-form ref="form" validation>
            <v-container fill-height fluid>
              <v-row align="center" justify="center">
                <v-col cols="1" class="text-center">เกรด 4</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g4"
                    label="คะแนน"
                    outlined
                    type="number"
                    :disabled="disable"
                  />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 3.5</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g3_5"
                    label="คะแนน"
                    outlined
                    type="number"
                    :disabled="disable"
                  />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 3</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g3"
                    label="คะแนน"
                    outlined
                    type="number"
                    :disabled="disable"
                  />
                </v-col>
              </v-row>
              <v-row align="center" justify="center">
                <v-col cols="1" class="text-center">เกรด 2.5</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g2_5"
                    label="คะแนน"
                    outlined
                    type="number"
                    :disabled="disable"
                  />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 2</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g2"
                    label="คะแนน"
                    outlined
                    type="number"
                    :disabled="disable"
                  />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 1.5</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g1_5"
                    label="คะแนน"
                    outlined
                    type="number"
                    :disabled="disable"
                  />
                </v-col>
              </v-row>
              <v-row align="center" justify="center">
                <v-col cols="1" class="text-center">เกรด 1</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g1"
                    label="คะแนน"
                    outlined
                    type="number"
                    :disabled="disable"
                  />
                </v-col>
                <v-col cols="6">
                  <v-btn
                    v-if="disable"
                    color="orange"
                    dark
                    class="mb-5"
                    @click="updateCrieria()"
                    >แก้ไข</v-btn
                  >
                     <v-btn 
                    v-else
                    class="success mb-5" @click="createCriteria()"
                    >บันทึก</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  async mounted() {
    await this.getCrieria().then(result => (this.grade = result));
  },
  data() {
    return {
      disable: true,
      title: "เกณฑ์ตัดเกรด",
      grade: {
        g4: 0,
        g3_5: 0,
        g3: 0,
        g2_5: 0,
        g2: 0,
        g1_5: 0,
        g1: 0
      }
    };
  },
  methods: {
    async createCriteria() {
      this.disable = !this.disable
      const data = {
        objectId: 'pLbCbv1nsr',
        criteria: {
          g4: this.grade.g4,
          g3_5: this.grade.g3_5,
          g3: this.grade.g3,
          g2_5: this.grade.g2_5,
          g2: this.grade.g2,
          g1_5: this.grade.g1_5,
          g1: this.grade.g1
        }
      };
      const response = await this.$store.dispatch(
        `criteria/updateCriteria`,
        data
      );
      console.log("response addRatingToTach", response);
      if (response) {
        alert("บันทึกสำเร็จ");
      }
    },
    async getCrieria() {
      const response = await this.$store.dispatch(`criteria/getCriteria`);
      console.log("response", response.results[0]);
      return response.results[0].criteria;
    },
    updateCrieria() {
      this.disable = !this.disable
    },
    back() {
      this.$router.go(-1);
      console.log("back");
    }
  }
};
</script>

<style lang="scss" scoped></style>
