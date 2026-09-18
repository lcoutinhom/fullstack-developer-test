require "rails_helper"

RSpec.describe "Spreadsheet import", type: :system do
  include ActiveJob::TestHelper

  it "uploads a file and watches the progress bar reach completion" do
    admin = create(:user, :admin, password: "password123")

    visit new_session_path
    fill_in "Email address", with: admin.email
    fill_in "Password", with: "password123"
    click_button "Sign in"
    expect(page).to have_button("Sign out")

    visit new_admin_import_path
    attach_file "Spreadsheet", Rails.root.join("spec/fixtures/files/users.csv")

    perform_enqueued_jobs do
      click_button "Upload"
      expect(page).to have_content("Import progress")
    end

    expect(page).to have_content("Completed")
    expect(page).to have_content("4 / 4 rows")
    expect(page).to have_content("3 succeeded")
    expect(page).to have_content("1 failed")
    expect(User.where(email: %w[grace@example.com ada@example.com katherine@example.com]).count).to eq(3)
  end
end
