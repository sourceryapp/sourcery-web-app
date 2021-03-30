<template>
  <v-layout align-center>
    <v-flex xs12 sm6 offset-sm3 lg4 offset-lg4>
      <v-form @submit.prevent="save">
        <h2 class="text-center">
          What do you want to do?
        </h2>
        <v-card
          v-ripple="{class: &quot;primary--text&quot;}"
          class="selection-card"
          flat
          :active="accountType == &quot;researcher&quot;"
          @click.native="selectResearcher()"
        >
          <v-card-text class="text-center">
            I want to request documents.
          </v-card-text>
        </v-card>
        <p class="text-center disclaimer-text">
          (requires credit card)
        </p>
        <v-card
          v-ripple="{class: &quot;primary--text&quot;}"
          class="selection-card"
          flat
          :active="accountType == &quot;sourcerer&quot;"
          @click.native="selectSourcerer()"
        >
          <v-card-text class="text-center">
            I want to fulfill document requests for other researchers.
          </v-card-text>
        </v-card>
        <p class="text-center disclaimer-text">
          (requires debit card or bank info)
        </p>
        <p class="text-center regardless">
          Regardless of how you initially sign up, you can still choose to submit or fulfill requests later on.
        </p>
        <div class="hidden-xs-only">
          <v-btn
            block
            large
            depressed
            type="submit"
            value="Register"
            color="primary"
            :disabled="disabled"
          >
            NEXT
          </v-btn>
          <v-btn block large color="primary" outline to="/login">
            Cancel
          </v-btn>
        </div>
        <v-card min-width="100%" class="bottom-buttons hidden-sm-and-up">
          <v-btn
            block
            large
            depressed
            type="submit"
            value="Register"
            color="primary"
            :disabled="disabled"
          >
            NEXT
          </v-btn>
          <v-btn block large color="primary" outline to="/login">
            Cancel
          </v-btn>
        </v-card>
        <v-spacer style="height: 122px;" />
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
    name: 'AccountType',

    data () {
        return {
            accountType: '',
            disabled: true
        }
    },
    methods: {
        async save () {
            if (this.accountType === 'researcher') {
                this.$store.commit('meta/setResearcher', true)
                await this.$store.dispatch('meta/save', 'researcher')
            } else {
                this.$store.commit('meta/setSourcerer', true)
                await this.$store.dispatch('meta/save', 'sourcerer')
            }

            this.$router.push({ name: 'dashboard' })
        },
        selectResearcher () {
            this.accountType = 'researcher'
            this.disabled = false
        },
        selectSourcerer () {
            this.accountType = 'sourcerer'
            this.disabled = false
        }
    }
}
</script>

<style scoped>
.selection-card {
    background: #F3F1F6;
    border: 3px solid #BDB2DA;
    border-radius: 12px;
    cursor: pointer;
    color: #55428B;
}
.selection-card[active=true] {
    background: rgba(101, 78, 163, 0.3);
    border: 3px solid #654EA3;
    border-radius: 12px;
    color: #4A3A74;
}
.bottom-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 6px 12px;
    border-radius: 20px 20px 0px 0px;
    z-index: 5;
}
h2 {
    margin-bottom: 12px;
    font-size: 26px;
}
.v-card__text.text-xs-center {
    font-size: 20px;
    line-height: 26px;
}
.disclaimer-text {
    font-style: italic;
    font-size: 13px;
    line-height: 32px;
    color: #55428B;
}
.regardless {
font-weight: 600;
font-size: 15px;
line-height: 18px;
color: #4A3A74;
}
</style>
