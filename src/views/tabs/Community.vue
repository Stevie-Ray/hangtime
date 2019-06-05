<template>
  <community-list class="community-list"></community-list>
</template>

<script>
import { mapState } from 'vuex'
import CommunityList from '@/components/CommunityList'

export default {
  head: {
    title: {
      inner: 'Community'
    },
    meta: [
      {
        name: 'description',
        content: 'HangTime community page',
        id: 'desc'
      }
    ]
  },
  components: { CommunityList },
  computed: mapState('app', ['networkOnLine'])
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
