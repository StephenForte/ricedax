import { NextResponse } from "next/server";
import { describeThisInstance } from "@/lib/deploy";

export async function GET(req: Request) {
  const host = req.headers.get("host");
  const instance = describeThisInstance(host);
  return NextResponse.json({
    ok: true,
    service: "ricedax-demo",
    packaging: "same-image-three-homes",
    homes: ["on-premises", "trader-private-cloud", "trader-public-cloud"],
    thisInstance: instance,
  });
}
