require "rails_helper"

RSpec.describe "Admin user management", type: :system do
  def sign_in_as(user, password: "password123")
    visit new_session_path
    fill_in "Email address", with: user.email
    fill_in "Password", with: password
    click_button "Sign in"

    expect(page).to have_button("Sign out") # wait for the (async) login to actually land
  end

  it "creates, edits, toggles the role of, and deletes a user" do
    admin = create(:user, :admin, password: "password123")
    sign_in_as(admin)

    visit admin_users_path

    click_link "New user"
    fill_in "Full name", with: "Katherine Johnson"
    fill_in "Email address", with: "katherine@example.com"
    click_button "Create user"

    expect(page).to have_content("Users")
    expect(page).to have_content("Katherine Johnson")

    within("tr", text: "Katherine Johnson") { click_link "Edit" }
    fill_in "Full name", with: "Katherine G. Johnson"
    click_button "Save"

    expect(page).to have_content("Katherine G. Johnson")

    within("tr", text: "Katherine G. Johnson") { click_button "Make admin" }
    within("tr", text: "Katherine G. Johnson") { expect(page).to have_content("Admin") }

    accept_confirm do
      within("tr", text: "Katherine G. Johnson") { click_button "Delete" }
    end

    expect(page).to have_content("Katherine G. Johnson was deleted")
    expect(page).to have_no_selector("table", text: "Katherine G. Johnson")
  end
end
