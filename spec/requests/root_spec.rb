require "rails_helper"

RSpec.describe "Root", type: :request do
  def sign_in(user, password: "password123")
    post session_path, params: { email: user.email, password: password }
  end

  describe "GET /" do
    it "sends a visitor to sign in" do
      get root_path

      expect(response).to redirect_to(new_session_path)
    end

    it "sends a regular user to their profile" do
      user = create(:user)
      sign_in(user)

      get root_path

      expect(response).to redirect_to(profile_path)
    end

    it "sends an admin to the admin dashboard" do
      admin = create(:user, :admin)
      sign_in(admin)

      get root_path

      expect(response).to redirect_to(admin_dashboard_path)
    end
  end
end
