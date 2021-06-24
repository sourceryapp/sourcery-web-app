const initialState = () => {
    return {
        organizations: [],
        organization: {}
    }
}

export const state = initialState

export const getters = {
    getOrganization (state) {
        return state.organization
    },
    getOrganizations (state) {
        return state.organizations
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

    async getOrganization ({ commit }, identifier) {
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
        }
    }
}
