class Import < ApplicationRecord
  belongs_to :admin, class_name: "User"
  has_one_attached :file

  enum :status, { pending: 0, processing: 1, completed: 2, failed: 3 }, default: :pending

  validates :file, presence: true
end
