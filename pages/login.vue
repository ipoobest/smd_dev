<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" validation>
                  <v-text-field
                    label="Login"
                    prepend-icon="mdi-account"
                    required
                    :rules="[v => !!v || 'Username is required']"
                    type="text"
                    v-model="username"
                  />

                  <v-text-field
                    @keypress="e => e.keyCode === 13 && handleLogin()"
                    label="Password"
                    prepend-icon="mdi-key"
                    required
                    :rules="[v => !!v || 'Password is required']"
                    type="password"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="handleLogin" type="button"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-overlay :value="overlay">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </v-overlay>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      overlay: false,
      password: ``,
      username: ``
    };
  },
  layout: "blank",
  methods: {
    async handleLogin() {
      if (!!this.username && !!this.password) {
        const data = {
          username: this.username,
          password: this.password
        };
        try {
          const response = await this.$store.dispatch(`auth/login`, { data });
          // 
          // if(response){
          //   this.$router.replace({name: 'index'})
          // }
          if (response.type == "ครู" ) {
            // 
            this.$router.replace({
              name: "teachers-id",
              params: { id: `${this.$store.state.auth.auth.objectId}` }
            });
          } else if (response.type == "หัวหน้ากลุ่มสาระ") {
            this.$router.replace({
              name: "staff-id",
              params: { id: `${this.$store.state.auth.auth.objectId}` }
            });
          } else if (response.type == "หัวหน้ากลุ่มประเมิน") {
            this.$router.replace({
              name: "assessment-id",
              params: { id: `${this.$store.state.auth.auth.objectId}` }
            });
          } else if (response.type == "นักเรียน") {
            this.$router.replace({
              name: "students-id",
              params: { id: `${this.$store.state.auth.auth.objectId}` }
            });
          }else {
            this.$router.replace({ name: "index" });
          }
        } catch (error) {
          alert("username หรือ รหัสผ่านผิดกรุณาลองใหม่");
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
