# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

gem "jekyll", "~> 4.4"
# CVE-2026-38969: upstream's trailer-parsing fix is not yet in a release.
# Return to a released gem once it includes https://github.com/ruby/webrick/pull/199.
gem "webrick", "~> 1.9", git: "https://github.com/ruby/webrick.git", ref: "25b0e9206bf5991c6274893d53c428d23b3f2292"
