<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1
        class="mb-4"
      >
        Settings
      </h1>

      <v-alert
        v-if="!user.hasPassword"
        type="warning"
      >
        Set a password to access the full functionality of Sourcery.
      </v-alert>
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          General
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-cog
          </v-icon>
        </v-card-title>
        <v-divider />
        <v-list>
          <v-list-item>
            <v-list-item-avatar
              :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
            >
              <v-icon
                :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
              >
                mdi-brightness-7
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Theme</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn-toggle v-model="theme" mandatory color="primary" @change="setTheme">
                <v-btn value="false" @click="$vuetify.theme.dark = false">
                  <v-icon class="hidden-sm-and-down" left>
                    mdi-brightness-7
                  </v-icon>
                  <span>Light</span>
                </v-btn>
                <v-btn value="true" @click="$vuetify.theme.dark = true">
                  <v-icon class="hidden-sm-and-down" left>
                    mdi-brightness-3
                  </v-icon>
                  <span>Dark</span>
                </v-btn>
                <!-- <v-btn value="null" @click="$vuetify.theme.dark = window.matchMedia('(prefers-color-scheme: dark)')">
                  Auto
                </v-btn> -->
              </v-btn-toggle>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar
              :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
            >
              <v-icon
                :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
              >
                mdi-bell
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Notifications</v-list-item-title>
              <v-list-item-subtitle>Receive email alerts for nearby jobs</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch
                v-model="agentBool"
                :hint="alertHint"
                :persistent-hint="false"
                color="primary"
                :readonly="!deviceHasGeoLocation"
                inset
                @change="updateNotifications"
              />
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Profile
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-account-details
          </v-icon>
        </v-card-title>
        <v-divider />
        <v-list>
          <v-list-item>
            <v-list-item-avatar
              :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
            >
              <v-icon
                :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
              >
                mdi-account
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Name</v-list-item-title>
              <v-list-item-subtitle v-once v-text="name" />
            </v-list-item-content>
            <v-list-item-action>
              <v-dialog
                v-model="dialogName"
                scrollable
                persistent
                :overlay="false"
                max-width="320px"
                transition="dialog-transition"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    Change
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
                  >
                    Change Name
                  </v-card-title>
                  <v-divider />
                  <v-form ref="detailsForm" @submit.prevent="updateDetails">
                    <v-card-text>
                      <v-text-field
                        id="displayName"
                        v-model.lazy="name"
                        type="text"
                        label="Your Name"
                        name="displayName"
                        :rules="[rules.required]"
                        outlined
                        hide-details="auto"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        text
                        @click="dialogName = false; name = $store.getters['auth/activeUser'].displayName"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        type="submit"
                        color="primary"
                        text
                        @click="dialogName = false"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
            </v-list-item-action>
          </v-list-item>
          <!-- <v-divider inset /> -->
          <v-list-item>
            <v-list-item-avatar
              :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
            >
              <v-icon
                :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
              >
                mdi-lock
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Password</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-dialog
                v-model="dialogPassword"
                scrollable
                persistent
                :overlay="false"
                max-width="360px"
                transition="dialog-transition"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ changePasswordShortLabel }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
                  >
                    {{ changePasswordLabel }}
                  </v-card-title>
                  <v-divider />
                  <v-form @submit.prevent="resetPass">
                    <v-card-text>
                      <v-alert
                        :value="passSuccess"
                        type="success"
                      >
                        <span color="white">Password successfully changed.</span>
                      </v-alert>
                      <v-alert
                        :value="passFail"
                        type="error"
                        text
                      >
                        <span color="white">Old Password is incorrect.</span>
                      </v-alert>
                      <v-alert
                        :value="passError"
                        type="error"
                      >
                        <span color="white">An Error Has Occurred. Please Try Again Later.</span>
                      </v-alert>
                      <v-text-field
                        v-if="user.hasPassword"
                        id="oldpassword"
                        v-model="oldpassword"
                        type="password"
                        label="Old Password"
                        name="oldpassword"
                        :rules="[rules.required]"
                        outlined
                      />
                      <v-text-field
                        id="newpassword"
                        v-model="newpassword"
                        name="password"
                        label="New Password"
                        messages="At least 8 characters and 1 special character."
                        :rules="passRules"
                        :type="showPass ? 'text' : 'password'"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        required
                        counter
                        error-count="2"
                        validate-on-blur
                        outlined
                        @click:append="showPass = !showPass"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        text
                        @click="dialogPassword = false;"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        type="submit"
                        color="primary"
                        :disabled="!passwordIsValid"
                        text
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
            </v-list-item-action>
          </v-list-item>
          <!-- <v-divider inset /> -->
          <v-list-item>
            <v-list-item-avatar
              :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
            >
              <v-icon
                :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
              >
                mdi-email
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle v-once v-text="email" />
            </v-list-item-content>
            <v-list-item-action>
              <v-dialog
                v-model="dialogEmail"
                scrollable
                persistent
                :overlay="false"
                max-width="360px"
                transition="dialog-transition"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    Change
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
                  >
                    Change Email
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-form @submit.prevent="changeUserEmail">
                      <v-text-field
                        id="email"
                        v-model="email"
                        label="Enter New Email"
                        name="email"
                        outlined
                      />
                      <v-text-field
                        id="epass"
                        v-model="epass"
                        type="password"
                        label="Enter Password"
                        name="epass"
                        outlined
                      />
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      text
                      @click="dialogEmail = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      type="submit"
                      color="primary"
                      text
                      :disabled="!emailIsValid"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list-item-action>
          </v-list-item>
          <!-- <v-divider inset /> -->
          <v-list-item>
            <v-list-item-avatar
              :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
            >
              <v-icon
                :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
              >
                mdi-phone
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Phone</v-list-item-title>
              <v-list-item-subtitle v-once v-text="phone" />
            </v-list-item-content>
            <v-list-item-action>
              <v-dialog
                v-model="dialogPhone"
                scrollable
                persistent
                :overlay="false"
                max-width="360px"
                transition="dialog-transition"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    Change
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
                  >
                    Change Phone Number
                  </v-card-title>
                  <v-divider />
                  <v-form ref="detailsForm" @submit.prevent="setPhone">
                    <v-card-text>
                      <v-text-field
                        id="phoneNumber"
                        v-model="phone"
                        type="text"
                        label="Your Phone Number"
                        name="phoneNumber"
                        outlined
                        hide-details="auto"
                        :rules="[rules.required]"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        text
                        @click="dialogPhone = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        type="submit"
                        color="primary"
                        text
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Payment Information
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-credit-card-outline
          </v-icon>
        </v-card-title>
        <v-divider />
        <v-list v-if="cards.data.length" two-line subheader>
          <v-subheader>
            Cards
          </v-subheader>
          <template v-for="(item, index) in cards.data">
            <v-list-item :key="`list-item-${index}`" two-line>
              <v-list-item-avatar
                :key="`avatar-${index}`"
                :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
                height="32px"
                rounded
              >
                <i :class="$vuetify.theme.dark ? `primary--text text--lighten-2 pf pf-${item.card.brand}` : `primary--text text--darken-2 pf pf-${item.card.brand}`" aria-hidden="true" :title="item.card.brand" />
              </v-list-item-avatar>

              <v-list-item-content :key="`content-${index}`">
                <v-list-item-title
                  class="font-weight-medium"
                >
                  •••• •••• ••••  {{ item.card.last4 }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Exp: {{ item.card.exp_month }}/{{ item.card.exp_year }}
                </v-list-item-subtitle>

                <v-flex />
              </v-list-item-content>
              <v-list-item-action>
                <v-btn v-if="index == 0" disabled text color="grey darken--2">
                  default
                </v-btn>
                <v-btn
                  v-else
                  color="primary"
                  text
                  @click="deleteCard(item.id)"
                >
                  Remove
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <!-- <v-divider v-if="index + 1 < cards.data.length" :key="`divider-${index}`" inset /> -->
          </template>
          <v-list-item dense>
            <v-list-item-title />
            <v-list-item-action>
              <v-spacer />
              <v-btn
                color="primary"
                outlined
                @click="dialogAddCard = !dialogAddCard"
              >
                Add Card
              </v-btn>
              <v-dialog v-model="dialogAddCard" width="450" max-width="100%">
                <add-card @done="done" />
              </v-dialog>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list v-else>
          <v-subheader>
            Cards
          </v-subheader>
          <v-list-item>
            <v-list-item-title>
              You have no cards on file.
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-divider />
        <!-- <v-list v-if="hasStripeID" two-line subheader>
          <v-subheader>
            Payouts
          </v-subheader>
          <v-list-item>
            <v-list-item-avatar
              :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
            >
              <v-avatar>
                <v-icon
                  :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
                >
                  mdi-currency-usd-circle
                </v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ balance }}</v-list-item-title>
              <v-list-item-subtitle>Estimated Balance</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <connect-button />
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list v-else>
          <v-subheader>
            Payouts
          </v-subheader>
          <v-alert type="warning" text class="mx-4">
            Before accepting payments, you must configure your payout options.
          </v-alert>
          <v-list-item dense>
            <v-list-item-title />
            <v-list-item-action>
              <v-spacer />
              <connect-button />
            </v-list-item-action>
          </v-list-item>
        </v-list> -->
      </v-card>
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          About
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-information
          </v-icon>
        </v-card-title>
        <v-expansion-panels accordion flat>
          <v-expansion-panel>
            <v-expansion-panel-header>Privacy Policy</v-expansion-panel-header>
            <v-expansion-panel-content>
              <privacy-policy />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Terms and Conditions</v-expansion-panel-header>
            <v-expansion-panel-content>
              <terms-of-service />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider />
      </v-card>
      <!-- <v-tabs
        slider-color="primary"
      >
        <v-tab ripple>
          Password
        </v-tab>
        <v-tab-item class="pt-2">
          <v-card flat>
            <v-card-title primary-title>
              <h3 class="text-h5 mb-0">
                Change Password
              </h3>
            </v-card-title>
            <form @submit.prevent="resetPass">
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="oldpassword"
                    v-model="oldpassword"
                    type="password"
                    label="Enter Old Password"
                    name="oldpassword"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="newpassword"
                    v-model="newpassword"
                    type="password"
                    label="Enter New Password"
                    name="newpassword"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="confirmpassword"
                    v-model="confirmpassword"
                    type="password"
                    label="Confirm New Password"
                    name="confirmpassword"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-btn
                    :disabled="!passwordIsValid"
                    type="submit"
                  >
                    Submit
                  </v-btn>
                </v-flex>
                <v-flex v-if="!passwordIsValid">
                  <span>New passwords do not match.</span>
                </v-flex>
              </v-layout>
            </form>
            <v-btn @click="forgotLog">
              Forgot Password?
            </v-btn>
          </v-card>
        </v-tab-item>
        <v-tab ripple>
          Email
        </v-tab>
        <v-tab-item class="pt-2">
          <v-card flat>
            <v-card-title primary-title>
              <h3 class="text-h5 mb-0">
                Change Email
              </h3>
            </v-card-title>
            <v-form @submit.prevent="changeUserEmail">
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="email"
                    v-model="email"
                    label="Enter New Email"
                    name="email"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="epass"
                    v-model="epass"
                    type="password"
                    label="Enter Password"
                    name="epass"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-btn
                    :disabled="!emailIsValid"
                    type="submit"
                  >
                    Submit
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card>
          <v-alert
            :value="emailSuccess"
            type="success"
          >
            <span color="white">Email successfully updated.</span>
          </v-alert>
          <v-alert
            :value="emailFail"
            type="error"
          >
            <span color="white">Password Incorrect.</span>
          </v-alert>
          <v-alert
            :value="emailError"
            type="error"
          >
            <span color="white">An Error Has Occurred. Please Try Again Later.</span>
          </v-alert>
        </v-tab-item>
        <v-tab ripple>
          Phone
        </v-tab>
        <v-tab-item class="pt-2">
          <v-card flat>
            <v-form ref="detailsForm" @submit.prevent="setPhone">
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="phoneNumber"
                    v-model="phone"
                    type="text"
                    label="Your Phone Number"
                    name="phoneNumber"
                    :rules="[rules.required]"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-btn
                    type="submit"
                    color="primary"
                  >
                    Save
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card>
          <v-alert
            :value="phoneSuccess"
            type="success"
          >
            <span color="white">Phone number successfully updated.</span>
          </v-alert>
        </v-tab-item>
      </v-tabs> -->
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import addCard from '~/components/add-card.vue'
// import connectButton from '~/components/connect-button.vue'
import privacyPolicy from '~/pages/privacy.vue'
import termsOfService from '~/pages/terms.vue'

export default {
    name: 'Settings',
    components: {
        'add-card': addCard,
        // 'connect-button': connectButton,
        'privacy-policy': privacyPolicy,
        'terms-of-service': termsOfService
    },
    async asyncData ({ params, store, app }) {
        const stripeGetPaymentMethods = app.$fire.functions.httpsCallable('stripeGetPaymentMethods')
        const customer_id = store.state.meta.stripeCustomerId
        return {
            cards: (store.state.meta.stripeCustomerId)
                ? (await stripeGetPaymentMethods({ customer: customer_id, type: 'card' })).data
                : { data: [] }
        }
    },
    data () {
        return {
            name: this.$store.getters['auth/activeUser'].displayName || null,
            email: this.$store.getters['auth/activeUser'].email,
            // phone: this.$store.getters['auth/activeUser'].phoneNumber || null,
            epass: '',
            emailSuccess: false,
            emailFail: false,
            emailError: false,
            // Phone variables
            phone: this.$store.state.meta.phone,
            confirmPhone: '',
            phoneSuccess: false,
            // Password variables
            oldpassword: '',
            newpassword: '',
            confirmpassword: '',
            showPass: false,
            passSuccess: false,
            passFail: false,
            passError: false,
            // Dialog Controls
            dialogName: false,
            dialogPassword: false,
            dialogEmail: false,
            dialogPhone: false,
            dialogAddCard: false,
            // Field Rules
            rules: {
                required: value => !!value || 'This field is required.',
                counter: value => value.length <= 20 || 'Max 20 characters',
                email: (value) => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }
            },
            special_characters: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '_', '-', '+', '=', '`', '|', '(', ')', '{', '}', '[', ']', ':', ';', "'", '<', '>', ',', '.', '?', '/'],
            passRules: [
                v => v.length >= 8 || 'Password must be at least 8 characters',
                v => this.special_characters.some(substring => v.includes(substring)) || 'Password must contain 1 special character'
            ],
            cards: {
                data: []
            },
            theme: localStorage.getItem('dark_theme'),
            // Notifications logic
            agentBool: this.$store.state.meta.agentUpdates !== false,
            pushBool: this.$store.state.meta.agentPush,
            // token: this.$store.state.meta.token,
            updateSuccess: false,
            alertHint: 'Please choose "Allow" if prompted by your device/browser.',
            geoError: 'You need to enable location services to use this feature.',
            deviceHasGeoLocation: false // Starts as read-only until we confirm geolocation
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/activeUser'
        }),
        nameIsValid () {
            return this.name !== ''
        },
        // rewriting this to not require confirm field
        // https://uxmovement.com/forms/why-the-confirm-password-field-must-die/
        passwordIsValid () {
            return this.newpassword.length >= 8 && this.special_characters.some(substring => this.newpassword.includes(substring))
        },
        emailIsValid () {
            return this.email !== '' && this.password !== ''
        },
        giveEmail () {
            return this.user.email
        },
        giveName () {
            console.log('name:', this.user.name)
            return this.user.name
        },
        usermeta () {
            return this.$store.state.meta
        },
        balance () {
            const { available } = this.$store.getters['meta/balance']
            return this.$utils.currencyFormat(available[0].amount, available[0].currency)
        },
        hasStripeID () {
            return (this.usermeta && this.usermeta.stripe && this.usermeta.stripe.stripe_user_id)
        },
        changePasswordLabel () {
            if (!this.user.hasPassword) {
                return 'Set Password'
            }
            return 'Change Password'
        },
        changePasswordShortLabel () {
            if (!this.user.hasPassword) {
                return 'Set'
            }
            return 'Change'
        }
    },
    mounted () {
    // console.log(Auth.currentUser);
        this.deviceHasGeoLocation = Boolean(navigator.geolocation)
    },
    methods: {
        async updateDetails () {
            if (this.$refs.detailsForm.validate()) {
                // console.log(this.phone, this.name);
                const user = this.$fire.auth.currentUser

                /**
                     * Can't set phoneNumber here
                     * @url https://www.reddit.com/r/Firebase/comments/70slpi/can_you_update_phonenumber_from_userprofile/
                     */
                await user.updateProfile({ // @todo Move this to Vuex
                    displayName: this.name
                    // phoneNumber: this.phone,
                })
                this.$store.commit('auth/SET_AUTH_USER', user)
                this.$toast.success('New name successfully saved.')
            }
        },
        resetPass () {
            if (!this.user.hasPassword) {
                this.updatePass()
            } else {
                this.$fire.auth.currentUser.reauthenticateWithCredential(
                    this.$fireModule.auth.EmailAuthProvider.credential(
                        this.$fire.auth.currentUser.email,
                        this.oldpassword
                    )
                ).then((success) => {
                    this.updatePass()
                }).catch((error) => {
                    console.log('error', error)
                    this.passFail = true
                })
            }
        },
        updatePass () {
            const user = this.$fire.auth.currentUser
            const newPassword = this.newpassword
            const hadPW = this.user.hasPassword

            user.updatePassword(newPassword).then((success) => {
                this.$toast.success('New password successfully saved.')
                this.newpassword = ''
                this.oldpassword = ''
                this.$store.commit('auth/SET_AUTH_USER_HAS_PASSWORD')
                // Close the dialog if already had a password, since the modal will now represent a different action (Change Password) from Set Password.
                if (!hadPW) {
                    this.dialogPassword = false
                }
            }).catch((error) => {
                console.log('unknown error', error)
                this.passError = true
            })
        },
        changeUserEmail () {
            this.$fire.auth.currentUser.reauthenticateWithCredential(
                this.$fireModule.auth.EmailAuthProvider.credential(
                    this.$fire.auth.currentUser.email,
                    this.epass
                )
            ).then((success) => {
                const user = this.$fire.auth.currentUser
                user.updateEmail(this.email).then((success) => {
                    this.emailSuccess = true
                }).catch((error) => {
                    console.log('error after reauthenticate', error)
                })
            }).catch((error) => {
                console.log(error)
                this.emailFail = true
            })
        },
        forgotLog () {
            this.$fire.auth.signOut().then(() => {
                console.log('logout complete')
                this.$router.replace('/password')
            }).catch((error) => {
                console.log(error)
            })
        },
        async setPhone () {
            if (this.phone !== null) {
                // Update phone number on the server
                await this.$fire.firestore.collection('user-meta').doc(this.$store.getters['auth/activeUser'].uid).set({
                    phone: this.phone
                }, { merge: true })

                // Update in local store
                this.$store.commit('meta/setPhone', this.phone)
                this.phoneSuccess = true
                this.$toast.success('New phone number successfully saved.')
                this.dialogPhone = false
            }
        },
        changeTheme () {
            // for some reason this doesn't work, even though this.theme gets properly updated by the button toggle group so for now the logic stays in the button group
            this.$vuetify.theme.dark = this.theme
        },
        setTheme () {
            localStorage.setItem('dark_theme', this.theme)
        },
        done () {
            // Close the dialog
            this.dialog = false

            this.reload()
        },
        async updateNotifications () {
            this.$store.commit('meta/setAgent', this.agentBool)
            await this.$store.dispatch('meta/save', 'agentUpdates')
            this.$toast.success('Notification preference successfully saved.')
        }
    }
}
</script>

<style scoped>

.v-dialog > .v-card > .v-card__title {
    padding: 16px;
}

.v-dialog > .v-card > .v-card__text {
  padding: 16px;
}

.theme--light.v-btn-toggle:not(.v-btn-toggle--group) .v-btn.v-btn .v-icon {
  color: inherit
}

.v-expansion-panel-header {
  padding: 16px;
}

</style>
