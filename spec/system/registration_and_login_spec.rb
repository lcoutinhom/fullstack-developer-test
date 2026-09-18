require "rails_helper"

RSpec.describe "Registration and login", type: :system do
  it "lets a visitor register and lands them on their profile" do
    visit new_registration_path

    fill_in "Full name", with: "Grace Hopper"
    fill_in "Email address", with: "grace@example.com"
    fill_in "Password", with: "password123"
    fill_in "Repeat password", with: "password123"
    click_button "Sign up"

    expect(page).to have_content("My profile")
    expect(page).to have_content("Grace Hopper")
  end

  it "redirects a regular user to their profile and an admin to the dashboard" do
    create(:user, email: "user@example.com", password: "password123")
    admin = create(:user, :admin, email: "admin@example.com", password: "password123")

    visit new_session_path
    fill_in "Email address", with: "user@example.com"
    fill_in "Password", with: "password123"
    click_button "Sign in"
    expect(page).to have_content("My profile")

    click_button "Sign out"
    expect(page).to have_content("Sign in")

    fill_in "Email address", with: admin.email
    fill_in "Password", with: "password123"
    click_button "Sign in"
    expect(page).to have_content("Admin dashboard")
  end
end
