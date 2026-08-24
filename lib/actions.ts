"use server";

import { revalidatePath } from "next/cache";
import { appendAudit } from "./audit";
import { prisma } from "./db";
import { IDS } from "./engine/types";
import { SHIPMENT_PERIOD } from "./language";
import { assertTransition } from "./state";

export async function resetDemo() {
  const { seedDemo } = await import("./bootstrap");
  await seedDemo();
  revalidatePath("/", "layout");
}

export async function approveRecommendation() {
  const rec = await prisma.recommendation.findUniqueOrThrow({ where: { id: IDS.recommendation } });
  assertTransition(rec.status, "APPROVED");
  await prisma.recommendation.update({
    where: { id: rec.id },
    data: { status: "APPROVED" },
  });
  await appendAudit({
    action: "recommendation.approved",
    actor: "pacific-grain-buyer",
    subjectId: rec.id,
    detail: { from: rec.status, to: "APPROVED" },
  });
  revalidatePath("/");
  revalidatePath(`/recommendation/${rec.id}`);
}

export async function createRfq() {
  const existing = await prisma.rfq.findUnique({ where: { id: IDS.rfq } });
  if (existing) {
    revalidatePath(`/rfq/${IDS.rfq}`);
    return;
  }
  const rec = await prisma.recommendation.findUniqueOrThrow({ where: { id: IDS.recommendation } });
  if (rec.status === "RECOMMENDATION") {
    await prisma.recommendation.update({ where: { id: rec.id }, data: { status: "APPROVED" } });
    await appendAudit({
      action: "recommendation.approved",
      actor: "pacific-grain-buyer",
      subjectId: rec.id,
      detail: { from: "RECOMMENDATION", to: "APPROVED", via: "createRfq" },
    });
  }
  const current = await prisma.recommendation.findUniqueOrThrow({ where: { id: rec.id } });
  assertTransition(current.status, "RFQ_DRAFTED");

  const payload = {
    rfqId: IDS.rfq,
    buyer: "Pacific Grain Pte Ltd",
    sku: rec.sku,
    originPreferred: rec.origin,
    grade: rec.grade,
    tonnes: rec.tonnes,
    window: `${rec.windowDaysLow}–${rec.windowDaysHigh} days`,
    shipment: SHIPMENT_PERIOD,
    incoterm: "CFR Singapore",
    notes: "Synthetic RFQ for the RiceDAX walkthrough. Not a live enquiry.",
  };

  await prisma.rfq.create({
    data: {
      id: IDS.rfq,
      traderId: IDS.trader,
      recommendationId: rec.id,
      status: "RFQ_DRAFTED",
      payloadJson: JSON.stringify(payload),
    },
  });
  await prisma.recommendation.update({ where: { id: rec.id }, data: { status: "RFQ_DRAFTED" } });
  await appendAudit({
    action: "rfq.drafted",
    actor: "pacific-grain-buyer",
    subjectId: IDS.rfq,
    detail: payload,
  });

  await seedQuotes();
  revalidatePath("/");
  revalidatePath(`/rfq/${IDS.rfq}`);
}

async function seedQuotes() {
  const rec = await prisma.recommendation.findUniqueOrThrow({ where: { id: IDS.recommendation } });
  assertTransition(rec.status, "QUOTES_IN");

  await prisma.quote.createMany({
    data: [
      {
        id: "q_mekong",
        rfqId: IDS.rfq,
        supplierId: IDS.mekong,
        fobUsdPerT: 579,
        freightUsdPerT: 29,
        landedUsdPerT: 608,
        leadDays: 18,
        terms: "FOB HCMC · Fragrant 5% Broken · CAD · 50kg bags",
      },
      {
        id: "q_bangkok",
        rfqId: IDS.rfq,
        supplierId: IDS.bangkok,
        fobUsdPerT: 618,
        freightUsdPerT: 25,
        landedUsdPerT: 643,
        leadDays: 22,
        terms: "FOB Bangkok · Hom Mali 100% Grade B · CAD · 50kg bags",
      },
    ],
  });

  await prisma.rfq.update({ where: { id: IDS.rfq }, data: { status: "QUOTES_IN" } });
  await prisma.recommendation.update({ where: { id: rec.id }, data: { status: "QUOTES_IN" } });
  await appendAudit({
    action: "rfq.quotes_in",
    actor: "system",
    subjectId: IDS.rfq,
    detail: { suppliers: [IDS.mekong, IDS.bangkok] },
  });

  await prisma.rfq.update({ where: { id: IDS.rfq }, data: { status: "COMPARED" } });
  await prisma.recommendation.update({ where: { id: rec.id }, data: { status: "COMPARED" } });
  await appendAudit({
    action: "rfq.compared",
    actor: "engine",
    subjectId: IDS.rfq,
    detail: { preferred: IDS.mekong, landedUsdPerT: 608 },
  });
}
