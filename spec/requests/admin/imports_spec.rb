require "rails_helper"

RSpec.describe "Admin::Imports", type: :request do
  def sign_in(user, password: "password123")
    post session_path, params: { email: user.email, password: password }
  end

  let(:admin) { create(:user, :admin) }
  let(:csv_file) { fixture_file_upload(Rails.root.join("spec/fixtures/files/users.csv"), "text/csv") }

  describe "GET /admin/imports/new" do
    it "requires an admin" do
      user = create(:user)
      sign_in(user)

      get new_admin_import_path

      expect(response).to redirect_to(profile_path)
    end

    it "renders the upload form" do
      sign_in(admin)

      get new_admin_import_path

      expect_inertia.to render_component("Admin/Imports/New")
    end
  end

  describe "POST /admin/imports" do
    it "creates an import, attaches the file, and enqueues the processing job" do
      sign_in(admin)

      expect {
        expect {
          post admin_imports_path, params: { file: csv_file }
        }.to change(Import, :count).by(1)
      }.to have_enqueued_job(Imports::ProcessSpreadsheetJob)

      import = Import.last
      expect(import.admin).to eq(admin)
      expect(import.file).to be_attached
      expect(response).to redirect_to(admin_import_path(import))
    end

    it "requires a file" do
      sign_in(admin)

      expect {
        post admin_imports_path, params: {}
      }.not_to change(Import, :count)
    end
  end

  describe "GET /admin/imports/:id" do
    it "renders the progress page" do
      import = create(:import, admin: admin)
      sign_in(admin)

      get admin_import_path(import)

      expect_inertia.to render_component("Admin/Imports/Show")
    end
  end
end
