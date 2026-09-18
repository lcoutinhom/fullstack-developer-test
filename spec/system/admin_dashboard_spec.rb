require "rails_helper"

RSpec.describe "Admin dashboard", type: :system do
  it "shows counts and updates them live when a user is created elsewhere" do
    admin = create(:user, :admin, password: "password123")

    visit new_session_path
    fill_in "Email address", with: admin.email
    fill_in "Password", with: "password123"
    click_button "Sign in"

    expect(page).to have_content("Admin dashboard")
    expect(page).to have_selector("[data-testid='total-users']", text: "1")

    create(:user)

    expect(page).to have_selector("[data-testid='total-users']", text: "2")
    expect(page).to have_selector("[data-testid='regular-users']", text: "1")
  end
end
