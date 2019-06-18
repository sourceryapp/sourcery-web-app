workflow "Build Test" {
  on = "push"
  resolves = ["nuxt/actions-yarn@master"]
}

action "Is a feature branch?" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "branch feature/*"
}

action "https://github.com/nuxt/actions-yarn" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Is a feature branch?"]
  args = "install"
}

action "nuxt/actions-yarn@master" {
  uses = "nuxt/actions-yarn@master"
  needs = ["https://github.com/nuxt/actions-yarn"]
  args = "run heroku-postbuild"
  env = {
    NODE_ENV = "production"
  }
}
