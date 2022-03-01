export default function ({ store, redirect, route, $config }) {
    const vars = {}
    // REGEX to match hash and query params (#= and &=)
    route.fullPath.replace(/[?&|?#]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value
    })

    if (vars.type && vars.type === 'recovery' && vars.access_token) {
        console.log('Password Recovery Attempt')
        store.commit('supabaseAuth/setResetAccessToken', vars.access_token)
        return redirect('/resetpassword')
    }
}
