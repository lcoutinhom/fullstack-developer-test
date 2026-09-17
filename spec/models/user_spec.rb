require "rails_helper"

RSpec.describe User, type: :model do
  subject(:user) { build(:user) }

  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
  it { is_expected.to have_secure_password }

  it "normalizes email to a stripped, downcased value" do
    user.email = "  User@Example.com  "
    user.valid?

    expect(user.email).to eq("user@example.com")
  end

  it "authenticates with the correct password" do
    user.save!

    expect(User.authenticate_by(email: user.email, password: "password123")).to eq(user)
  end

  it "does not authenticate with the wrong password" do
    user.save!

    expect(User.authenticate_by(email: user.email, password: "wrong")).to be_nil
  end
end
