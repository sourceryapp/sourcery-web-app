<template>
  <v-container>
    <v-card flat tile class="mb-4 rounded-lg pt-6 pb-3 px-6 grey-bg">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col sm="12">
            <h1 font-weight-light>
              Institutional Sign Up
            </h1>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col sm="12">
            <p>What is the name of your institution?</p>
            <v-text-field
              v-model="institutionName"
              v-form
              :rules="institutionNameRules"
              required
              dense
              outlined
              placeholder="Institution Name*"
              class="italic-placeholder"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col sm="12">
            <p>What is the name of the repository?</p>
            <v-text-field
              v-model="repository"
              v-form
              :rules="repositoryRules"
              required
              dense
              outlined
              placeholder="Repository Name*"
              class="italic-placeholder"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col sm="12">
            <p class="pb-0">
              What email address should be used for the Sourcery account?
            </p>
            <span class="smaller-italic">
              This address will be used to field requests and for email notifications.
              We recommend using a non-personal institutional email address that anyone fulfilling requests can access,
              such as “requestservice@institution.org”
            </span>
            <v-text-field
              v-model="accountEmail"
              v-form
              :rules="accountEmailRules"
              required
              dense
              outlined
              placeholder="Account Email Address*"
              class="pt-2 italic-placeholder"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col sm="12">
            <p>What is the repository's website?</p>
            <v-text-field
              v-model="repositoryWebsite"
              v-form
              :rules="repositoryWebsiteRules"
              required
              dense
              outlined
              placeholder="Link or URL*"
              class="italic-placeholder"
            />
          </v-col>
        </v-row>
        <v-row dense class="pb-0">
          <v-col sm="12">
            <p>What is the Institution's physical address?</p>
            <v-row dense>
              <v-col sm="7" dense>
                <v-text-field
                  v-model="institutionAddress"
                  v-form
                  :rules="institutionAddressRules"
                  required
                  dense
                  outlined
                  placeholder="Street Address*"
                  class="italic-placeholder"
                />
              </v-col>
              <v-col sm="5" dense>
                <v-text-field
                  v-model="institutionAddress2"
                  v-form
                  dense
                  outlined
                  placeholder="Address Line 2"
                  class="italic-placeholder"
                />
              </v-col>
            </v-row>
            <v-row dense class="mt-0 pt-0 location-row">
              <v-col sm="4">
                <v-text-field
                  v-model="institutionCity"
                  v-form
                  :rules="institutionCityRules"
                  required
                  dense
                  outlined
                  placeholder="City*"
                  class="italic-placeholder"
                />
              </v-col>
              <v-col sm="4">
                <v-select
                  v-model="institutionState"
                  v-form
                  :items="states"
                  :rules="[v => !!v || 'State is required']"
                  required
                  dense
                  item-value="code"
                  item-text="name"
                  placeholder="State*"
                  outlined
                  clearable
                  class="italic-placeholder"
                />
              </v-col>
              <v-col sm="4">
                <v-text-field
                  v-model="institutionZip"
                  v-form
                  :rules="institutionZipRules"
                  required
                  dense
                  outlined
                  placeholder="Zip Code*"
                  class="italic-placeholder"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col sm="12">
                <p>If you have a repository photo that you would like to be included on the Sourcery site, please email it to sourceryapp@gmail.com</p>
                <v-radio-group v-model="photoOption">
                  <v-radio label="I am sending a photo to the email address" value="sending" />
                  <v-radio label="I am not sending a photo to the email address" value="not_sending" />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col sm="12">
                <p>Who should we contact for any additional details?</p>
                <v-text-field
                  v-model="contactName"
                  v-form
                  :rules="contactNameRules"
                  required
                  dense
                  outlined
                  placeholder="First and Last Name*"
                  class="italic-placeholder"
                />
                <v-text-field
                  v-model="contactEmail"
                  v-form
                  :rules="contactEmailRules"
                  required
                  dense
                  outlined
                  placeholder="Contact Email Address*"
                  class="italic-placeholder"
                />
              </v-col>
            </v-row>
            <v-row dense class="d-flex justify-space-between mt-0 mb-2">
              <v-col cols="auto">
                <v-btn
                  large
                  color="rgb(146, 79, 190)"
                  @click="submitForm"
                >
                  <span class="font-weight-medium" style="color: white;">Submit</span>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  large
                  text
                  color="rgb(146, 79, 190)"
                  @click="resetForm"
                >
                  <span class="font-weight-medium" style="color: white;">Clear Form</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
    name: 'JoinUsForm',
    data: () => ({
        valid: true,
        institutionName: '',
        repository: '',
        accountEmail: '',
        repositoryWebsite: '',
        institutionAddress: '',
        institutionAddress2: '',
        institutionCity: '',
        institutionState: '',
        institutionZip: '',
        photoOption: '',
        contactName: '',
        contactEmail: '',
        institutionNameRules: [
            v => !!v || 'Institution Name is required'
        ],
        repositoryRules: [
            v => !!v || 'Repository Name is required'
        ],
        accountEmailRules: [
            v => !!v || 'Account Email is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        repositoryWebsiteRules: [
            v => !!v || 'Repository Website is required'
        ],
        institutionAddressRules: [
            v => !!v || 'Institution Address is required'
        ],
        institutionCityRules: [
            v => !!v || 'Institution City is required'
        ],
        institutionZipRules: [
            v => !!v || 'Institution Zip Code is required',
            v => /^\d{5}$/.test(v) || 'Zip code must be 5 digits'
        ],
        contactNameRules: [
            v => !!v || 'Contact Name is required'
        ],
        contactEmailRules: [
            v => !!v || 'Contact Email is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        states: [
            { name: 'AL', code: 'Alabama' },
            { name: 'AK', code: 'Alaska' },
            { name: 'AZ', code: 'Arizona' },
            { name: 'AR', code: 'Arkansas' },
            { name: 'CA', code: 'California' },
            { name: 'CO', code: 'Colorado' },
            { name: 'CT', code: 'Connecticut' },
            { name: 'DE', code: 'Delaware' },
            { name: 'DC', code: 'District Of Columbia' },
            { name: 'FL', code: 'Florida' },
            { name: 'GA', code: 'Georgia' },
            { name: 'HI', code: 'Hawaii' },
            { name: 'ID', code: 'Idaho' },
            { name: 'IL', code: 'Illinois' },
            { name: 'IN', code: 'Indiana' },
            { name: 'IA', code: 'Iowa' },
            { name: 'KS', code: 'Kansas' },
            { name: 'KY', code: 'Kentucky' },
            { name: 'LA', code: 'Louisiana' },
            { name: 'ME', code: 'Maine' },
            { name: 'MD', code: 'Maryland' },
            { name: 'MA', code: 'Massachusetts' },
            { name: 'MI', code: 'Michigan' },
            { name: 'MN', code: 'Minnesota' },
            { name: 'MS', code: 'Mississippi' },
            { name: 'MO', code: 'Missouri' },
            { name: 'MT', code: 'Montana' },
            { name: 'NE', code: 'Nebraska' },
            { name: 'NV', code: 'Nevada' },
            { name: 'NH', code: 'New Hampshire' },
            { name: 'NJ', code: 'New Jersey' },
            { name: 'NM', code: 'New Mexico' },
            { name: 'NY', code: 'New York' },
            { name: 'NC', code: 'North Carolina' },
            { name: 'ND', code: 'North Dakota' },
            { name: 'OH', code: 'Ohio' },
            { name: 'OK', code: 'Oklahoma' },
            { name: 'OR', code: 'Oregon' },
            { name: 'PA', code: 'Pennsylvania' },
            { name: 'RI', code: 'Rhode Island' },
            { name: 'SC', code: 'South Carolina' },
            { name: 'SD', code: 'South Dakota' },
            { name: 'TN', code: 'Tennessee' },
            { name: 'TX', code: 'Texas' },
            { name: 'UT', code: 'Utah' },
            { name: 'VT', code: 'Vermont' },
            { name: 'VA', code: 'Virginia' },
            { name: 'WA', code: 'Washington' },
            { name: 'WV', code: 'West Virginia' },
            { name: 'WI', code: 'Wisconsin' },
            { name: 'WY', code: 'Wyoming' }
        ],
        selectedState: ''
    }),
    methods: {
        submitForm () {
            this.validate()
        },
        resetForm () {
            this.reset()
            this.resetValidation()
        },
        validate () {
            if (this.$refs.form.validate()) {
                this.$emit('submit-form', 'true')
            }
        },
        reset () {
            this.$refs.form.reset()
        },
        resetValidation () {
            this.$refs.form.resetValidation()
        }
    }
}
</script>

<style>
.theme--light.grey-bg {
    background-color: #F5F5F5;
}

.italic-placeholder ::placeholder {
  font-style: italic;
}

.smaller-italic {
  font-size: 0.9rem;
  font-style: italic;
}

</style>
