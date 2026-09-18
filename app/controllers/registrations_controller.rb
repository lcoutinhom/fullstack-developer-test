class RegistrationsController < InertiaController
  allow_unauthenticated_access

  def new
    render inertia: "Registrations/New"
  end

  def create
    user = User.new(registration_params)
    user.role = :user # never trust the client for this, regardless of what's submitted

    if user.save
      start_new_session_for user
      redirect_to after_authentication_url
    else
      redirect_to new_registration_path, inertia: { errors: user.errors }
    end
  end

  private
    def registration_params
      params.permit(:full_name, :email, :password, :password_confirmation)
    end
end
