require "rails_helper"

RSpec.describe Imports::ProcessSpreadsheetJob, type: :job do
  def attach(import, fixture)
    content_type = fixture.end_with?(".csv") ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    import.file.attach(
      io: Rails.root.join("spec/fixtures/files/#{fixture}").open,
      filename: fixture,
      content_type: content_type
    )
    import
  end

  it "creates users from valid rows and tracks invalid ones without aborting the batch" do
    import = attach(create(:import), "users.csv")

    expect {
      described_class.perform_now(import)
    }.to change(User, :count).by(3) # Grace, Ada, Katherine — "Missing Email" has no email

    import.reload
    expect(import).to be_completed
    expect(import.total_rows).to eq(4)
    expect(import.processed_rows).to eq(4)
    expect(import.succeeded_rows).to eq(3)
    expect(import.failed_rows).to eq(1)
    expect(import.error_log.first["errors"].join).to match(/email/i)
  end

  it "always creates imported users with the plain user role" do
    import = attach(create(:import), "users.csv")

    described_class.perform_now(import)

    expect(User.find_by(email: "grace@example.com")).to be_user
  end

  it "broadcasts progress as rows are processed" do
    import = attach(create(:import), "users.csv")

    expect {
      described_class.perform_now(import)
    }.to have_broadcasted_to(ImportChannel.broadcasting_for(import)).at_least(:once)
  end

  it "marks the import failed if the file can't be parsed at all" do
    import = create(:import)
    import.file.attach(
      io: Rails.root.join("spec/fixtures/files/avatar.png").open,
      filename: "avatar.png",
      content_type: "image/png"
    )

    described_class.perform_now(import)

    expect(import.reload).to be_failed
  end
end
