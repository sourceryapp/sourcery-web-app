const initialState = () => {
    return {
        organizations: [],
        organization: {},
        // Not used yet, but intended to hold dashboard information.  Firebase cant currently count records without detrimental performance.
        organization_counts: {
            new: 0,
            progress: 0,
            completed: 0,
            revenue: '$0'
        },
        organization_repositories: []
    }
}

export const state = initialState

export const getters = {
    getOrganization (state) {
        return state.organization
    },
    getOrganizations (state) {
        return state.organizations
    },
    getOrganizationRepositories (state) {
        return state.organization_repositories
    },
    getOrganizationCounts (state) {
        return state.organization_counts
    }
}

export const mutations = {
    RESET_STORE: (state) => {
        Object.assign(state, initialState())
    },

    SET_ORGANIZATION: (state, val) => {
        state.organization = val
    },

    SET_ORGANIZATIONS: (state, val) => {
        state.organizations = val
    },

    SET_ORGANIZATION_REPOSITORIES: (state, val) => {
        state.organization_repositories = val
    }
}

export const actions = {
    async getOrganizations ({ commit }) {
        const organizations = await this.$fire.firestore.collection('organization').get()
        if (organizations && organizations.docs) {
            const organizations_extracted = organizations.docs.map((org) => {
                return {
                    id: org.id,
                    ...org.data()
                }
            })

            commit('SET_ORGANIZATIONS', organizations_extracted)
        }
    },

    async getOrganization ({ commit, dispatch }, identifier) {
        // Organization Slugs are to enable both ID & pretty URL
        const organization_slug = await this.$fire.firestore.collection('organization-slugs').doc(identifier).get()
        let orgid = identifier

        if (organization_slug && organization_slug.exists) {
            orgid = organization_slug.data().organization
        }

        const organization = await this.$fire.firestore.collection('organization').doc(orgid).get()

        if (organization && organization.exists) {
            commit('SET_ORGANIZATION', {
                id: organization.id,
                ...organization.data()
            })

            dispatch('getOrganizationRepositories')
        }
    },

    async getOrganizationRepositories ({ commit, state }) {
        const organization_repositories = await this.$fire.firestore.collection('repositories')
            .where('organization', '==', state.organization.id)
            .get()

        if (organization_repositories) {
            const org_repos = organization_repositories.docs.map((or) => {
                return {
                    id: or.id,
                    ...or.data()
                }
            })
            commit('SET_ORGANIZATION_REPOSITORIES', org_repos)
        }
    }
}
