import { createClient } from '@supabase/supabase-js'
import { PostgrestClient } from '@supabase/postgrest-js'

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

export const postgrest = new PostgrestClient(process.env.SUPABASE_URL)

export default function setStore ({ store, app: { router } }) {
    console.log('setting supabase store from plugin')
    store.commit('supabaseAuth/setAuthUser', supabase.auth.user())
    store.dispatch('supabaseAuth/fetchUserMeta')
    store.dispatch('supabaseAuth/fetchUserOrganizations')
    store.dispatch('supabaseAuth/fetchUserHasPassword')

    supabase.auth.onAuthStateChange((_, session) => {
        console.log(_, session)
        if (_ === 'SIGNED_OUT') {
            store.commit('supabaseAuth/clear')
            router.push('/login/supabase')
            return
        }

        if (session && session.user) {
            store.commit('supabaseAuth/setAuthUser', session.user)
            store.dispatch('supabaseAuth/fetchUserMeta')
            store.dispatch('supabaseAuth/fetchUserOrganizations')
            store.dispatch('supabaseAuth/fetchUserHasPassword')
        }
    })
}
