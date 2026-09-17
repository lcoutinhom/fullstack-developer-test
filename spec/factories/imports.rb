FactoryBot.define do
  factory :import do
    association :admin, factory: :user, role: :admin
  end
end
