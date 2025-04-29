import{NextResponse} from "next/server";
import { prisma } from '../../../../lib/prisma';


export async function POST(req: Request){
    try{
        const body = await req.json();
        const{userId, questionCount, condition}= body;

        if(!userId || !questionCount){
            return NextResponse.json({error: "Missing fields"}, {status: 400});
    }

    const session = await prisma.session.create({
        data:{
            userId,
            questionCount,
            condition,
        },
    });

    return NextResponse.json(session, {status: 201});
    }catch(error){
        console.error("Session Create error:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}