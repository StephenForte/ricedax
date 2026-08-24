import { NextResponse } from "next/server";
import { buildExport, EXPORT_CATALOG, type ExportKind } from "@/lib/export";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const kind = new URL(req.url).searchParams.get("kind") as ExportKind | null;
  if (!kind || !EXPORT_CATALOG.some((e) => e.kind === kind)) {
    return NextResponse.json({ ok: false, kinds: EXPORT_CATALOG.map((e) => e.kind) }, { status: 400 });
  }
  const file = await buildExport(kind);
  return new NextResponse(file.body, {
    headers: {
      "content-type": file.type,
      "content-disposition": `attachment; filename="${file.filename}"`,
    },
  });
}
