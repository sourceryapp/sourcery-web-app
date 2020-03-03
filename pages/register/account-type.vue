<template>
  <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card flat color="transparent">
        <v-form @submit.prevent="save">
            <h1>Choose an Account Type</h1>

            <v-alert
            :value="true"
            type="warning"
            >
            Don't worry. You can always change this later.
            </v-alert>


            <v-radio-group v-model="accountType">
            <v-radio
                label="Researcher"
                value="researcher"
            ></v-radio>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam adipisci minus facilis, nemo, veritatis nostrum repellat veniam minima ratione nihil enim, harum quibusdam est neque doloribus molestiae. Ratione, neque itaque.</p>

            <v-radio
                label="Sourcerer"
                value="sourcer"
            ></v-radio>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam repellendus sapiente qui fuga hic accusantium corrupti, aspernatur tempore? Quidem alias repellendus expedita accusantium nihil consequuntur delectus dolorem earum unde sint?</p>
            </v-radio-group>


            <v-layout row align-center justify-center>
                <!-- <v-btn to="/login">Back</v-btn> -->
                <v-btn type="submit" value="Register" color="primary">Next</v-btn>
            </v-layout>

        </v-form>

    </v-card>
    </v-flex>




  </v-layout>
</template>

<script>

export default {
  name: "account-type",

  data() {
    return {
        accountType: 'researcher',
    };
  },
  methods: {
      async save(){
          if(this.accountType === 'researcher'){
              this.$store.commit('meta/setResearcher', true);
              await this.$store.dispatch('meta/save', 'researcher');

          }else{
              this.$store.commit('meta/setSourcerer', true);
              await this.$store.dispatch('meta/save', 'sourcerer');
          }

          this.$router.push({name: 'dashboard'})
      }
  }
};
</script>

<style scoped>
</style>
