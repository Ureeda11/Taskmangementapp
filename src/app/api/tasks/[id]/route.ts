import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await req.json();
    const updatedTask = await Task.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    await Task.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}