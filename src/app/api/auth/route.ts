import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email, password } = await request.json();

        // 1. User dhoondein
        const user = await UserModel.findOne({ email });
        
        // Error Fix: Pehle check karein user mila ya nahi
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 2. Password check karein
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        // 3. Token generate karein
        const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1d" });

        // Sahi Response bhejien
        return NextResponse.json({
            message: "Login successful",
            token: token,
            user: { id: user._id, username: user.username }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}