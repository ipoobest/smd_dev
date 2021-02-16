<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ title }}
            <v-spacer></v-spacer>
            <v-col cols="2">
              <v-text-field
                v-model="year"
                required
                :rules="[v => !!v || 'กรุณากรอกปีการศึกษา']"
                label="ปีการศึกษา"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="term"
                required
                :rules="[v => !!v || 'กรุณากรอกเทอม']"
                label="เทอม"
              ></v-text-field>
            </v-col>
          </v-card-title>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>รหัสประจำตัวนักเรียน</th>
                  <th>เลขที่</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>ระดับชั้น</th>
                  <th>ห้อง</th>
                  <th class="text-right">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, key) in dataArr" :key="key">
                  <td>{{ item.idstd }}</td>
                  <td>{{ item.number }}</td>
                  <td>{{ `${item.tth} ${item.namet} ${item.snamet}` }}</td>
                  <td>{{ item.class }}</td>
                  <td>{{ item.room }}</td>
                  <td class="text-right">
                    <v-btn
                      color="error"
                      type="button"
                      @click="handleRemoveItem(item, key)"
                      >ลบ</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <!-- <v-btn @change="importExcel">import</v-btn> -->
          <v-row>
            <v-col cols="2">
              <!-- <v-file-input class="my_input" @change="importExcel" outlined dense ></v-file-input> -->
              <!-- Import button -->
              <div class="button_group">
                <a
                  href="javascript:;"
                  class="button_s my_file el-button button_s el-button--primary el-button--small"
                >
                  <input
                    type="file"
                    class="my_input"
                    @change="importExcel"
                    id="upload"
                  />เลือกไฟล์ .xlsx
                </a>
              </div>

              <!-- Import button -->
            </v-col>
            <v-col align="end" class="mr-3">
              <v-btn color="info" v-if="dataArr.length != 0" @click="uploadData"
                >upload</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import xlsx from "xlsx";

export default {
  middleware: "admin",
  data() {
    return {
      csv: [],
      dataArr: [],
      title: `นำเข้านักเรียน`,
      total: 0,
      year: "",
      term: "",
      test: []
    };
  },
  methods: {
    async createUser(username, password, type) {
      const data = {
        username,
        password,
        type
      };
      const response = await this.$store.dispatch(`users/createUser`, data);
      //  const response = await this.$store.dispatch(`students/createStudent`, object)

      
    },
    async createStudent(object) {
      // const response = await this.$store.dispatch(`users/createUser`, object);
      const response = await this.$store.dispatch(
        `students/createStudent`,
        object
      );

      
      return response;
    },
    getHeader(sheet) {
      const XLSX = xlsx;
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]); // worksheet['!ref'] Is the valid range of the worksheet
      let C;
      /* Get cell value start in the first row */
      const R = range.s.r; //Line / / column C
      let i = 0;
      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell =
          sheet[
            XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* Get the cell value based on the address  find the cell in the first row */
        var hdr = "UNKNOWN" + C; // replace with your desired default
        // XLSX.utils.format_cell Generate cell text value
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        if (hdr.indexOf("UNKNOWN") > -1) {
          if (!i) {
            hdr = "__EMPTY";
          } else {
            hdr = "__EMPTY_" + i;
          }
          i++;
        }
        headers.push(hdr);
      }
      return headers;
    },
    importExcel(e) {
      const files = e.target.files;
      
      if (!files.length) {
        return;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        return alert(
          "The upload format is incorrect. Please upload xls or xlsx format"
        );
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const XLSX = xlsx;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0];
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
          const excellist = [];
          // Edit data
          for (var i = 0; i < ws.length; i++) {
            excellist.push(ws[i]);
          }
          this.dataArr = excellist;
          
        } catch (e) {
          return alert("Read failure!");
        }
      };
      fileReader.readAsBinaryString(files[0]);
      var input = document.getElementById("upload");
      input.value = "";
    },
    handleRemoveItem(item, key) {
      if (confirm(`ต้องการลบ ${item.tth} ${item.namet} ${item.snamet}`)) {
        this.dataArr.splice(key, 1);
      }
    },

    async uploadData() {
      var classItem = { schoolYear: this.year, term: this.term };
      var classroom_term = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        classItem
      );

      const level_list = [
        ...new Set(this.dataArr.map(data => data.class.trim()))
      ];
      level_list.forEach(async level => {
        var student_level = this.dataArr.filter(
          data => data.class.trim() == level
        );
        var room_list = [...new Set(student_level.map(data => data.room))];

        room_list.forEach(async room => {
          var student_room = student_level.filter(data => data.room == room);
          var student_id_list = [];
          for (const student of student_room) {
            // ถ้าจะเช็ค นร. ให้ get ด้วยเลขบัตรประชาชน ถ้าไม่เจอค่อยทำข้างล่าง => if (! student_exist) ครอบ
            var object = {
              idstd: student.idstd.toString(),
              number: student.number,
              tth: student.tth,
              namet: student.namet,
              snamet: student.snamet,
              idcard: student.idcard.toString(),
              class: student.class,
              room: student.room,
              username: student.idstd.toString(),
              password: student.idcard.toString(),
              type: "นักเรียน"
            };
            
            const response_student = await this.$store.dispatch(
              `students/createStudent`,
              object
            );
            student_id_list.push(response_student.objectId);

            const response_user = await this.$store.dispatch(
              `users/createUser`,
              object
            );
          }
          var classroom = classroom_term.results.filter(
            data => data.classRoomLevel == level && data.classRoomName == room
          );
          if (classroom.length > 0) {
            // หรือ if (classroom.length > 0)
            var class_data = {
              objectId: classroom[0].objectId,
              studentId: classroom[0].studentId.concat(student_id_list)
            };
            const response_classroom = await this.$store.dispatch(
              `classes/updateClasses`,
              class_data
            );
            if (response_classroom) {
              this.dataArr = [];
            }
          } else {
            var class_data = {
              schoolYear: this.year,
              term: this.term,
              classRoomLevel: level,
              classRoomName: room.toString(),
              studentId: student_id_list
            };
            const response_classroom = await this.$store.dispatch(
              `classes/createClasses`,
              class_data
            );
            if (response_classroom) {
              this.dataArr = [];
            }
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// Button style
.button_group {
  .button_s {
    width: 78px;
    margin: 5px 10px 5px 5px;
  }
  .button_m {
    width: 100px;
    margin: 5px 10px 5px 5px;
  }
  .my_file {
    position: relative;
    .my_input {
      position: absolute;
      opacity: 0;
      width: 78px;
      height: 30px;
      top: 0;
      left: 0;
    }
  }
}
// Button style
</style>
