<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back" >
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>              
            {{ title }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>

                <v-card-title>
                  <v-btn color="success" dark class="mb-2" to="/students/form"
                    >เพิ่ม</v-btn
                  >
                </v-card-title>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>

export default {
  middleware: 'authentication',
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'รหัสประจำตัว', value: 'idstd' },
        { text: 'ชื่อ', value: 'namet' },
        { text: 'นามสกุล', value: 'snamet' },
        { text: 'หลักสูตร', value: 'course' },
        { text: 'ระดับชั้น', value: 'class' }
      ],
      items: [],
      search: ``,
      title: `นักเรียน`,
      desserts: [],
      editedIndex: -1
    }
  },
  mounted() {
    this.getDataFromApi().then((result) => (this.items = result))
  },
  methods: {
    async getDataFromApi(limit = 50, skip = 0) {
      const response = await this.$store.dispatch(`students/getStudent`)
      return response.results
    },
    back() {
      this.$router.push({name: 'index'})
    },
    editItem(item) {
      console.log('item id ', item)
      this.$router.push({
        name: 'students-id',
        params: { id: item.objectId }
      })
    }
  }
}
</script>
