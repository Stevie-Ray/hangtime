<template>
  <community-list class="community-list"></community-list>
</template>

<script>
import { mapState } from 'vuex'
import CommunityList from '@/components/CommunityList'

export default {
  components: { CommunityList },
  computed: mapState('app', ['networkOnLine']),
  head: {
    title: {
      inner: 'Community'
    },
    meta: [
      {
        name: 'description',
        content: 'Community',
        id: 'desc'
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
