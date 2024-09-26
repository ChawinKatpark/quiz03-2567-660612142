import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const rooms = (<DB>DB).rooms;
  const totalRooms = rooms.length;
  return NextResponse.json({
    ok: true,
    rooms: rooms,
    totalRooms: totalRooms
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();

  if (!payload) {
   return NextResponse.json(
     {
       ok: false,
       message: "Invalid token",
     },
     { status: 401 }
   );
  }

  readDB();
  const { roomName } = await request.json();
  const foundRoom = (<DB>DB).rooms.find((x) => x.roomName === roomName);

  if (foundRoom) {
  return NextResponse.json(
     {
       ok: false,
       message: `Room ${ roomName } already exists`,
     },
     { status: 400 }
   );
  }

  const roomId = nanoid();
  (<DB>DB).rooms.push({ roomId, roomName,});
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${ roomName } has been created`,
  });
};
