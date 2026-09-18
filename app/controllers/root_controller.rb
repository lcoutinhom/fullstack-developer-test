# frozen_string_literal: true

# require_authentication (from the Authentication concern, included by
# default) sends visitors to sign in; authenticated users land here and get
# sent to their role's landing page.
class RootController < ApplicationController
  def index
    redirect_to Current.user.admin? ? admin_dashboard_path : profile_path
  end
end
