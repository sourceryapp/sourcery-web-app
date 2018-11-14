<template>
        <v-card width="400px">
            <v-list>
                <template v-for="(item) in items">
                    <v-list-tile
                    :key="item.title"
                    avatar
                    :to = "item.link"
                    >
                    <v-list-tile-avatar>
                        <img :src="item.avatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title><span class='text--primary'>Card Number: &emsp; ****{{item.title}}</span></v-list-tile-title>
                        <v-list-tile-sub-title><span class='text--primary'>Added: &emsp; {{item.subtitle}}</span></v-list-tile-sub-title>
                    </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
            <v-btn to="/payment/new_card"><span>Add a New Card</span></v-btn>
        </v-card>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          {
            avatar: "/img/MastercardHP.jpg",
            title: '0000',
            subtitle: '00/00',
            link: "/account/profile"
          }

        ]
      }
    }
  }
</script>

<style scoped>

</style>
