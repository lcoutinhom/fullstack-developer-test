require "rails_helper"

RSpec.describe "Profiles", type: :request do
  def sign_in(user, password: "password123")
    post session_path, params: { email: user.email, password: password }
  end

  describe "GET /profile" do
    it "requires authentication" do
      get profile_path

      expect(response).to redirect_to(new_session_path)
    end

    it "shows the current user's own info" do
      user = create(:user, full_name: "Ada Lovelace")
      sign_in(user)

      get profile_path

      expect_inertia.to render_component("Profiles/Show")
      expect_inertia.to have_props(user: { id: user.id, full_name: "Ada Lovelace", email: user.email, role: "user" })
    end
  end

  describe "PATCH /profile" do
    it "updates the current user's own profile" do
      user = create(:user, full_name: "Ada Lovelace")
      sign_in(user)

      patch profile_path, params: { full_name: "Ada King" }

      expect(user.reload.full_name).to eq("Ada King")
    end

    it "cannot change its own role" do
      user = create(:user)
      sign_in(user)

      patch profile_path, params: { role: "admin" }

      expect(user.reload).to be_user
    end
  end

  describe "DELETE /profile" do
    it "deletes the current user's own account and signs them out" do
      user = create(:user)
      sign_in(user)

      delete profile_path

      expect(User.exists?(user.id)).to be false
      expect(response).to redirect_to(new_session_path)
    end
  end
end
