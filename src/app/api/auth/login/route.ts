import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email, password } = await request.json();

        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

       
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        
        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            "secret_key_123", 
            { expiresIn: "1d" }
        );

       
        return NextResponse.json({
            message: "Login successful",
            token,
            user: { id: user._id, username: user.username }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export const dynamic = 'force-dynamic';