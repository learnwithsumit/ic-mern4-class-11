const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // validation
            trim: true, // sanitization
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

// Check if email is taken (model-level helper)
userSchema.statics.isEmailTaken = async function (email) {
    const user = await this.findOne({ email });

    return !!user;
};

// Check if password matched or not (instance-level helper)
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;

    return bcryptjs.compare(password, user.password);
};

// hash password before saving the user
userSchema.pre("save", async function (next) {
    const user = this;

    user.password = await bcryptjs.hash(user.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
