# Selenium/Chrome's very first command in a freshly booted process can be
# slow enough that Capybara's own wait-and-retry loop still isn't enough
# (this isn't a "wait longer for the DOM" problem — the driver's session
# itself is still settling). Paying that cold-start cost once, before any
# real spec's timing-sensitive interaction, avoids flaking on whichever
# system spec happens to run first.
module SystemSpecWarmup
  def self.run_once
    return if @done
    @done = true
    yield
  end
end

RSpec.configure do |config|
  config.before(:each, type: :system) do
    SystemSpecWarmup.run_once do
      # rspec-rails only assigns the real driver via a `before` hook it
      # registers during the *first* example's #initialize — which can run
      # after this one, leaving this visit on the (useless) default driver.
      # Force it explicitly so the warmup actually exercises Selenium.
      Capybara.current_driver = :selenium_chrome_headless
      visit "/up"
    end
  end
end
