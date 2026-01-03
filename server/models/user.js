import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    //   minlength: 6,
    // },
    interests: [String],
    keywords: [String],
  },
  { timestamps: true }
);

// 🔥 IMPORTANT: normal function, not arrow
// userSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });



// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
