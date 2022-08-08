<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm-1>
      <file-manager :id="26" title="Attachments" title-class="text-h6" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { Request } from '~/models/Request'

export default {
    name: 'UploadTester',
    components: {
    },
    async asyncData ({ params, store, app }) {
        const logged_in = store.getters['supabaseAuth/authUser'] && store.getters['supabaseAuth/authUser'].id
        let requests = []
        let jobs = []
        if (logged_in) {
            const uid = store.getters['supabaseAuth/authUser'].id
            requests = await Request.getForCreator(uid, ['In Progress', 'Submitted', 'Complete'])
        }

        if (store.getters['supabaseAuth/ownsAnOrganization']) {
            const user_repositories = store.getters['supabaseAuth/userRepositories']
            jobs = await Request.getForRepositories(user_repositories, ['In Progress', 'Submitted', 'Complete', 'Archived'])
        }

        return {
            requests,
            jobs,
            organizations: []
        }
    },
    data () {
        return {
            requests: [],
            jobs: [],
            organizations: [],
            limit: 4
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            isOrgMember: 'supabaseAuth/ownsAnOrganization'
        }),
        pageTitle () {
            if (this.isOrgMember) {
                return 'Institutional Dashboard'
            }
            return 'Dashboard'
        },
        newJobs () {
            return this.jobs.filter(x => x.status?.name === 'Submitted')
        },
        inProgressJobs () {
            return this.jobs.filter(x => x.status?.name === 'In Progress')
        },
        completedJobs () {
            return this.jobs.filter(x => x.status?.name === 'Complete')
        },
        completedAndArchivedJobs () {
            return this.jobs.filter(x => x.status?.name === 'Complete' || x.status?.name === 'Archived')
        },
        newJobsLimited () {
            return this.newJobs.slice(0, this.limit)
        },
        inProgressJobsLimited () {
            return this.inProgressJobs.slice(0, this.limit)
        },
        completedJobsLimited () {
            return this.completedJobs.slice(0, this.limit)
        }
    }
}
</script>

<style scoped>
.institutional-job {
    border: 1px solid var(--v-primary-base);
    padding: 1em
}
</style>
