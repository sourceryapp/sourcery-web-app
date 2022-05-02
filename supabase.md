## Temporary Supabase Documentation

Requirements:

- Deno Runtime Installed (homebrew)
- - The Deno extension for VSCode appears to be helpful.
- Supabase CLI installed (homebrew)
- Login to the CLI using the command: `supabase login`. [Docs](https://supabase.com/docs/reference/cli/installing-and-updating).
- Initialize Supabase inside your project using the command: `supabase init`. [Docs](https://supabase.com/docs/reference/cli/installing-and-updating).
- Link to your Remote Project using the command `supabase link --project-ref your-project-ref`. Project ref here is the unique ID in the supabase backend.
- - Dev: `csfzqcahdlzghhzgbvtq`

There are decent docs on how to run supabase locally: [Docs](https://supabase.com/docs/guides/local-development#start-supabase)


## Serving functions locally

In order to initialize a local instance of supabase, you must run `supabase start` (from the supabase local docs, only have to run this once).  This will take a while and install all the local tooling for supabase, and provide you anon/service keys for your local instance.  I personally saved all of these vars to a `.env.local` file for later use.

Next, `supabase functions serve <name>`.  This will serve a single function at a time, which is all that is supported.

You can run like this to include these variables: `supabase functions serve <name> --env-file ./supabase/.env.local`

Ex. `supabase functions serve notify --env-file ./supabase/.env.local`

## Testing Functions

Supabase has good docs on this, but essentially an HTTP POST request to your local instance, with a bearer token, is all you need to test the function once it is being served locally.

For example:

```bash
curl --location --request POST 'http://localhost:54321/functions/v1/notify' \
--header 'Authorization: Bearer <token-here>' \
--header 'Content-Type: application/json' \
--data-raw '{ "name":"Brian" }'
```

Postman is a great application to test and save these, and make slight modifications to them for your testing.

## Viewing Emails

Supabase uses email to send auth/verification links.  You can view the captured email locally on the INBUCKET_URL which is typically `http://localhost:54324`.

## Testing Authentication Locally

So this one is a bit tricky.

The dashboard lives at the Studio URL, typically: `http://localhost:54323`.

You can create users/tables here.

Now, in `supabase/siteSim`, there exists a test page to sign in and retrieve a bearer token.  Run the following and then you can access it at `http://localhost:8000`

```
cd supabase/siteSim
python -m SimpleHTTPServer
```

If you sign in, you can visit the InBucket URL (see above), and click the link provided in the most recent email.  It will redirect you back, where you click "Check User" button and retrieve the bearer token.

## Create new function.

This will place a new function in `supabase/functions/<name>/index.ts`.

`supabase functions new <name>`


## Decoded JWT Structure

```json
{
    "aud": "authenticated",
    "exp": 1650922043,
    "sub": "d84473ae-ece6-4448-aacd-def926f5fda6",
    "email": "brian.kelleher@uconn.edu",
    "phone": "",
    "app_metadata": {
        "provider": "email",
        "providers": [
            "email"
        ]
    },
    "user_metadata": {},
    "role": "authenticated"
}
```

## Deploy Functions

```bash
supabase functions deploy <name>
```

Example:

```bash
supabase functions deploy notify
```

## Update Env Vars

```bash
supabase secrets set --env-file ./supabase/.env

- OR -

supabase secrets set YOUR_ENV_VAR=value
```

List Secrets

```
supabase secrets list
```

