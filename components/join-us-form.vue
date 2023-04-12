<template>
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
            :rules="accountEmail"
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
                :rules="institutionAddress2Rules"
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
              <v-text-field
                v-model="institutionState"
                v-form
                :rules="institutionStateRules"
                required
                dense
                outlined
                placeholder="State*"
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
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
export default {
    name: 'JoinUsForm'
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
