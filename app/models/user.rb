class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_one_attached :avatar_image

  enum :role, { user: 0, admin: 1 }, default: :user

  normalizes :email, with: ->(e) { e.strip.downcase }

  validates :email, presence: true, uniqueness: { case_sensitive: false },
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :full_name, presence: true

  # Streams a remote image into avatar_image. Restricted to http(s) with a
  # size/time limit as a basic guard against SSRF and abusive uploads.
  def avatar_url=(url)
    return if url.blank?

    uri = URI.parse(url)
    raise ArgumentError, "avatar_url must be an http(s) URL" unless uri.is_a?(URI::HTTP)

    tempfile = Down.download(url, max_size: 10.megabytes, open_timeout: 5, read_timeout: 10)
    avatar_image.attach(
      io: tempfile,
      filename: tempfile.original_filename || File.basename(uri.path).presence || "avatar",
      content_type: tempfile.content_type
    )
  ensure
    tempfile&.close!
  end
end
