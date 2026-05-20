import Stripe from "stripe";

/* =========================
   STRIPE
========================= */

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
  {
    apiVersion: "2024-06-20",
  }
);

/* =========================
   API ROUTE
========================= */

export default async function handler(
  req,
  res
) {

  /* =========================
     ONLY POST
  ========================= */

  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {

    /* =========================
       DEBUG
    ========================= */

    console.log(
      "STRIPE SECRET:",
      process.env
        .STRIPE_SECRET_KEY
    );

    console.log(
      "REQUEST BODY:",
      req.body
    );

    /* =========================
       BODY
    ========================= */

    const {
      items,
      customer,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (
      !items ||
      items.length === 0
    ) {

      return res.status(400).json({
        error: "Cart is empty",
      });
    }

    /* =========================
       LINE ITEMS
    ========================= */

    const line_items =
      items.map((item) => ({

        price_data: {

          currency: "usd",

          product_data: {

            name:
              item.name,
          },

          unit_amount:
            Math.round(
              Number(
                item.price
              ) * 100
            ),
        },

        quantity:
          item.quantity || 1,
      }));

    /* =========================
       CREATE SESSION
    ========================= */

    const session =
      await stripe.checkout.sessions.create({

        payment_method_types: [
          "card",
        ],

        mode: "payment",

        submit_type: "pay",

        billing_address_collection:
          "auto",

        customer_email:
          customer?.email || "",

        shipping_address_collection: {

          allowed_countries: [
            "US",
            "CA",
            "GB",
            "NG",
          ],
        },

        line_items,

        success_url:
          `${req.headers.origin}/success`,

        cancel_url:
          `${req.headers.origin}/checkout`,
      });

    /* =========================
       SUCCESS
    ========================= */

    return res.status(200).json({

      id: session.id,
    });

  } catch (err) {

    /* =========================
       FULL ERROR LOGGING
    ========================= */

    console.log(
      "========== STRIPE ERROR =========="
    );

    console.log(err);

    console.log(
      "MESSAGE:",
      err?.message
    );

    console.log(
      "RAW:",
      err?.raw
    );

    console.log(
      "TYPE:",
      err?.type
    );

    console.log(
      "CODE:",
      err?.code
    );

    console.log(
      "=================================="
    );

    return res.status(500).json({

      error:
        err?.message ||

        "Stripe checkout failed",
    });
  }
}