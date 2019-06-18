workflow "Build Test" {
  on = "pull_request"
  resolves = ["Run Build Process"]
}

action "Is a feature branch?" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "branch feature/*"
}

action "Install dependencies" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Is a feature branch?"]
  args = "install"
}

action "Run Build Process" {
  uses = "nuxt/actions-yarn@master"
  args = "run heroku-postbuild"
  env = {
    NODE_ENV = "production"
  }
  needs = ["Install dependencies"]
}
