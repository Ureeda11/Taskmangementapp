import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword
        });

        return NextResponse.json({ 
            message: "User registered successfully!",
            user: { id: newUser._id, username: newUser.username }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}