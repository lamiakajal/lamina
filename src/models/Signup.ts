import { Schema, model, models, type Model } from "mongoose";
import { ROLES, type Role } from "@/lib/validate";

export interface ISignup {
  name: string;
  email: string;
  role: Role;
  message?: string;
  createdAt: Date;
}

const SignupSchema = new Schema<ISignup>({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254, unique: true },
  role: { type: String, enum: ROLES, required: true },
  message: { type: String, trim: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

export const Signup: Model<ISignup> = (models.Signup as Model<ISignup>) || model<ISignup>("Signup", SignupSchema);
