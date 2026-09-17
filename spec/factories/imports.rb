FactoryBot.define do
  factory :import do
    association :admin, factory: :user, role: :admin

    after(:build) do |import|
      next if import.file.attached?

      import.file.attach(
        io: Rails.root.join("spec/fixtures/files/users.csv").open,
        filename: "users.csv",
        content_type: "text/csv"
      )
    end
  end
end
