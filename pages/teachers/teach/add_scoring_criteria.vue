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
                  />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 3.5</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g3_5"
                    label="คะแนน"
                    outlined
                    type="number"
                  />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 3</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g3"
                    label="คะแนน"
                    outlined
                    type="number"
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
                  />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 2</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g2"
                    label="คะแนน"
                    outlined
                    type="number"
                  />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 1.5</v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="grade.g1_5"
                    label="คะแนน"
                    outlined
                    type="number"
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
                  />
                </v-col>
                <v-col cols="6">
                  <v-btn class="success mb-5" @click="saveScoringCriteria()"
                    >บันทึก</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-divider></v-divider>
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <v-col cols="2">
                <h3>การเก็บคะแนน</h3>
              </v-col>
            </v-row>
            <v-row justify="center" align-content="center">
              <v-col cols="12">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">หัวข้อ</th>
                        <th class="text-center">คะแนน</th>
                        <th class="text-center">สัดส่วน</th>
                        <th class="text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody class="text-center">
                      <tr>
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
                          <v-icon
                            color="green"
                            class="mr-2"
                            @click="addRatingTest"
                            >mdi-note-plus-outline</v-icon
                          >
                        </td>
                      </tr>
                      <tr v-for="item in part_rating" :key="item.index">
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                v-model="item.name"
                                solo
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                v-model="item.score"
                                solo
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          <v-row align="center" justify="center">
                            <v-col cols="8" class="mt-5">
                              <v-text-field
                                v-model="item.rating"
                                solo
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          <v-icon small class="mr-2">mdi-pencil</v-icon>
                          <v-icon
                            small
                            color="red"
                            class="mr-2"
                            @click="deleteRateingTest"
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
    //get teach by subjects
    await this.getTeachByTeacherId().then(result => (this.items = result));
    await this.getRating(this.items);
  },
  data() {
    return {
      title: "เกณฑ์การให้คะแนน",
      rating: [],
      score_criteria: { name: "", score: "", rating: "" },
      items: "",
      part_rating: [],
      part_rating: [],
      part_num: "",
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
    async addRatingToTach(teach) {
      const response = await this.$store.dispatch(`teach/updateTeach`, teach);
      console.log("response addRatingToTach", response);
      // if (response) {
      //   alert("บันทึกสำเร็จ");
      // }
    },
    async getRating(item) {
      console.log("criteria", this.grade);
      console.log("this rating", item[0].rating);
      if (item[0].rating) {
        this.grade = item[0].criteria;
        this.part_num = item[0].rating.length;
        this.part_rating = item[0].rating;
      }
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
    close() {
      this.dialog = false;
      this.part_num = "";
      setTimeout(() => {}, 300);
    },
    back() {
      this.$router.go(-1);
      console.log("back");
    },
    deleteRateingTest(item) {
      const index = this.part_rating.indexOf(item);
      if (confirm("ยืนยีนการลบข้อมูล")) {
      const teach = {
        objectId: this.$route.query.id,
        rating: this.part_rating
      };
      this.addRatingToTach(teach);
      this.part_rating.splice(index, 1);
      }
    },
    addRatingTest() {
      this.part_rating.push({
        name: this.score_criteria.name,
        score: this.score_criteria.score,
        rating: this.score_criteria.rating
      });
      console.log("add rating", this.part_rating);
       const teach = {
        objectId: this.$route.query.id,
        rating: this.part_rating
      };
      this.addRatingToTach(teach);
    }
  }
};
</script>

<style lang="scss" scoped></style>
