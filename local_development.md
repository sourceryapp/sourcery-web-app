# Local Development

This is a supabase project, and has been designed to be run locally with supabase.  You will need to install Supabase CLI onto your machine, as well as have Docker Desktop installed.  You can find instructions for the Supabase CLI [here](https://supabase.com/docs/guides/cli/getting-started).

For WSL on Intel Windows, using Ubuntu image, I recommend using Docker Desktop installed through Windows that connects to WSL, and for the CLI releases I had to download the .deb from the [releases page](https://github.com/supabase/cli/releases) and install it manually with `sudo dpkg -i <path/to/file>.deb`.

Once you have installed the CLI, you will need to run the following commands:

```bash
supabase start
```

This command takes a while the first time you run because it will download the docker images & print information to your terminal on the services running in the background and their ports.

Make sure to check out the [supabase local development documentation](https://supabase.com/docs/guides/cli/local-development) for additional commands and tips.

- Local Dashboard: [http://localhost:54323/](http://localhost:54323/)


## Running Migrations

You can clear your local database and start fresh with all migrations with:

```bash
supabase db reset
```


## Creating New Migrations

Create a new migration file if you want to write your own SQL:

```bash
supabase migration new <name>
```

You are always welcome to write your own SQL, however you can use the local dashboard to make changes as well and then just diff the database to create a migration:

```bash
supabase db diff -f <migration_name>
```