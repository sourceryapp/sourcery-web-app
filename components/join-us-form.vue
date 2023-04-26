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
              dense
              outlined
              placeholder="Repository Name"
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
              dense
              outlined
              placeholder="Link or URL"
              class="italic-placeholder"
            />
          </v-col>
        </v-row>
        <v-container class="mx-0 px-0 my-0 py-0">
          <v-row dense class="pb-0">
            <v-col sm="12">
              <p>What is the Institution's physical address?</p>
              <v-row dense>
                <v-col sm="7" dense>
                  <v-text-field
                    v-model="institutionAddress"
                    :rules="institutionAddressRules"
                    required
                    dense
                    outlined
                    placeholder="Street Address*"
                    class="italic-placeholder"
                  />
                </v-col>
                <v-col sm="5">
                  <v-text-field
                    v-model="institutionCity"
                    :rules="institutionCityRules"
                    required
                    dense
                    outlined
                    placeholder="City*"
                    class="italic-placeholder"
                  />
                </v-col>
              </v-row>
              <v-row dense class="my-0 py-0">
                <v-col sm="6">
                  <v-select
                    v-model="institutionState"
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
                <v-col sm="6">
                  <v-text-field
                    v-model="institutionZip"
                    :rules="institutionZipRules"
                    required
                    dense
                    outlined
                    placeholder="Zip Code*"
                    class="italic-placeholder"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
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
            <p>Please provide your contact information</p>
            <v-text-field
              v-model="contactName"
              :rules="contactNameRules"
              required
              dense
              outlined
              placeholder="First and Last Name*"
              class="italic-placeholder"
            />
            <v-text-field
              v-model="contactEmail"
              :rules="contactEmailRules"
              required
              dense
              outlined
              placeholder="Contact Email Address*"
              class="italic-placeholder"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col sm="12">
            <p>Would you like to provide any additional details?</p>
            <v-textarea
              v-model="additionalDetails"
              dense
              outlined
              placeholder="Let us know!"
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
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { supabase } from '~/plugins/supabase'

export default {
    name: 'JoinUsForm',
    data: () => ({
        valid: true,
        institutionName: '',
        repository: '',
        accountEmail: '',
        repositoryWebsite: '',
        institutionAddress: '',
        institutionCity: '',
        institutionState: '',
        institutionZip: '',
        addressTwo: false,
        photoOption: '',
        contactName: '',
        contactEmail: '',
        additionalDetails: '',
        institutionNameRules: [
            v => !!v || 'Institution Name is required'
        ],
        accountEmailRules: [
            v => !!v || 'Account Email is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
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
            { code: 'AL', name: 'Alabama' },
            { code: 'AK', name: 'Alaska' },
            { code: 'AZ', name: 'Arizona' },
            { code: 'AR', name: 'Arkansas' },
            { code: 'CA', name: 'California' },
            { code: 'CO', name: 'Colorado' },
            { code: 'CT', name: 'Connecticut' },
            { code: 'DE', name: 'Delaware' },
            { code: 'DC', name: 'District Of Columbia' },
            { code: 'FL', name: 'Florida' },
            { code: 'GA', name: 'Georgia' },
            { code: 'HI', name: 'Hawaii' },
            { code: 'ID', name: 'Idaho' },
            { code: 'IL', name: 'Illinois' },
            { code: 'IN', name: 'Indiana' },
            { code: 'IA', name: 'Iowa' },
            { code: 'KS', name: 'Kansas' },
            { code: 'KY', name: 'Kentucky' },
            { code: 'LA', name: 'Louisiana' },
            { code: 'ME', name: 'Maine' },
            { code: 'MD', name: 'Maryland' },
            { code: 'MA', name: 'Massachusetts' },
            { code: 'MI', name: 'Michigan' },
            { code: 'MN', name: 'Minnesota' },
            { code: 'MS', name: 'Mississippi' },
            { code: 'MO', name: 'Missouri' },
            { code: 'MT', name: 'Montana' },
            { code: 'NE', name: 'Nebraska' },
            { code: 'NV', name: 'Nevada' },
            { code: 'NH', name: 'New Hampshire' },
            { code: 'NJ', name: 'New Jersey' },
            { code: 'NM', name: 'New Mexico' },
            { code: 'NY', name: 'New York' },
            { code: 'NC', name: 'North Carolina' },
            { code: 'ND', name: 'North Dakota' },
            { code: 'OH', name: 'Ohio' },
            { code: 'OK', name: 'Oklahoma' },
            { code: 'OR', name: 'Oregon' },
            { code: 'PA', name: 'Pennsylvania' },
            { code: 'RI', name: 'Rhode Island' },
            { code: 'SC', name: 'South Carolina' },
            { code: 'SD', name: 'South Dakota' },
            { code: 'TN', name: 'Tennessee' },
            { code: 'TX', name: 'Texas' },
            { code: 'UT', name: 'Utah' },
            { code: 'VT', name: 'Vermont' },
            { code: 'VA', name: 'Virginia' },
            { code: 'WA', name: 'Washington' },
            { code: 'WV', name: 'West Virginia' },
            { code: 'WI', name: 'Wisconsin' },
            { code: 'WY', name: 'Wyoming' }
        ]
    }),
    methods: {
        async submitForm () {
            if (this.$refs.form.validate()) {
                this.$emit('submit-form', 'true')

                const { data, error } = await supabase
                    .from('institution-ingestion')
                    .insert([
                        {
                            name: this.institutionName,
                            repository: this.repository,
                            account_email: this.accountEmail,
                            website: this.repositoryWebsite,
                            address: this.institutionAddress,
                            city: this.institutionCity,
                            state: this.institutionState,
                            zip: this.institutionZip,
                            photo_option: this.photoOption,
                            contact_name: this.contactName,
                            contact_email: this.contactEmail,
                            additional_details: this.additionalDetails
                        }
                    ])
                if (error) {
                    console.log(error)
                } else {
                    console.log(data)
                }
            }
        },
        resetForm () {
            if (this.addressTwo) {
                this.addressTwo = false
            }
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
        },
        addAddress () {
            this.addressTwo = true
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
