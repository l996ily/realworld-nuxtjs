<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="url" placeholder="URL of profile picture" v-model="user.image"
                  required>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="user.username" type="text" placeholder="Your Name"
                  required>
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" v-model="user.bio" rows="8"
                  placeholder="Short bio about you" required></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="user.email" type="text" placeholder="Email"
                  required>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="user.password" type="password"
                  placeholder="Password" required>
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click="updateSettings">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

import { mapState } from 'vuex'
import { updateUser } from '@/api/user'

export default {
  middleware: 'authenticated',
  name: "SettingsIndex",
  computed: {
    ...mapState({ storeUser: 'user' })
  },
  data() {
    return {
      user: {
        bio: '',
        email: '',
        image: '',
        password: '',
        username: ''
      }
    }
  },
  mounted() {
    this.user.bio = this.storeUser.bio
    this.user.email = this.storeUser.email
    this.user.image = this.storeUser.image
    this.user.password = this.storeUser.password
    this.user.username = this.storeUser.username
  },
  methods: {
    logout() {
      this.$store.commit('setUser', null)
      Cookie.set('user', null)
      this.$router.push('/')
    },
    async updateSettings() {
      const { data } = await updateUser({
        user: this.user
      })
      this.$store.commit('setUser', data.user)
      Cookie.set('user', data.user)

      this.$router.push(`/profile/${data.user.username}`)
    }
  }
}
</script>

<style scoped>
</style>
