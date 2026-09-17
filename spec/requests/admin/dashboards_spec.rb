require "rails_helper"

RSpec.describe "Admin::Dashboards", type: :request do
  def sign_in(user, password: "password123")
    post session_path, params: { email: user.email, password: password }
  end

  describe "GET /admin/dashboard" do
    it "requires authentication" do
      get admin_dashboard_path

      expect(response).to redirect_to(new_session_path)
    end

    it "blocks a non-admin user" do
      user = create(:user)
      sign_in(user)

      get admin_dashboard_path

      expect(response).to redirect_to(profile_path)
    end

    it "renders the dashboard for an admin" do
      admin = create(:user, :admin)
      sign_in(admin)

      get admin_dashboard_path

      expect_inertia.to render_component("Admin/Dashboard")
    end
  end
end
