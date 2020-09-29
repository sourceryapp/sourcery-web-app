<template>
    <v-layout row fill-height align-center>
        <v-flex xs12 sm6 offset-sm3 lg4 offset-lg4 >
            <v-form ref="repoForm" @submit.prevent="submitRepository">
                <h1 class="text-xs-center">Suggest Repository</h1>
                <h4 class="text-xs-center">Please provide as much information as possible. Note, not all information is necessary.</h4>
                <v-text-field
                type="text"
                name="name"
                v-model="name"
                label="Repository Name"
                required
                clearable
                validate-on-blur
                box
                background-color="#F3F1F6"
                :rules="[rules.required]"
                ></v-text-field>
                 <v-text-field
                type="text"
                name="institution"
                v-model="institution"
                label="Institution"
                required
                clearable
                validate-on-blur
                box
                background-color="#F3F1F6"
                :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                type="text"
                name="address"
                v-model="address"
                label="Street Address"
                required
                clearable
                validate-on-blur
                box
                background-color="#F3F1F6"
                ></v-text-field>
                <v-text-field
                type="text"
                name="city"
                v-model="city"
                label="City"
                required
                clearable
                validate-on-blur
                box
                background-color="#F3F1F6"
                ></v-text-field>
                <v-text-field
                type="text"
                name="country"
                v-model="country"
                label="Country"
                required
                clearable
                validate-on-blur
                box
                background-color="#F3F1F6"
                ></v-text-field>
                <v-text-field
                type="text"
                name="email"
                v-model="email"
                label="Your Email Address"
                required
                clearable
                validate-on-blur
                box
                background-color="#F3F1F6"
                ></v-text-field>
                <v-btn color="red" dark to="/request/create">Cancel</v-btn>
                <v-btn color="primary" dark type="submit">Submit</v-btn>
            </v-form>
        </v-flex>
    </v-layout>
</template>


<script>
import suggestRepo from '~/modules/suggestRepo';
import { mapGetters, mapActions } from 'vuex'

export default {
    name: "suggest-repository",
    data() {
        return {
            name: "",
            city: "",
            institution: "",
            address: "",
            country: "",
            email: "",
            rules: {
                required: value => !!value || 'Required.',
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/activeUser'
        }),
    },
    methods: {
        async submitRepository() {

            // Validate the form
            if(this.$refs.repoForm.validate()){
                    // Store the data
                    await suggestRepo.send({
                        from: this.email,
                        name: this.name,
                        city: this.city,
                        institution: this.institution,
                        address: this.address,
                        country: this.country,

                        text: "A new repository suggestion as been made from" + this.email
                    });

                    // Message to user
                    alert("Thank you for your suggestion!");

                    // Reset the form
                    this.$refs.repoForm.reset();

                    // Return to previous page
                    this.$router.go(-1);
            }
        }
    },
    mounted(){
        this.email = this.user.email;
    }
}
</script>


<style scoped>
  .v-toolbar--fixed {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bottom-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 6px 12px;
    border-radius: 20px 20px 0px 0px;
    z-index: 5;
  }
  h1 {
    margin-bottom: 12px;
  }
</style>
