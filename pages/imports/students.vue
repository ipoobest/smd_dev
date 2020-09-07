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
                      >X</v-btn
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
              <v-btn color="info">import</v-btn>
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
          const wsname = workbook.SheetNames[0]; // Take the first sheet，wb.SheetNames[0] :Take the name of the first sheet in the sheets
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // Generate JSON table content，wb.Sheets[Sheet名]    Get the data of the first sheet
          const excellist = []; // Clear received data
          // Edit data
          for (var i = 0; i < ws.length; i++) {
            excellist.push(ws[i]);
          }
          this.dataArr = excellist;
          console.log("Read results", excellist); // At this point, you get an array containing objects that need to be processed
        } catch (e) {
          return alert("Read failure!");
        }
      };
      fileReader.readAsBinaryString(files[0]);
      var input = document.getElementById("upload");
      input.value = "";
    },
    handleImport() {
      const reader = new FileReader();

      reader.readAsText(this.csv);
      reader.onload = e => {
        const data = e.target.result;
        const reuslt = Papa.parse(data, { header: true });

        this.items = result.data;
      };

      reader.onerror = () => console.log(`Unable to read file.`);
    },
    handleRemoveItem(item, key) {
      if (confirm(`ต้องการลบ ${item.tth} ${item.namet} ${item.snamet}`)) {
        this.dataArr.splice(key, 1);
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
