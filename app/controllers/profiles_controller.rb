# Scoped to Current.user: the route takes no :id, so there is no way to
# reach another user's profile through this controller.
class ProfilesController < InertiaController
  def show
    render inertia: "Profiles/Show", props: { user: user_props }
  end

  def edit
    render inertia: "Profiles/Edit", props: { user: user_props }
  end

  def update
    if Current.user.update(profile_params)
      redirect_to profile_path, notice: "Profile updated."
    else
      redirect_to edit_profile_path, inertia: { errors: Current.user.errors }
    end
  end

  def destroy
    Current.user.destroy
    terminate_session
    redirect_to new_session_path, status: :see_other, notice: "Your account has been deleted."
  end

  private
    def profile_params
      params.permit(:full_name, :email, :password, :password_confirmation, :avatar_url)
    end

    def user_props
      Current.user.as_json(only: %i[id full_name email role])
    end
end
