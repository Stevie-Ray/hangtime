<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="text-h5">
        <span v-if="!currentWorkout.share">
          {{ $t('Share with the community') }}
        </span>
        <span v-else>
          {{ $t('Remove from the community') }}
        </span>
      </v-card-title>

      <v-card-text>
        <span v-if="!currentWorkout.share">
          {{
            $t('Are you sure you want to share {name} with the community?', {
              name: currentWorkout.name
            })
          }}
        </span>
        <span v-else>
          {{
            $t('Are you sure you want to remove {name} from the community?', {
              name: currentWorkout.name
            })
          }}
        </span>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$emit('input', false)">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn text @click="clickshareWorkout">
          <span v-if="!currentWorkout.share">
            {{ $t('Share') }}
          </span>
          <span v-else>
            {{ $t('Remove') }}
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DialogWorkoutShare',
  props: {
    value: Boolean,
    currentWorkout: Object
  },
  data: () => ({}),
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    ...mapActions('workouts', ['shareWorkout']),
    clickshareWorkout() {
      this.shareWorkout(this.currentWorkout.id)
      this.$emit('input', false)
      if (this.currentWorkout.share) {
        this.$router.push({ name: 'community' })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
