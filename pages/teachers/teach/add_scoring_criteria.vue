<template>
  <v-layout>
    <v-row align='center'>
      <v-col cols='12'>
        <v-card>
          <v-card-title>
            <v-btn class='mr-5' color='primary' fab small dark @click='back'>
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-form ref='form' validation>
            <v-container fill-height fluid>
              <v-row align='center' justify='center'>
                <v-col cols='1' class='text-center'>เกรด 4</v-col>
                <v-col cols='2'>
                  <v-text-field
                    v-model='grade.g4'
                    label='คะแนน'
                    outlined
                    type='number'
                  />
                </v-col>
                <v-col cols='1' class='text-center'>เกรด 3.5</v-col>
                <v-col cols='2'>
                  <v-text-field
                    v-model='grade.g3_5'
                    label='คะแนน'
                    outlined
                    type='number'
                  />
                </v-col>
                <v-col cols='1' class='text-center'>เกรด 3</v-col>
                <v-col cols='2'>
                  <v-text-field
                    v-model='grade.g3'
                    label='คะแนน'
                    outlined
                    type='number'
                  />
                </v-col>
              </v-row>
              <v-row align='center' justify='center'>
                <v-col cols='1' class='text-center'>เกรด 2.5</v-col>
                <v-col cols='2'>
                  <v-text-field
                    v-model='grade.g2_5'
                    label='คะแนน'
                    outlined
                    type='number'
                  />
                </v-col>
                <v-col cols='1' class='text-center'>เกรด 2</v-col>
                <v-col cols='2'>
                  <v-text-field
                    v-model='grade.g2'
                    label='คะแนน'
                    outlined
                    type='number'
                  />
                </v-col>
                <v-col cols='1' class='text-center'>เกรด 1.5</v-col>
                <v-col cols='2'>
                  <v-text-field
                    v-model='grade.g1_5'
                    label='คะแนน'
                    outlined
                    type='number'
                  />
                </v-col>
              </v-row>
              <v-row align='center' justify='center'>
                <v-col cols='1' class='text-center'>เกรด 1</v-col>
                <v-col cols='2'>
                  <v-text-field
                    v-model='grade.g1'
                    label='คะแนน'
                    outlined
                    type='number'
                  />
                </v-col>
                <v-col cols='6'>
                  <v-btn class='success mb-5' @click='saveScoringCriteria()'
                    >บันทึก</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-divider></v-divider>
          <v-form ref='form' validation>
            <v-container fill-height fluid>
              <v-row align='center' justify='center'>
                <v-col cols='2'>
                  <h3>การเก็บคะแนน</h3>
                </v-col>
                <v-col cols='3'>
                  <v-text-field
                    v-model='part_num'
                    type='number'
                    required
                    :rules="[v => !!v || 'กรุณากรอก จำนวนการเก็บคะแนน']"
                  />
                </v-col>
                <v-col cols='2'>
                  <h3>ส่วน</h3>
                </v-col>
                <v-col cols='1'>
                  <v-btn class='info' @click='addPartNumber'>ตกลง</v-btn>
                </v-col>
              </v-row>
              <v-container fill-height fluid>
                <v-row
                  justify='center'
                  v-for='item in part_rating'
                  :key='item.id'
                >
                  <v-col cols='4' md='3'>
                    <v-text-field
                      class='mr-2'
                      v-model='item.name'
                      label='หัวข้อ'
                      outlined
                      type='text'
                    />
                  </v-col>
                  <v-col cols='4' md='3'>
                    <v-text-field
                      class='mr-2'
                      v-model='item.score'
                      label='คะแนน'
                      outlined
                      type='number'
                    />
                  </v-col>
                  <v-col cols='4' md='3'>
                    <v-text-field
                      v-model='item.rating'
                      label='สัดส่วน %'
                      outlined
                      type='number'
                    />
                  </v-col>
                </v-row>
                <v-row justify='end'>
                  <v-col cols='4' md='3'>
                    <v-btn class='success' @click='saveRating'>บันทึก</v-btn>
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
  layout: 'teacher',
  async mounted() {
    //get teach by subjects
    await this.getTeachByTeacherId().then(result => (this.items = result));
    await this.getRating(this.items);
  },
  data() {
    return {
      title: 'เกณฑ์การให้คะแนน',
      rating: [],
      items: '',
      part_rating: [],
      part_num: '',
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
      console.log('response getTeachByTeacherId', response);
      return response.results;
    },
    async addRatingToTach(teach) {
      const response = await this.$store.dispatch(`teach/updateTeach`, teach);
      console.log('response addRatingToTach', response);
      if(response){
        alert('บันทึกสำเร็จ')
      }
    },
    async getRating(item) {
      console.log('criteria', this.grade);
      console.log('this rating', item[0].rating);
      if ( item[0].rating) {
        this.grade = item[0].criteria;
        this.part_num = item[0].rating.length;
        this.part_rating = item[0].rating;
      } 
    },
    addPartNumber() {
      this.part_rating = [];
      for (var index = 0; index < this.part_num; index++) {
        this.part_rating.push({ name: '', rating: 0 });
      }
      console.log('length', this.part_point);
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
      console.log('คะแนน', data);
      this.addRatingToTach(data);
    },
    saveRating() {
      var rating = this.part_rating.map(result => parseInt(result.rating));

      var sum = rating.reduce((a, b) => a + b);
      sum != 100 ? alert('กรุณาทำให้ผลรวมเป็น 100') : null;

      const teach = {
        objectId: this.$route.query.id,
        rating: this.part_rating
      };
      console.log('item ob', teach);
      this.addRatingToTach(teach);
    },
    close() {
      this.dialog = false;
      this.part_num = '';
      setTimeout(() => {}, 300);
    },
    back() {
      this.$router.go(-1);
      console.log('back');
    },
  }
};
</script>

<style lang='scss' scoped></style>
