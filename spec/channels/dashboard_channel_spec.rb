require "rails_helper"

RSpec.describe DashboardChannel, type: :channel do
  it "streams from the dashboard broadcast" do
    subscribe

    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("dashboard")
  end

  it "transmits current counts immediately on subscribe, so a late-connecting client isn't stuck at 0" do
    create(:user, :admin)

    subscribe

    expect(transmissions.last).to eq("total" => 1, "by_role" => { "admin" => 1, "user" => 0 })
  end

  it "broadcasts updated counts when a user is created" do
    expect {
      create(:user)
    }.to have_broadcasted_to("dashboard").with(total: 1, by_role: { admin: 0, user: 1 })
  end

  it "broadcasts updated counts when a user is destroyed" do
    user = create(:user)

    expect {
      user.destroy
    }.to have_broadcasted_to("dashboard").with(total: 0, by_role: { admin: 0, user: 0 })
  end

  it "broadcasts updated counts when a user's role changes" do
    user = create(:user)

    expect {
      user.update!(role: :admin)
    }.to have_broadcasted_to("dashboard").with(total: 1, by_role: { admin: 1, user: 0 })
  end

  it "does not broadcast when an unrelated attribute changes" do
    user = create(:user)

    expect {
      user.update!(full_name: "New Name")
    }.not_to have_broadcasted_to("dashboard")
  end
end
