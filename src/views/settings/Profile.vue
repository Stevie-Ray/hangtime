<template>
  <v-layout row class="profile">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })"
        >mdi-arrow-left</v-icon
      >
      <v-toolbar-title>
        Profile
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--      <v-btn v-if="!isUserLoggedIn && networkOnLine" to="/login">-->
      <!--        <v-icon>mdi-account</v-icon>-->
      <!--      </v-btn>-->

      <v-btn v-if="networkOnLine" icon @click="logout">
        <v-icon>mdi-account-off</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex sm8 md6>
            <div class="text-xs-center">
              <v-badge overlap bottom class="pa-4">
                <v-icon slot="badge" dark @click="captureFile"
                  >mdi-camera</v-icon
                >

                <v-avatar
                  size="144"
                  aspect-ratio="1"
                  class="grey lighten-2"
                  @click="pickFile"
                >
                  <img :src="user.photoURL" />
                </v-avatar>

                <v-form
                  enctype="multipart/form-data"
                  @submit.prevent="onFilePicked"
                >
                  <input
                    ref="image"
                    type="file"
                    style="display: none"
                    accept="image/*"
                    @change="onFilePicked"
                  />

                  <input
                    ref="capture"
                    type="file"
                    style="display: none"
                    accept="image/*"
                    capture="user"
                    @change="onFilePicked"
                  />
                </v-form>
              </v-badge>
            </div>

            <!--            <div class="pa-4">-->
            <!--              <v-avatar-->
            <!--                size="144"-->
            <!--                aspect-ratio="1"-->
            <!--                class="grey lighten-2">-->
            <!--                <img :src="user.image"/>-->
            <!--              </v-avatar>-->
            <!--            </div>-->

            <v-list two-line>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-account</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <!--<v-list-item-title>-->
                  <!--{{ user().name }}-->
                  <!--</v-list-item-title>-->

                  <v-list-item-title>{{ user.displayName }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-information</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-text-field
                    v-model="userStatus"
                    required
                    label="Status"
                    @keypress.enter="triggerUpdateUser"
                  >
                  </v-text-field>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-email</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ user.email }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1"
                    >mdi-theme-light-dark</v-icon
                  >
                </v-list-item-avatar>

                <v-list-item-content
                  @click="$vuetify.theme.dark = !$vuetify.theme.dark"
                >
                  <v-list-item-title>Dark mode</v-list-item-title>
                  <v-list-item-subtitle>Enable dark mode</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox v-model="$vuetify.theme.dark"></v-checkbox>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import firebase from 'firebase/app'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getImg } from '@/misc/helpers'

export default {
  head: {
    title: {
      inner: 'Profile'
    },
    meta: [
      {
        name: 'description',
        content: 'HangTime settings',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState(['settings', 'settings']),
    ...mapState('authentication', ['user']),
    userStatus: {
      get() {
        return this.user.status
      },
      set(value) {
        this.setStatus(value)
      }
    }
  },
  methods: {
    getImg,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', ['setStatus']),
    async logout() {
      await firebase.auth().signOut()
    },
    pickFile() {
      this.$refs.image.click()
    },
    captureFile() {
      this.$refs.capture.click()
    },
    onFilePicked(e) {
      const { files } = e.target
      if (files[0] !== undefined) {
        // const $this = this,
        //   file = (e.target.files || e.dataTransfer.files)[0],
        //   reader = new FileReader();
        //     reader.onload = (e) => {
        //   $this.data.body.image = file;
        //
        //   this.updateUser();
        // };

        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
          // this.data.body.avatar = this.imageFile;
          // this.user.photoURL = this.imageUrl;
          this.updateUser(files[0])
        })
      } else {
        this.imageName = ''
        this.imageFile = null
        this.imageUrl = ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.profile {
  .v-badge__badge {
    width: 48px;
    height: 48px;

    .v-icon {
      font-size: 24px;
    }
  }

  .v-badge--overlap.v-badge--bottom .v-badge__badge {
    bottom: 16px;
    right: 16px;
  }

  .v-avatar {
    overflow: hidden;

    img {
      height: auto;
      min-height: 100%;
    }
  }
}
</style>
