import { createClient } from '@supabase/supabase-js'
import { PostgrestClient } from '@supabase/postgrest-js'

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

export const postgrest = new PostgrestClient(process.env.SUPABASE_URL)

export default async function setStore ({ store, app: { router } }) {
    console.log('setting supabase store from plugin')
    store.commit('supabaseAuth/setAuthUser', supabase.auth.user())
    await store.dispatch('supabaseAuth/fetchUserMeta')
    await store.dispatch('supabaseAuth/fetchUserOrganizations')
    await store.dispatch('supabaseAuth/fetchUserHasPassword')

    supabase.auth.onAuthStateChange(async (_, session) => {
        console.log(_, session)
        if (_ === 'SIGNED_OUT') {
            console.log('registered signed out')
            store.commit('supabaseAuth/clear')
            router.push('/login')
            return
        }

        if (session && session.user) {
            console.log('registered sign in')
            store.commit('supabaseAuth/setAuthUser', session.user)
            await store.dispatch('supabaseAuth/fetchUserMeta')
            await store.dispatch('supabaseAuth/fetchUserOrganizations')
            await store.dispatch('supabaseAuth/fetchUserHasPassword')
            router.push('/dashboard')
        }
    })
}
