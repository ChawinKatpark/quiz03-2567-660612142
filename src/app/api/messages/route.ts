import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken, Payload } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  const rooms = (<DB>DB).rooms;
  const foundRoom = rooms.find((x) => x.roomId === roomId);
  if (!foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const message = (<DB>DB).messages.filter((x) => x.roomId === roomId);
  return NextResponse.json({
    ok: true,
    message,
  });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  readDB();
  const datas = <DB>DB;
  const foundRoom = datas.rooms.find((x) => x.roomId === body.roomId);
  if (!foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  (<DB>DB).messages.push({
    roomId: foundRoom.roomId,
    messageId: messageId,
    messageText: body.messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  if (!payload || (<Payload>payload).role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
  }

  const body = await request.json();
  readDB();
  const messages = (<DB>DB).messages;
  const foundMessage = messages.find((x) => x.messageId === body.messageId);
  if (!foundMessage) {
   return NextResponse.json(
     {
       ok: false,
       message: "Message is not found",
     },
     { status: 404 }
   );
  }
  
  (<DB>DB).messages = messages.filter((m) => m.messageId !== body.messageId)
  writeDB();
  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
