# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

admin = User.find_or_create_by!(email: "admin@example.com") do |user|
  user.full_name = "Ada Admin"
  user.password = user.password_confirmation = "password123"
  user.role = :admin
end
puts "Admin: #{admin.email} / password123"

[
  { full_name: "Grace Hopper", email: "grace@example.com" },
  { full_name: "Katherine Johnson", email: "katherine@example.com" },
  { full_name: "Margaret Hamilton", email: "margaret@example.com" },
  { full_name: "Radia Perlman", email: "radia@example.com" },
  { full_name: "Barbara Liskov", email: "barbara@example.com" }
].each do |attributes|
  user = User.find_or_create_by!(email: attributes[:email]) do |u|
    u.full_name = attributes[:full_name]
    u.password = u.password_confirmation = "password123"
    u.role = :user
  end
  puts "User: #{user.email} / password123"
end
