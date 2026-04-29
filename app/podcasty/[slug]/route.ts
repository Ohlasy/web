import { NextResponse } from "next/server";
import { absolute, RouteTo } from "@/src/routing";

export async function GET() {
  // At least something until we ship a real page here
  return NextResponse.redirect(absolute(RouteTo.podcasts));
}
