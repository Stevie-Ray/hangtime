<template>
  <v-layout class="profile">
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
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <div class="text-center pt-6">
              <!--              <v-badge overlap bottom class="pa-4">-->
              <!--                <v-icon slot="badge" dark @click="captureFile"-->
              <!--                  >mdi-camera</v-icon-->
              <!--                >-->

              <!--             add: v-avatar @click="pickFile"-->
              <v-avatar
                v-if="user"
                size="144"
                aspect-ratio="1"
                class="grey lighten-2"
              >
                <img :src="user.photoURL" />
              </v-avatar>

              <!--                <v-form-->
              <!--                  enctype="multipart/form-data"-->
              <!--                  @submit.prevent="onFilePicked"-->
              <!--                >-->
              <!--                  <input-->
              <!--                    ref="image"-->
              <!--                    type="file"-->
              <!--                    style="display: none"-->
              <!--                    accept="image/*"-->
              <!--                    @change="onFilePicked"-->
              <!--                  />-->

              <!--                  <input-->
              <!--                    ref="capture"-->
              <!--                    type="file"-->
              <!--                    style="display: none"-->
              <!--                    accept="image/*"-->
              <!--                    capture="user"-->
              <!--                    @change="onFilePicked"-->
              <!--                  />-->
              <!--                </v-form>-->
              <!--              </v-badge>-->
            </div>

            <v-list two-line>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-account</v-icon>
                </v-list-item-avatar>

                <v-list-item-content v-if="user">
                  <v-list-item-title>{{ user.displayName }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1"
                    >mdi-chart-timeline-variant</v-icon
                  >
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-select
                    v-if="user"
                    v-model="settingsGrade"
                    :items="grades"
                    :item-text="user.settings.scale"
                    item-value="ircra"
                    label="Grade"
                    persistent-hint
                    hint="What grade are you currently climbing?"
                    @change="triggerUpdateUser"
                  ></v-select>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-information</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-text-field
                    v-if="user"
                    v-model="userStatus"
                    placeholder="At the gym"
                    :rules="[rules.required, rules.length(24)]"
                    counter="24"
                    required
                    label="Status"
                    @change="triggerUpdateUser"
                  >
                  </v-text-field>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-email</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-if="user">{{
                    user.email
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import firebase from 'firebase/app'
import { mapState, mapActions, mapMutations } from 'vuex'
import IRCRA from 'ircra'
import { getImg } from '@/misc/helpers'

export default {
  data: () => ({
    ircra: new IRCRA(),
    rules: {
      length: len => v =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: v => !!v || 'This field is required'
    }
  }),
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    settingsScale: {
      get() {
        return this.user.settings.scale
      },
      set(value) {
        // this.scaleSelected = value
        this.setScale(value)
      }
    },
    settingsGrade: {
      get() {
        const ircraGrade = this.ircra
          .convert('ircra', this.user.settings.grade)
          .to(this.user.settings.scale)[this.user.settings.scale]
        return ircraGrade
      },
      set(value) {
        const ircraGrade = this.ircra
          .convert(this.user.settings.scale, value)
          .to('ircra').ircra
        this.setGrade(ircraGrade)
      }
    },
    userStatus: {
      get() {
        return this.user.status
      },
      set(value) {
        this.setStatus(value)
      }
    },
    grades() {
      return this.ircra.get(this.user.settings.scale).filter(n => n)
    }
  },
  methods: {
    getImg,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', ['setStatus', 'setGrade']),
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
          // eslint-disable-next-line prefer-destructuring
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
  },
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
