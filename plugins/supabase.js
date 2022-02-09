import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)
export default function setStore ({ store, app: { router } }) {
    console.log('setting supabase store from plugin')
    store.commit('supabase/setAuthUser', supabase.auth.user())

    supabase.auth.onAuthStateChange((_, session) => {
        console.log(_, session)
        if (_ === 'SIGNED_OUT') {
            store.commit('supabase/clear')
            router.push('/login/supabase')
            return
        }

        if (session && session.user) {
            store.commit('supabase/setAuthUser', session.user)
        }
    })
}
