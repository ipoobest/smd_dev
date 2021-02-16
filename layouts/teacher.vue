<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app >
      <v-list dense>
        <template v-for="(item, i) in items" >
          <template v-if="item.childs" >
            <v-list-group :prepend-icon="item.icon" :key="i" no-action>
              <template v-slot:activator >
                <v-list-item-title v-text="item.title" />
              </template>

              <v-list-item v-for="(child, key) in item.childs" v-bind:key="key" :to="child.to" >
                <v-list-item-title v-text="child.title" />
                <v-list-item-icon>
                  <v-icon v-text="child.icon" />
                </v-list-item-icon>
              </v-list-item>
            </v-list-group>
          </template>

          <template v-else >
            <v-list-item v-bind:key="i" :to="item.to" v-if="(item.admin == true) ? admin : true">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>
    
    <v-app-bar :clipped-left="clipped" fixed app >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      {{this.$store.state.auth.auth.title}} {{this.$store.state.auth.auth.firstName}} {{this.$store.state.auth.auth.lastName}}
      <v-btn icon @click="logout" >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :fixed="fixed" app >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: `mdi-account`,
          title: `ผู้ใช้งาน`,
          to: `/#`
        },
        // {
        //   icon: `mdi-format-align-justify`,
        //   title: `ปีการศึกษา`,
        //   to: `/academic_year`
        // },
        {
          icon: `mdi-book-plus`,
          title: `ให้คะแนน`,
          to: `/teachers/add_score/${this.$store.state.auth.auth.objectId}`
        },
        {
          icon: `mdi-poll`,
          title: `เกณฑ์การให้คะแนน`,
          to: `/teachers/teach/`
        },
        // {
        //   icon: `mdi-book-plus`,
        //   title: `เกณฑ์การตัดเกรด`,
        //   to: `/teachers/${this.$store.state.auth.auth.objectId}`
        // },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'ระบบตัดเกรด'
    }
  },
  mounted() {
    // 
  },
  methods: {
    async logout(){
       await this.$store.dispatch(`auth/logout`)
       this.$router.replace({name: 'login'})
    }
  }
}
</script>
