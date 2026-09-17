require "rails_helper"

RSpec.describe "Admin::Users", type: :request do
  def sign_in(user, password: "password123")
    post session_path, params: { email: user.email, password: password }
  end

  let(:admin) { create(:user, :admin) }

  describe "GET /admin/users" do
    it "requires an admin" do
      user = create(:user)
      sign_in(user)

      get admin_users_path

      expect(response).to redirect_to(profile_path)
    end

    it "lists users, paginated" do
      create_list(:user, 3)
      sign_in(admin)

      get admin_users_path

      expect_inertia.to render_component("Admin/Users/Index")
      users = inertia.props[:users] || inertia.props["users"]
      expect(users.length).to eq(4) # 3 + admin
    end

    it "filters by search query" do
      create(:user, full_name: "Grace Hopper", email: "grace@example.com")
      create(:user, full_name: "Ada Lovelace", email: "ada@example.com")
      sign_in(admin)

      get admin_users_path, params: { q: "grace" }

      names = (inertia.props[:users] || inertia.props["users"]).map { |u| u["full_name"] || u[:full_name] }
      expect(names).to eq([ "Grace Hopper" ])
    end
  end

  describe "GET /admin/users/new" do
    it "renders the new user form" do
      sign_in(admin)

      get new_admin_user_path

      expect_inertia.to render_component("Admin/Users/New")
    end
  end

  describe "POST /admin/users" do
    it "creates a user and emails them a password-reset link" do
      sign_in(admin)

      expect {
        expect {
          post admin_users_path, params: { full_name: "New Hire", email: "new@example.com", role: "admin" }
        }.to change(User, :count).by(1)
      }.to have_enqueued_mail(PasswordsMailer, :reset)

      user = User.find_by(email: "new@example.com")
      expect(user).to be_admin
      expect(response).to redirect_to(admin_users_path)
    end

    it "re-renders the form when invalid" do
      sign_in(admin)

      expect {
        post admin_users_path, params: { full_name: "", email: "" }
      }.not_to change(User, :count)
      follow_redirect!

      expect_inertia.to render_component("Admin/Users/New")
    end
  end

  describe "GET /admin/users/:id/edit" do
    it "renders the edit form" do
      user = create(:user)
      sign_in(admin)

      get edit_admin_user_path(user)

      expect_inertia.to render_component("Admin/Users/Edit")
    end
  end

  describe "PATCH /admin/users/:id" do
    it "updates a user" do
      user = create(:user)
      sign_in(admin)

      patch admin_user_path(user), params: { full_name: "Updated Name" }

      expect(user.reload.full_name).to eq("Updated Name")
    end

    it "re-renders the form when invalid" do
      user = create(:user)
      sign_in(admin)

      patch admin_user_path(user), params: { email: "" }
      follow_redirect!

      expect_inertia.to render_component("Admin/Users/Edit")
    end
  end

  describe "PATCH /admin/users/:id/toggle_role" do
    it "toggles a user's role" do
      user = create(:user)
      sign_in(admin)

      patch toggle_role_admin_user_path(user)

      expect(user.reload).to be_admin
    end

    it "refuses to demote the admin's own account" do
      sign_in(admin)

      patch toggle_role_admin_user_path(admin)

      expect(admin.reload).to be_admin
    end
  end

  describe "DELETE /admin/users/:id" do
    it "deletes a user" do
      user = create(:user)
      sign_in(admin)

      expect { delete admin_user_path(user) }.to change(User, :count).by(-1)
    end
  end
end
