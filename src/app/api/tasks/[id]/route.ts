import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";


export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  
  try {
    // 1. Unwrapping the params Promise
    const { id } = await params;

    // 2. Perform the deletion
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


// 1. Update the type definition to wrap params in a Promise
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
    await dbConnect();
    try {
        // 2. Await the params object
        const { id } = await params; 
        
        const body = await req.json();
        console.log("Body: ", body);
        
        // 3. Update the Mongoose call with the non-deprecated option
        const updatedTask = await Task.findByIdAndUpdate(
            id, 
            body, 
            { returnDocument: 'after' }
        );
        
        if (!updatedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}