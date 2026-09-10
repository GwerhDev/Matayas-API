const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    // Opcional: las cuentas creadas solo con Google no tienen contraseña
    // hasta que el usuario define una desde su cuenta.
    password: { type: String, required: false },
    // Métodos de acceso disponibles. Un usuario puede tener ambos.
    // Sin default: las cuentas previas se resuelven en el serializer.
    hasPassword: { type: Boolean, required: false },
    // Origen de la foto de perfil: "none" o "google".
    profilePicSource: { type: String, enum: ["none", "google"], required: false },
    profilePic: { type: String, required: false },
    isVerified: { type: Boolean, required: false },
    method: { type: String, required: false },
    role: { type: String, required: false },
    status: { type: String, required: false },
    googleId: { type: String, required: false },
    googlePic: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
