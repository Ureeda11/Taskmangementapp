import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";


export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const tasks = await Task.find({ userId: userId });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    
    
    console.log("New Task Payload:", body);

    const newTask = await Task.create({
      title: body.title,
      description: body.description,
      priority: body.priority || "Medium",
      status: body.status || "todo",      
      userId: body.userId
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}