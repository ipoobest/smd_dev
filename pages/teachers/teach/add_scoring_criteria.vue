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
            <v-spacer></v-spacer>
          </v-card-title>
          <v-form ref="form" validation>
            <v-container fill-height fluid>
              <v-row align="center" justify="center">
                <v-col cols="1" class="text-center">เกรด 4</v-col>
                <v-col cols="2">
                  <v-text-field label="คะแนน" outlined type="number" />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 3.5</v-col>
                <v-col cols="2">
                  <v-text-field label="คะแนน" outlined type="number" />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 3</v-col>
                <v-col cols="2">
                  <v-text-field label="คะแนน" outlined type="number" />
                </v-col>
              </v-row>
              <v-row align="center" justify="center">
                <v-col cols="1" class="text-center">เกรด 2.5</v-col>
                <v-col cols="2">
                  <v-text-field label="คะแนน" outlined type="number" />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 2</v-col>
                <v-col cols="2">
                  <v-text-field label="คะแนน" outlined type="number" />
                </v-col>
                <v-col cols="1" class="text-center">เกรด 1.5</v-col>
                <v-col cols="2">
                  <v-text-field label="คะแนน" outlined type="number" />
                </v-col>
              </v-row>
              <v-row align="center" justify="center">
                <v-col cols="1" class="text-center">เกรด 1</v-col>
                <v-col cols="2">
                  <v-text-field label="คะแนน" outlined type="number" />
                </v-col>
                <v-col cols="6">
                  <v-btn class="info mb-5">ตกลง</v-btn>
                </v-col>
              </v-row>              
                
            </v-container>
          </v-form>
          <v-divider></v-divider>
          <v-form ref="form" validation>
            <v-container fill-height fluid>
              <v-row align="center" justify="center">
                <v-col cols="2">
                  <h3>การเก็บคะแนน</h3>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="part_num"
                    type="number"
                    required
                    :rules="[v => !!v || 'กรุณากรอก จำนวนการเก็บคะแนน']"
                  />
                </v-col>
                <v-col cols="2">
                  <h3>ส่วน</h3>
                </v-col>
                <v-col cols="2">
                  <v-btn class="info" @click="addPartNumber">ตกลง</v-btn>
                </v-col>
              </v-row>
              <v-container fill-height fluid>
                <v-row
                  justify="center"
                  v-for="item in part_rating"
                  :key="item.id"
                >
                  <v-col cols="12" md="3">
                    <v-text-field
                      class="mr-2"
                      v-model="item.name"
                      label="หัวข้อ"
                      outlined
                      type="text"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      class="mr-2"
                      v-model="item.score"
                      label="คะแนน"
                      outlined
                      type="number"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="item.rating"
                      label="สัดส่วน %"
                      outlined
                      type="number"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-container>
          </v-form>
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
  },
  data() {
    return {
      title: "เกณฑ์การให้คะแนน",
      rating: [],
      items: "",
      part_rating: [],
      part_num: ""
    };
  },
  methods: {
    async getTeachByTeacherId() {
      const data = {
        //  'schoolYear': this.$route.query.schoolYear,
        //  'term': this.$route.query.term,
        //  'teacher.value': this.$route.query.id,
        objectId: this.$route.query.id
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByTeacherId`,
        data
      );
      console.log("response getTeachByTeacherId", response);
      return response.results;
    },
    addPartNumber() {
      this.part_rating = [];
      for (var index = 0; index < this.part_num; index++) {
        this.part_rating.push({ name: "", rating: 0 });
      }
      console.log("length", this.part_point);
    },
    save() {
      var rating = this.part_rating.map(result => parseInt(result.rating));

      var sum = rating.reduce((a, b) => a + b);
      sum != 100 ? alert("กรุณาทำให้ผลรวม") : null;

      const teach = {
        objectId: this.teach.objectId,
        rating: this.part_rating
      };
      console.log("item ob", teach);
      this.addRatingToTach(teach);
      this.close();
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
    goToAddScore(item) {
      this.$router.push({
        name: "teachers-teach-add_scoring_criteria",
        query: {
          id: item.objectId,
          schoolYear: item.schoolYear,
          term: item.term,
          classRoomLevel: item.classRoomLevel,
          classRoomName: item.classRoomName
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
