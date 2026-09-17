# frozen_string_literal: true

# Sends visitors to the sign-in page and, until the role-based landing pages
# exist, authenticated users too. Superseded once Admin::Dashboards and
# Profiles are in place (redirect by Current.user.role).
class RootController < ApplicationController
  allow_unauthenticated_access

  def index
    redirect_to new_session_path
  end
end
