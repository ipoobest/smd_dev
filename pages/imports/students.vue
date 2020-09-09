<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ title }}
          </v-card-title>

          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>รหัสประจำตัวนักเรียน</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>ระดับชั้น</th>
                  <th class="text-right">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, key) in dataArr" :key="key">
                  <td>{{ item.idstd }}</td>
                  <td>{{ `${item.tth} ${item.namet} ${item.snamet}` }}</td>
                  <td>{{ item.class }}</td>
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
              <v-btn color="info" v-if="dataArr.length != 0" @click="uploadData">upload</v-btn>
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
  data() {
    return {
      csv: [],
      dataArr: [],
      title: `นำเข้านักเรียน`,
      total: 0
    };
  },
  methods: {
    async createUser(username, password, type) {
      const data = {
        username,
        password,
        type
      }
      const response = await this.$store.dispatch(`users/createUser`, data)
      //  const response = await this.$store.dispatch(`students/createStudent`, object)

       console.log('create' , response)
    },
    async createStudent(object) {
      // const response = await this.$store.dispatch(`users/createUser`, object)
       const response = await this.$store.dispatch(`students/createStudent`, object)

       console.log('create' , response)
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
      console.log(files);
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
          console.log("Read results", excellist); 
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
    uploadData() {
      if (confirm(`ยืนยันการ upload`)) {

      // // var output = this.dataArr.map( data => ({student_id:data.id }))
      // var output = this.dataArr.pop();
       this.dataArr.forEach(data => {
            data.stu_id = data.idstd
            data.class =  data.class.toString()
            data.study = data.study.toString()
            // data.grade = data.grade.toString()
            data.idcard = data.idcard.toString()
            data.stage = data.stage.toString()
            data.stmonth = data.stmonth.toString()
            data.bday = data.bday.toString()
            data.blood = data.blood.toString()
            data.disease = data.disease.toString()
            data.treatment = data.treatment.toString()
            data.healthpb = data.healthpb.toString()
            // data.residential = data.residential.toString()
            data.domicile = data.domicile.toString()
            data.addres = data.addres.toString()
            data.dorm = data.dorm.toString()
            data.sttell = data.sttell.toString()
            data.sibling = data.sibling.toString()
            data.sibling1 = data.sibling1.toString()
            data.sibling2 = data.sibling2.toString()
            data.sibling3 = data.sibling3.toString()
            data.sbclass1 = data.sbclass1.toString()
            data.sbclass2 = data.sbclass2.toString()
            data.sbclass3 = data.sbclass3.toString()
            data.ctell = data.ctell.toString()
            data.fage = data.fage.toString()
            data.fwork = data.fwork.toString()
            data.fcareer = data.fcareer.toString()
            data.fpost = data.fpost.toString()
            data.fbelong = data.fbelong.toString()
            data.fatwork = data.fatwork.toString()
            data.ftell = data.ftell.toString()
            data.fphone = data.fphone.toString()
            data.fsalary = data.fsalary.toString()
            data.mage = data.mage.toString()
            data.mwork = data.mwork.toString()
            data.mcareer = data.mcareer.toString()
            data.mpost = data.mpost.toString()
            data.mbelong = data.mbelong.toString()
            data.mtell = data.mtell.toString()
            data.mphone = data.mphone.toString()
            data.msalary = data.msalary.toString()
            data.parent = data.parent.toString()
            data.prelated = data.prelated.toString()
            data.pwork = data.pwork.toString()
            data.patwork = data.patwork.toString()
            data.ptell = data.ptell.toString()
            data.personality = data.personality.toString()
            data.bctell = data.bctell.toString()
            data.userreg = data.userreg.toString()
            data.contact = data.contact.toString()
            data.date = data.date.toString()
            data.idstd = data.idstd.toString()
            data.username = data.idstd.toString()
            data.password = data.idcard
            data.type = "นักเรียน"
            delete data.id
            this.createStudent(data)

            this.createUser( data.username, data.password, data.type)

            // console.log('user', data)
        })
        // alert('import สำเร็จ')
        // console.log('output',this.dataArr)
        // this.dataArr = []
      }
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
