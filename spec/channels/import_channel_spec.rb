require "rails_helper"

RSpec.describe ImportChannel, type: :channel do
  it "streams for the given import" do
    import = create(:import)

    subscribe(id: import.id)

    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_for(import)
  end

  it "transmits the import's current progress immediately on subscribe" do
    import = create(:import, status: :completed, total_rows: 4, processed_rows: 4, succeeded_rows: 3, failed_rows: 1)

    subscribe(id: import.id)

    expect(transmissions.last).to include("status" => "completed", "total_rows" => 4, "processed_rows" => 4)
  end
end
