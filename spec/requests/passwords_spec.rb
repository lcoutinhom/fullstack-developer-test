require "rails_helper"

RSpec.describe "Passwords", type: :request do
  describe "GET /passwords/new" do
    it "renders the forgot-password page" do
      get new_password_path

      expect_inertia.to render_component("Passwords/New")
    end
  end

  describe "POST /passwords" do
    it "enqueues a reset email without revealing whether the address exists" do
      user = create(:user)

      expect { post passwords_path, params: { email: user.email } }
        .to have_enqueued_mail(PasswordsMailer, :reset)

      expect(response).to redirect_to(new_session_path)
    end

    it "delivers the reset email to the user's address" do
      user = create(:user)

      perform_enqueued_jobs do
        post passwords_path, params: { email: user.email }
      end

      expect(ActionMailer::Base.deliveries.last.to).to eq([ user.email ])
    end

    it "does not error out for an unknown email address" do
      post passwords_path, params: { email: "nobody@example.com" }

      expect(response).to redirect_to(new_session_path)
    end
  end

  describe "GET /passwords/:token/edit" do
    it "renders the reset-password page for a valid token" do
      user = create(:user)

      get edit_password_path(user.password_reset_token)

      expect_inertia.to render_component("Passwords/Edit")
    end

    it "redirects for an invalid token" do
      get edit_password_path("not-a-real-token")

      expect(response).to redirect_to(new_password_path)
    end
  end
end
