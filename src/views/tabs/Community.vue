<template>
  <community-list class="community-list"></community-list>
</template>

<script>
import { mapState } from 'vuex'
import CommunityList from '@/components/organisms/CommunityList/CommunityList'

export default {
  components: { CommunityList },
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
  },
  computed: mapState('app', ['networkOnLine'])
}
</script>
