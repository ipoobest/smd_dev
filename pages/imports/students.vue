<template>
  <v-layout>
    <v-row align="center" >
      <v-col cols="12" >
        <v-card>
          <v-card-title>
            {{ title }}
          </v-card-title>

          <v-simple-table>
            <template v-slot:default >
              <thead>
                <tr>
                  <th>รหัสประจำตัวนักเรียน</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>ระดับชั้น</th>
                  <th class="text-right" ></th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, key) in items" :key="key" >
                  <td>{{ item.idstd }}</td>
                  <td>{{ `${item.tth} ${item.namet} ${item.snamet}` }}</td>
                  <td>{{ item.class }}</td>
                  <td class="text-right" >
                    <v-btn color="error" type="button" @click="handleRemoveItem(item, key)" >X</v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>

export default {
  data() {
    return {
      csv: [],
      items: [],
      title: `นำเข้านักเรียน`,
      total: 0
    }
  },
  methods: {
    handleImport() {
      const reader = new FileReader

      reader.readAsText(this.csv)
      reader.onload = (e) => {
        const data = e.target.result
        const reuslt = Papa.parse(data, { header: true })

        this.items = result.data
      }

      reader.onerror = () => console.log(`Unable to read file.`)
    },
    handleRemoveItem(item, key) {
      if(confirm(`ต้องการลบ ${item.tth} ${item.namet} ${item.snamet}`)) {
        this.items.splice(key, 1)
      }
    }
  }
}
</script>