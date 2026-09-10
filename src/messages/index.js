module.exports = {
  message: {
    contactMessage: {
      success: "Message sent successfully",
      failure: "Message not sent",
      error: "Error sending message",
    },
    admin:{
      permissionDenied: "Permission denied",
      createproduct: {
        success: "Product created successfully",
        failure: "Failed to creating product",
        error: "Error creating product",
        titleAlreadyExists: "Title already exists",
      },
      updateproduct: {
        success: "Product updated successfully",
        failure: "Product not found",
        error: "Error updating product",
      },
      deleteproduct: {
        success: "Product deleted successfully",
        failure: "Product not found",
        error: "Error deleting product",
      },
      createuser: {
        success: "User created successfully",
        failure: "Failed to creating user",
        error: "Error creating user",
      },
      updateuser: {
        success: "User updated successfully",
        failure: "User not found",
        error: "Error updating user",
      },
      deleteuser: {
        success: "User deleted successfully",
        failure: "User not found",
        error: "Error deleting user",
      }
    },
    login: {
      success: "Login successfull",
      failure: "Login failed",
      existinguser: "User already exists",
      error: "Error logging in",
    },
    signup: {
      success: "Signup successfull",
      failure: "Signup failed",
      existinguser: "User already exists",
      error: "Error signing up",
    },
    user: {
      error: "Error",
      existing: "User already exists",
      notfound: "User not found",
      unauthorized: "Unauthorized",
    },
    passwordRecovery: {
      requested: "If the email exists, a reset link has been sent",
      success: "Password updated successfully",
      invalidToken: "Invalid or expired link",
      weakPassword: "Password must be at least 6 characters long",
      error: "Error recovering password",
    },
    account: {
      updated: "Datos actualizados correctamente",
      passwordChanged: "Contraseña actualizada correctamente",
      passwordCreated: "Contraseña creada correctamente",
      wrongPassword: "La contraseña actual no es correcta",
      weakPassword: "La contraseña debe tener al menos 6 caracteres",
      invalidUsername: "El nombre debe tener entre 2 y 40 caracteres",
      noGooglePic: "No hay una cuenta de Google vinculada para usar su foto",
      googleLinked: "Cuenta de Google vinculada correctamente",
      googleUnlinked: "Cuenta de Google desvinculada",
      googleAlreadyLinked: "Ya tienes una cuenta de Google vinculada",
      googleNotLinked: "No tienes una cuenta de Google vinculada",
      googleEmailMismatch: "El correo de esa cuenta de Google no coincide con el de tu cuenta",
      googleInUse: "Esa cuenta de Google ya está vinculada a otro usuario",
      needPasswordFirst: "Crea una contraseña antes de desvincular Google, para no quedar sin acceso",
      linkError: "No se pudo completar la vinculación",
      notfound: "User not found",
      error: "No se pudieron actualizar los datos",
    },
    product: {
      error: "Error",
      existing: "Product already exists",
      notfound: "Product not found",
    },
    search: {
      error: "Error",
    }
  }
}