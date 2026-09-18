require "rails_helper"

RSpec.describe User, type: :model do
  subject(:user) { build(:user) }

  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
  it { is_expected.to have_secure_password }
  it { is_expected.to validate_presence_of(:full_name) }

  it "defaults role to user" do
    expect(User.new.role).to eq("user")
  end

  it { is_expected.to define_enum_for(:role).with_values(user: 0, admin: 1) }

  describe "#avatar_url=" do
    it "downloads and attaches the image from the given URL" do
      image = Rails.root.join("spec/fixtures/files/avatar.png").read
      stub_request(:get, "https://example.com/avatar.png")
        .to_return(status: 200, body: image, headers: { "Content-Type" => "image/png" })

      user.avatar_url = "https://example.com/avatar.png"

      expect(user.avatar_image).to be_attached
    end

    it "rejects non-HTTP(S) URLs" do
      expect { user.avatar_url = "file:///etc/passwd" }.to raise_error(ArgumentError)
    end
  end

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
