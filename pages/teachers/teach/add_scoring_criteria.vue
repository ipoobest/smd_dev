<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }}
            <!-- วิชา {{items[0].sname}}  ปีการศึกษา {{items[0].schoolYear}}  เทอม {{items[0].term}} -->
            <v-spacer></v-spacer>
          </v-card-title>
          <v-divider></v-divider>
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <v-col cols="2">
                <h3>การเก็บคะแนน</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-row justify="end">
                  <v-btn class="info mr-5" v-if="!edit_mode" @click="editMode"
                    >แก้ไข</v-btn
                  >
                  <div v-else>
                    <v-btn class="success mr-5" @click="saveRating"
                      >บันทึก</v-btn
                    >
                    <v-btn
                      class="error  mr-5"
                      v-if="edit_mode"
                      @click="editMode"
                      >ยกเลิก</v-btn
                    >
                  </div>
                </v-row>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">หัวข้อ</th>
                        <th class="text-center">คะแนน</th>
                        <th class="text-center">ร้อยละ</th>
                        <th v-if="edit_mode == true" class="text-center">
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody class="text-center">
                      <tr v-if="edit_mode == true">
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                v-model="score_criteria.name"
                                solo
                                label="หัวข้อ"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                v-model="score_criteria.score"
                                solo
                                label="คะแนน"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                v-model="score_criteria.rating"
                                label="สัดส่วน"
                                solo
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          <v-icon color="green" class="mr-2" @click="addRating"
                            >mdi-note-plus-outline</v-icon
                          >
                        </td>
                      </tr>
                      <!-- <tr v-for="item in part_rating" :key="item.index"> -->
                      <tr v-for="(rating, index) in part_rating" :key="index">
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                :disabled="!edit_mode"
                                v-model="rating.name"
                                solo
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                :disabled="!edit_mode"
                                v-model="rating.score"
                                solo
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                :disabled="!edit_mode"
                                v-model="rating.rating"
                                solo
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td v-if="edit_mode == true">
                          <v-icon
                            small
                            color="red"
                            class="mr-2"
                            @click="deleteRating(index)"
                            >mdi-delete</v-icon
                          >
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  layout: "teacher",
  async mounted() {
    this.edit_mode = false;
    //get teach by subjects
    await this.getTeachByTeacherId().then(result => (this.items = result));
    await this.getRating(this.items);
    await this.getGradeList().then(result => (this.grade_list = result));
    await this.getCriteria().then(result => (this.grade = result));
    console.log("this edit mote", this.edit_mode);
  },
  data() {
    return {
      title: "เกณฑ์การให้คะแนน",
      rating: [],
      score_criteria: { name: "", score: "", rating: "" },
      items: "",
      part_rating: [],
      part_num: "",
      edit_mode: true,
      grade_list: [],
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
    async getTeachByTeacherId() {
      const data = {
        objectId: this.$route.query.id
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByTeacherId`,
        data
      );
      console.log("response getTeachByTeacherId", response.results);
      return response.results;
    },
    async getGradeList() {
      const conditions = {
        teachId: this.items[0].objectId
      };
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );
      console.log("getGradeList", response);
      return response.results;
    },
    async getCriteria() {
      const response = await this.$store.dispatch(`criteria/getCriteria`);
      console.log("response", response.results[0]);
      return response.results[0].criteria;
    },
    async addRatingToTach(teach) {
      const response = await this.$store.dispatch(`teach/updateTeach`, teach);
      console.log("response addRatingToTach", response);
      if (response) {
        alert("บันทึกสำเร็จ");
      }
    },
    async getRating(item) {
      console.log("criteria", this.grade);
      console.log("this rating", item[0].rating);
      if (item[0].rating) {
        this.part_num = item[0].rating.length;
        this.part_rating = item[0].rating;
      }
      // if (item[0].criteria) {
      //   this.grade = item[0].criteria;
      // }analytical_score_num
    },
    async updateGrade(objectId, score_array) {
      const data = {
        objectId: objectId,
        score: score_array
      };
      console.log("score", data);
      const response = await this.$store.dispatch(`grade/updateGrade`, data);
      console.log("response");
    },
    saveScoringCriteria() {
      const data = {
        objectId: this.$route.query.id,
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
      console.log("คะแนน", data);
      this.addRatingToTach(data);
    },
    editMode() {
      if (this.edit_mode) {
        this.edit_mode = false;
      } else {
        this.edit_mode = true;
      }
    },
    close() {
      this.dialog = false;
      this.part_num = "";
      setTimeout(() => {}, 300);
    },
    back() {
      this.$router.go(-1);
      console.log("back");
    },
    deleteRating(index) {
      // const index = this.part_rating.indexOf(item);
      if (confirm("ยืนยีนการลบข้อมูล")) {
        this.part_rating.splice(index, 1);
        const teach = {
          objectId: this.$route.query.id,
          rating: this.part_rating
        };
        this.addRatingToTach(teach);
        this.grade_list.forEach(grade => {
          var grade_id = grade.objectId;
          // console.log('update grade.score', grade.score)
          // update score ตารางเกรด
          this.updateGrade(grade.objectId, grade.score);
          grade.score.splice(index, 1);
        });
      }
    },
    // this.part_rating.splice(index, 1);

    addRating() {
      var sum = 0;
      var sum_array = [];
      this.part_rating.push({
        name: this.score_criteria.name,
        score: this.score_criteria.score,
        rating: this.score_criteria.rating
      });
    },

    saveRating() {
      this.editMode();
      var sum = 0;
      var sum_array = [];
      this.part_rating.forEach(item => {
        sum_array.push(parseInt(item.rating));
      });
      sum = sum_array.reduce((a, b) => a + b);
      console.log("add rating", sum);
      if (sum != 100) {
        alert("กรุณาทำสัดส่วนให้เท่ากับ 100");
        this.part_rating.splice(-1, 1);
        return;
      } else {
        const teach = {
          objectId: this.$route.query.id,
          rating: this.part_rating
        };
        this.addRatingToTach(teach);
        this.grade_list.forEach(grade => {
          var grade_id = grade.objectId;
          grade.score.push(0);
          this.updateGrade(grade.objectId, grade.score);
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
