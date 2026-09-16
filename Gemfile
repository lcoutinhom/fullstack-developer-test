source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.1.3", ">= 8.1.3.1"
# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"
# Use sqlite3 as the database for Active Record
gem "sqlite3", ">= 2.1"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Deploy this application anywhere as a Docker container [https://kamal-deploy.org]
gem "kamal", require: false

# Add HTTP asset caching/compression and X-Sendfile acceleration to Puma [https://github.com/basecamp/thruster/]
gem "thruster", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
gem "image_processing", "~> 1.2"

# Server-driven single-page apps: React frontend served via Rails controllers [https://inertia-rails.dev]
gem "inertia_rails"
# Vite integration for the JS/CSS build (React + Tailwind) [https://vite-ruby.netlify.app]
gem "vite_rails"
# Parse .xlsx spreadsheets for the admin User import [https://github.com/roo-rb/roo]
gem "roo"
# Stream-download and attach remote files (avatar_image from a URL) [https://github.com/janko/down]
gem "down"
# Lightweight pagination for the admin Users index [https://github.com/ddnexus/pagy]
gem "pagy"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"

  # Audits gems for known security defects (use config/bundler-audit.yml to ignore issues)
  gem "bundler-audit", require: false

  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "brakeman", require: false

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false

  # RSpec test framework [https://github.com/rspec/rspec-rails]
  gem "rspec-rails"

  # Fixtures replacement with a straightforward definition syntax [https://github.com/thoughtbot/factory_bot_rails]
  gem "factory_bot_rails"

  # Stub and set expectations on HTTP requests (avatar_url downloads in specs) [https://github.com/bblimke/webmock]
  gem "webmock"

  # Run the test suite across multiple CPUs [https://github.com/grosser/parallel_tests]
  gem "parallel_tests"
end

group :test do
  # Acceptance test framework [https://github.com/teamcapybara/capybara]
  gem "capybara"

  # Browser driver for Capybara system specs (headless Chrome) [https://github.com/SeleniumHQ/selenium]
  gem "selenium-webdriver"

  # Code coverage reporting with an enforced minimum threshold [https://github.com/simplecov-ruby/simplecov]
  gem "simplecov", require: false

  # One-liner matchers for common Rails validations/associations [https://matchers.shoulda.io]
  gem "shoulda-matchers"
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
end
