<template>
  <div>
    <div v-if="workouts === null && user" class="loading text-center">
      <v-progress-circular
        :size="60"
        color="primary"
        indeterminate
        class="my-4"
      >
      </v-progress-circular>
      <div>{{ $t('Loading community workouts...') }}</div>
    </div>
    <v-container
      v-if="(!user && !workouts) || (workouts && !workouts.length)"
      fluid
    >
      <v-row class="text-center" justify="center" align="start">
        <v-col cols="12" sm="8" md="6">
          <v-avatar aspect-ratio="1" class="grey lighten-2" size="164">
            <img src="@/assets/sloth/baby.svg" alt="sloth baby" />
          </v-avatar>
        </v-col>
      </v-row>

      <!-- No community workouts for this hangboard  -->
      <v-row>
        <v-card flat>
          <v-card-title>
            {{ $t('No community workouts found') }}
          </v-card-title>
          <v-card-subtitle v-if="user">
            {{
              $t(
                'After creating a {hangboard} workout use the below button to add it to the community',
                {
                  hangboard:
                    companies[
                      user.settings.hangboards[user.settings.selected].company
                    ].hangboards[
                      user.settings.hangboards[user.settings.selected].hangboard
                    ].name
                }
              )
            }}
          </v-card-subtitle>
        </v-card>
      </v-row>
    </v-container>
    <!-- Render comunity workouts  -->
    <v-list two-line>
      <v-virtual-scroll
        :items="workouts"
        item-height="72"
        bench="2"
        :height="windowHeight"
      >
        <template #default="{ item, index }">
          <workout-list-item
            :key="item.id"
            class="community-workout-row"
            :index="index"
            :disable-actions="!networkOnLine"
            :data="item"
            @go-to-workout-details="
              $router.push({
                name: 'workout',
                params: {
                  id: $event,
                  company: item.company,
                  hangboard: item.hangboard,
                  userId: item.user.id
                }
              })
            "
          ></workout-list-item>
        </template>
      </v-virtual-scroll>
    </v-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mdiStarOutline } from '@mdi/js'
import WorkoutListItem from '@/components/molecules/WorkoutListItem/WorkoutListItem'
import companies from '@/misc/hangboards'

export default {
  components: { WorkoutListItem },
  data: () => ({
    companies,
    windowHeight: window.innerHeight,
    mdi: {
      starOutline: mdiStarOutline
    }
  }),
  computed: {
    ...mapGetters('workouts', ['communityWorkoutsByHangboard']),
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['workoutFilter', 'sortOrder']),
    workouts() {
      if (!this.user) return
      // eslint-disable-next-line consistent-return
      return this.communityWorkoutsByHangboard({
        user: this.user,
        filter: this.workoutFilter.value,
        order: this.sortOrder
      })
    }
  }
}
</script>
