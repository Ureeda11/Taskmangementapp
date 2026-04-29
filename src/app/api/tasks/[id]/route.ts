import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params; 
    const body = await req.json();
    
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}



export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    
    const { id } = await params; 
    
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    console.log("Incoming Task Data:", body); 

  
    if (!body.title || !body.userId) {
      return NextResponse.json({ message: "Title and UserID are required" }, { status: 400 });
    }

    
    const newTask = await Task.create({
      title: body.title,
      description: body.description,
      priority: body.priority || "Medium",
      userId: body.userId,
      status: "todo" 
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    console.error("POST ERROR DETAILS:", error); 
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}