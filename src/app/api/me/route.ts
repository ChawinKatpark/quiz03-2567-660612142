import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Chawin Katpark",
    studentId: "660612142",
  });
};
