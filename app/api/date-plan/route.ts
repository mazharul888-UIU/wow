const allowedActivities = new Set([
  "Cozy Café Date",
  "Movie Night",
  "Sunset Walk",
  "Fine Dining",
  "Surprise Me",
]);

const allowedFoods = new Set([
  "Italian",
  "Chinese",
  "Street Food",
  "Fast Food",
  "Dessert / Ice Cream",
]);

type DatePlanRequest = {
  date?: unknown;
  time?: unknown;
  activity?: unknown;
  foods?: unknown;
  notes?: unknown;
  website?: unknown;
};

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return Response.json({ error: "Invalid request origin." }, { status: 403 });
      }
    } catch {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  let body: DatePlanRequest;
  try {
    body = (await request.json()) as DatePlanRequest;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return Response.json({ ok: true });
  }

  const date = typeof body.date === "string" ? body.date.trim() : "";
  const time = typeof body.time === "string" ? body.time.trim() : "";
  const activity = typeof body.activity === "string" ? body.activity.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  const foods = Array.isArray(body.foods)
    ? body.foods.filter((item): item is string => typeof item === "string")
    : [];

  const isValid =
    isValidDate(date) &&
    isValidTime(time) &&
    allowedActivities.has(activity) &&
    foods.length > 0 &&
    foods.length <= allowedFoods.size &&
    foods.every((food) => allowedFoods.has(food)) &&
    notes.length <= 280;

  if (!isValid) {
    return Response.json({ error: "Please check the date plan choices." }, { status: 400 });
  }

  const recipient = process.env.DATE_PLAN_TO_EMAIL;
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    console.error("DATE_PLAN_TO_EMAIL is missing or invalid.");
    return Response.json({ error: "Email delivery is not configured." }, { status: 503 });
  }

  let providerResponse: Response;
  try {
    providerResponse = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Referer: origin ?? "https://wow-eta-gilt.vercel.app",
        },
        body: JSON.stringify({
          _subject: "💌 Johra said YES — a new date plan!",
          _template: "table",
          _captcha: "false",
          "Submitted by": "Johra",
          Date: date,
          Time: time,
          "Date vibe": activity,
          Food: foods.join(", "),
          "Special note": notes || "No special requests",
          "Submitted at": new Date().toISOString(),
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      },
    );
  } catch (error) {
    console.error("FormSubmit request failed.", error);
    return Response.json({ error: "Email delivery failed." }, { status: 502 });
  }

  if (!providerResponse.ok) {
    const providerMessage = await providerResponse.text();
    console.error(
      `FormSubmit returned ${providerResponse.status}: ${providerMessage.slice(0, 300)}`,
    );
    return Response.json({ error: "Email delivery failed." }, { status: 502 });
  }

  return Response.json({
    ok: true,
    activationMayBeRequired: true,
  });
}
