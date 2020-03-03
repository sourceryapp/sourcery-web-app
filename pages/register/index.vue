<template>
  <v-layout>
      <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
        <v-card flat color="transparent">
        <v-form @submit.prevent="registerValid">
            <h1>Register</h1>
            <v-alert v-if="message" :value="true" type="error" class="mt-2 mb-2">{{message}}</v-alert>
            <v-alert
                :value = errorEmpty
                type="error">
                <span color="white">All fields are required.</span>
            </v-alert>
            <v-text-field
              type="text"
              name="name"
              v-model="name"
              :rules="rules.required"
              label="Full Name"
              required
              clearable
              autofocus="autofocus"
              validate-on-blur
              prepend-icon="account_circle"
            ></v-text-field>
            <span class="red--text" v-for="(err, index) in errors.name" :key="index">{{err}}</span>
            <v-text-field
                type="email"
                name="email"
                v-model="email"
                label="Email"
                :rules="emailRules"
                required
                clearable
                validate-on-blur
                prepend-icon="email"
            ></v-text-field>
            <span class="red--text" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
            <v-layout>
                <v-text-field
                name="password"
                v-model="password"
                label="Password"
                autocomplete="false"
                messages="At least 8 characters and 1 special character."
                :rules="passRules"
                :type="showPass ? 'text' : 'password'"
                :append-icon="showPass ? 'visibility' : 'visibility_off'"
                @click:append="showPass = !showPass"
                required
                counter
                error-count="2"
                :success="password==confirm_password && password !=''"
                validate-on-blur
                loading
                prepend-icon="security"
                >
                <template v-slot:progress>
                  <v-progress-linear
                    :value="progress"
                    :color="color"
                    height="4"
        > </v-progress-linear>
      </template>
            </v-text-field>
            </v-layout>
            <v-alert
                :value = errorLength
                type="warning"
                outline
                >
                <span color="white">Password length must be at least 8 characters.</span>
            </v-alert>
            <v-alert
                :value = errorSpecial
                type="warning"
                outline>
                <span color="white">Password must include a special character.</span>
            </v-alert>
            <v-text-field
              name="confirm_password"
              v-model="confirm_password"
              label="Confirm Password"
              :rules="confirmPassRules"
              :type="showPass2 ? 'text' : 'password'"
              :append-icon="showPass2 ? 'visibility' : 'visibility_off'"
              @click:append="showPass2 = !showPass2"
              required
              counter
              :disabled="!  password"
              :success="password==confirm_password && password !=''"
              validate-on-blur
              prepend-icon="check_circle"
            ></v-text-field>
            <span class="red--text" v-for="(err, index) in errors.confirm_password" :key="index">{{err}}</span>
            <v-alert
                :value = errorMatch
                type="warning"
                outline>
                <span color="white">Passwords do not match.</span>
            </v-alert>
            <v-layout>
            <v-flex>
                <v-text-field
                type="phone"
                name="phone"
                v-model="phone"
                label="Phone Number"
                :rules="rules.required"
                required
                validate-on-blur
                prepend-icon="phone"
                ></v-text-field>
            </v-flex>
            </v-layout>
            <v-btn block type="submit" value="Register" color="primary" :loading="loading">Register</v-btn>
            <v-btn block flat to="/login">Cancel</v-btn>
        </v-form>

    </v-card>
    </v-flex>




  </v-layout>
</template>

<script>
import { Auth, db } from "~/plugins/firebase-client-init.js";

export default {
  name: "register",

  /**
   * Don't require auth for this page.
   */
  auth: false,
  data() {
    return {
      name: "",
      email: "",
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      rules: {
        'required': [v => !!v || 'This field is required'],
      },
      password: "",
      showPass: false,
      special_characters: ["~", "!", "@", "#", "$", "%","^", "&", "*", "_", "-", "+", "=", "`", "|", "(", ")", "{", "}", "[", "]", ":", ";", "'", "<", ">", ",", ".", "?", "/"],
      passRules: [
        v => v.length >= 8 || 'Password must be at least 8 characters',
        v => this.special_characters.some(substring=>v.includes(substring)) || 'Password must contain 1 special character'
      ],
      goodPass: [
        'At least 8 characters',
        'At least 1 special character'
      ],
      confirm_password: "",
      showPass2: false,
      confirmPassRules: [
        v => v === this.password || 'Passwords must match'
      ],
      phone: "",
      message: null,
      execute: true,

      loading: false,
      errorEmpty: false,
      errorMatch: false,
      errorLength: false,
      errorSpecial: false,

      errors: {
        name: [],
        email: [],
        password: [],
        confirm_password: []
      },

    };
  },
  computed: {
      progress () {
        return ((Math.min(this.password.length,8)/8) + (this.special_characters.some(substring=>this.password.includes(substring))))*50
      },
      color () {
        return ['primary','success'][Math.floor(this.progress / 100)]
      }
    },
  methods: {
    registerSubmit: function() {

        Auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        ).then(({ user }) => {
            user.updateProfile({
                displayName: this.name,
                photoURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC',
            }).then(() => {

                var userRef = db.collection('user-meta').doc(user.uid);

                var setWithMerge = userRef.set({
                    phone: this.phone
                }, { merge: true });

                this.$store.dispatch('auth/signIn', {
                    email: this.email,
                    password: this.password
                }).then(() => {
                    this.$router.push('/dashboard')
                });
            })

        }).catch( (error) => {
            let messages = {
                'auth/email-already-in-use': 'An account exists with this email address.',
                'auth/invalid-email': 'Please enter a valid email address.',
                'auth/operation-not-allowed': 'Uh oh.',
                'auth/weak-password': 'Please enter a stronger password.',
            };
            this.message = messages[error.code]
        });
    },
    registerValid: function() {
      this.loading = true;
      //re-initialize all error messages back to default
      this.errorEmpty = false;
      this.errorMatch = false;
      this.errorLength = false;
      this.errorSpecial = false;

      // (1) text fields not empty
      if (this.name == "" || this.email == "" || this.password == "" || this.confirm_password == "" || this.email == "") {
        this.execute = false;
        this.errorEmpty = true;
        //console.log("Empty")
      }

      // (2) passwords match
      if (this.password !== this.confirm_password) {
        this.execute = false;
        this.errorMatch = true;
        //console.log("Match")
      }

      // (3) password 8 or more characters
      if (this.password.length < 8) {
        this.execute = false;
        this.errorLength = true;
        //console.log("Length")
      }

      // (4) password contains a special character
      var contains = false
      for (var i = 0; i < this.password.length; i++) {
          if (this.special_characters.includes(this.password.charAt(i)) == true){
           contains = true;
          }
        }
      if (contains == false) {
        this.execute = false
        this.errorSpecial = true;
        //console.log("Special")
      }

      //if conditions (1) - (4) true, register submit
      if (this.execute) {
        this.registerSubmit();
      }
      else {
        this.execute = true;
        this.loading = false;
      }
  }
  },
};
</script>

<style scoped>
</style>
