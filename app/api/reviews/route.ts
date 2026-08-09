import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const MAX_MESSAGE = 600;
const MIN_MESSAGE = 4;
const MAX_NAME = 60;
/** Max public submissions allowed from one IP per window. */
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/** Public: approved + visible reviews only, in the admin's chosen order. */
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isVisible: true, isApproved: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        clientName: true,
        message: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json(reviews);
  } catch (error: any) {
    // The section is decorative — never break the homepage over it.
    console.error("Error fetching reviews:", error);
    return NextResponse.json([]);
  }
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim().slice(0, 64);
  return request.headers.get("x-real-ip")?.slice(0, 64) ?? "unknown";
}

/**
 * Public review submission. Stored unapproved — nothing reaches the site
 * until an admin approves it in the dashboard.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, message, website } = body ?? {};

    // Honeypot: a real user never fills a hidden field, bots usually do.
    // Respond as if it succeeded so scripts don't learn to adapt.
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true, pending: true }, { status: 201 });
    }

    const text = typeof message === "string" ? message.trim() : "";
    if (text.length < MIN_MESSAGE) {
      return NextResponse.json(
        { error: "Please write a slightly longer message." },
        { status: 400 }
      );
    }
    if (text.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: `Please keep your review under ${MAX_MESSAGE} characters.` },
        { status: 400 }
      );
    }

    const name =
      typeof clientName === "string" && clientName.trim()
        ? clientName.trim().slice(0, MAX_NAME)
        : null;

    const ip = clientIp(request);

    // Basic flood protection per IP.
    if (ip !== "unknown") {
      const recent = await prisma.review.count({
        where: {
          submitterIp: ip,
          createdAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) },
        },
      });
      if (recent >= RATE_LIMIT) {
        return NextResponse.json(
          { error: "You've submitted a few reviews already. Please try again later." },
          { status: 429 }
        );
      }
    }

    await prisma.review.create({
      data: {
        clientName: name,
        message: text,
        isApproved: false, // awaiting moderation
        isVisible: true,
        submitterIp: ip,
      },
    });

    return NextResponse.json({ success: true, pending: true }, { status: 201 });
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Could not submit your review. Please try again." },
      { status: 500 }
    );
  }
}
