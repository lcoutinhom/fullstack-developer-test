require "rails_helper"

RSpec.describe "Sessions", type: :request do
  describe "GET /session/new" do
    it "renders the sign-in page" do
      get new_session_path

      expect_inertia.to render_component("Sessions/New")
    end
  end

  describe "POST /session" do
    it "logs the user in with correct credentials" do
      user = create(:user, password: "password123")

      post session_path, params: { email: user.email, password: "password123" }

      expect(response).to redirect_to(root_url)
      expect(user.sessions.count).to eq(1)
    end

    it "rejects incorrect credentials" do
      user = create(:user, password: "password123")

      post session_path, params: { email: user.email, password: "wrong" }

      expect(response).to redirect_to(new_session_path)
      expect(flash[:alert]).to be_present
      expect(user.sessions.count).to eq(0)
    end
  end

  describe "DELETE /session" do
    it "logs the user out" do
      user = create(:user, password: "password123")
      post session_path, params: { email: user.email, password: "password123" }

      delete session_path

      expect(response).to redirect_to(new_session_path)
      expect(user.sessions.reload.count).to eq(0)
    end
  end
end
