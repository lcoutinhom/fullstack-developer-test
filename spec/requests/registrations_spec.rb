require "rails_helper"

RSpec.describe "Registrations", type: :request do
  describe "GET /registration/new" do
    it "renders the sign-up page" do
      get new_registration_path

      expect_inertia.to render_component("Registrations/New")
    end
  end

  describe "POST /registration" do
    it "creates a user with the user role and signs them in" do
      post registration_path, params: {
        full_name: "Grace Hopper",
        email: "grace@example.com",
        password: "password123",
        password_confirmation: "password123",
      }

      user = User.find_by(email: "grace@example.com")
      expect(user).to be_present
      expect(user).to be_user
      expect(response).to redirect_to(profile_path)
      expect(user.sessions.count).to eq(1)
    end

    it "ignores an injected role param and always creates a plain user" do
      post registration_path, params: {
        full_name: "Grace Hopper",
        email: "grace@example.com",
        password: "password123",
        password_confirmation: "password123",
        role: "admin",
      }

      expect(User.find_by(email: "grace@example.com")).to be_user
    end

    it "re-renders with errors when invalid" do
      expect {
        post registration_path, params: { full_name: "", email: "", password: "short", password_confirmation: "short" }
      }.not_to change(User, :count)

      expect_inertia.to render_component("Registrations/New")
    end
  end
end
